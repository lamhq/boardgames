/*
 * Copyright 2018 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Cookies from 'react-cookies';
import { Client } from '../client/react';
import { MCTSBot } from '../../core/ai';
import { Local, SocketIO } from '../client';
import type { GameComponent } from './connection';
import { LobbyConnection } from './connection';
import LobbyLoginForm from './login-form';
import type { MatchOpts } from './match-instance';
import LobbyMatchInstance from './match-instance';
import LobbyCreateMatchForm from './create-match-form';
import type { LobbyAPI } from '../../core/types';

enum LobbyPhases {
  ENTER = 'enter',
  PLAY = 'play',
  LIST = 'list',
}

type RunningMatch = {
  app: ReturnType<typeof Client>;
  matchID: string;
  playerID: string;
  credentials?: string;
};

type LobbyProps = {
  gameComponents: GameComponent[];
  lobbyServer?: string;
  gameServer?: string;
  clientFactory?: typeof Client;
  refreshInterval?: number;
  renderer?: (args: {
    errorMsg: string;
    gameComponents: GameComponent[];
    matches: LobbyAPI.MatchList['matches'];
    phase: LobbyPhases;
    playerName: string;
    runningMatch?: RunningMatch;
    handleEnterLobby: (playerName: string) => void;
    handleExitLobby: () => Promise<void>;
    handleCreateMatch: (gameName: string, numPlayers: number) => Promise<void>;
    handleJoinMatch: (
      gameName: string,
      matchID: string,
      playerID: string
    ) => Promise<void>;
    handleLeaveMatch: (gameName: string, matchID: string) => Promise<void>;
    handleExitMatch: () => void;
    handleRefreshMatches: () => Promise<void>;
    handleStartMatch: (gameName: string, matchOpts: MatchOpts) => void;
  }) => React.ReactElement;
};

/**
 * Lobby
 *
 * React lobby component.
 *
 * @param {Array}  gameComponents - An array of Board and Game objects for the supported games.
 * @param {string} lobbyServer - Address of the lobby server (for example 'localhost:8000').
 *                               If not set, defaults to the server that served the page.
 * @param {string} gameServer - Address of the game server (for example 'localhost:8001').
 *                              If not set, defaults to the server that served the page.
 * @param {function} clientFactory - Function that is used to create the game clients.
 * @param {number} refreshInterval - Interval between server updates (default: 2000ms).
 *
 * Returns:
 *   A React component that provides a UI to create, list, join, leave, play or
 *   spectate matches (game instances).
 */

function Lobby({
  gameComponents,
  lobbyServer,
  gameServer,
  clientFactory = Client,
  refreshInterval = 2000,
  renderer,
}: LobbyProps) {
  const [phase, setPhase] = useState<LobbyPhases>(LobbyPhases.ENTER);
  const [playerName, setPlayerName] = useState('Visitor');
  const [runningMatch, setRunningMatch] = useState<RunningMatch | undefined>();
  const [errorMsg, setErrorMsg] = useState('');
  const [credentialStore, setCredentialStore] = useState<Record<string, string>>({});
  const [matches, setMatches] = useState<LobbyAPI.MatchList['matches']>([]);

  const connectionRef = useRef<ReturnType<typeof LobbyConnection> | null>(null);
  const currentIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const createConnection = useCallback(
    (newPlayerName: string, newCredentials?: string) => {
      connectionRef.current = LobbyConnection({
        server: lobbyServer,
        gameComponents,
        playerName: newPlayerName,
        playerCredentials: newCredentials,
      });
    },
    [lobbyServer, gameComponents]
  );

  const clearRefreshInterval = useCallback(() => {
    if (currentIntervalRef.current) {
      clearInterval(currentIntervalRef.current);
      currentIntervalRef.current = undefined;
    }
  }, []);

  const updateConnection = useCallback(async () => {
    if (connectionRef.current) {
      await connectionRef.current.refresh();
      setMatches([...connectionRef.current.matches]);
    }
  }, []);

  const startRefreshInterval = useCallback(() => {
    clearRefreshInterval();
    currentIntervalRef.current = setInterval(
      updateConnection,
      refreshInterval
    );
  }, [clearRefreshInterval, updateConnection, refreshInterval]);

  // Mount effect: load from cookies
  useEffect(() => {
    const cookie = Cookies.load('lobbyState') || {};
    let newPhase = cookie.phase || LobbyPhases.ENTER;
    if (newPhase === LobbyPhases.PLAY) {
      newPhase = LobbyPhases.LIST;
    }
    const newPlayerName = cookie.playerName || 'Visitor';
    const newCredentialStore = cookie.credentialStore || {};

    setPhase(newPhase);
    setPlayerName(newPlayerName);
    setCredentialStore(newCredentialStore);

    if (newPhase !== LobbyPhases.ENTER) {
      createConnection(newPlayerName, newCredentialStore[newPlayerName]);
    } else {
      createConnection(newPlayerName);
    }

    if (newPhase !== LobbyPhases.ENTER) {
      startRefreshInterval();
    }
  }, []);

  // Handle changes to player name, phase, or credentials
  useEffect(() => {
    const creds = credentialStore[playerName];
    createConnection(playerName, creds);
    updateConnection();

    const cookie = {
      phase,
      playerName,
      credentialStore,
    };
    Cookies.save('lobbyState', cookie, { path: '/' });
  }, [phase, playerName, credentialStore, createConnection, updateConnection]);

  // Handle refreshInterval changes
  useEffect(() => {
    if (phase !== LobbyPhases.ENTER) {
      startRefreshInterval();
    }

    return () => {
      clearRefreshInterval();
    };
  }, [refreshInterval, phase, startRefreshInterval, clearRefreshInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearRefreshInterval();
    };
  }, [clearRefreshInterval]);

  const updateCredentials = useCallback(
    (newPlayerName: string, credentials: string) => {
      setCredentialStore((prevStore: Record<string, string>) => ({
        ...prevStore,
        [newPlayerName]: credentials,
      }));
    },
    []
  );

  const enterLobby = useCallback((newPlayerName: string) => {
    startRefreshInterval();
    setPlayerName(newPlayerName);
    setPhase(LobbyPhases.LIST);
  }, [startRefreshInterval]);

  const exitLobby = useCallback(async () => {
    clearRefreshInterval();
    if (connectionRef.current) {
      await connectionRef.current.disconnect();
    }
    setPhase(LobbyPhases.ENTER);
    setErrorMsg('');
  }, [clearRefreshInterval]);

  const createMatch = useCallback(
    async (gameName: string, numPlayers: number) => {
      try {
        if (connectionRef.current) {
          await connectionRef.current.create(gameName, numPlayers);
          await connectionRef.current.refresh();
          setMatches([...connectionRef.current.matches]);
        }
      } catch (error) {
        setErrorMsg(error instanceof Error ? error.message : 'Unknown error');
      }
    },
    []
  );

  const joinMatch = useCallback(
    async (gameName: string, matchID: string, playerID: string) => {
      try {
        if (connectionRef.current) {
          await connectionRef.current.join(gameName, matchID, playerID);
          await connectionRef.current.refresh();
          setMatches([...connectionRef.current.matches]);
          updateCredentials(
            connectionRef.current.playerName,
            connectionRef.current.playerCredentials
          );
        }
      } catch (error) {
        setErrorMsg(error instanceof Error ? error.message : 'Unknown error');
      }
    },
    [updateCredentials]
  );

  const leaveMatch = useCallback(
    async (gameName: string, matchID: string) => {
      try {
        if (connectionRef.current) {
          await connectionRef.current.leave(gameName, matchID);
          await connectionRef.current.refresh();
          setMatches([...connectionRef.current.matches]);
          updateCredentials(
            connectionRef.current.playerName,
            connectionRef.current.playerCredentials
          );
        }
      } catch (error) {
        setErrorMsg(error instanceof Error ? error.message : 'Unknown error');
      }
    },
    [updateCredentials]
  );

  const startMatch = useCallback(
    (gameName: string, matchOpts: MatchOpts) => {
      if (!connectionRef.current) return;

      const gameCode = connectionRef.current._getGameComponents(gameName);
      if (!gameCode) {
        setErrorMsg('game ' + gameName + ' not supported');
        return;
      }

      let multiplayer: ReturnType<typeof SocketIO> | ReturnType<typeof Local> | undefined = undefined;
      if (matchOpts.numPlayers > 1) {
        multiplayer = gameServer ? SocketIO({ server: gameServer }) : SocketIO();
      }

      if (matchOpts.numPlayers === 1) {
        const maxPlayers = gameCode.game.maxPlayers;
        const bots: Record<string, typeof MCTSBot> = {};
        for (let i = 1; i < maxPlayers; i++) {
          bots[i + ''] = MCTSBot;
        }
        multiplayer = Local({ bots });
      }

      const app = clientFactory({
        game: gameCode.game,
        board: gameCode.board,
        multiplayer,
      });

      const match: RunningMatch = {
        app,
        matchID: matchOpts.matchID,
        playerID: matchOpts.numPlayers > 1 ? matchOpts.playerID : '0',
        credentials: connectionRef.current.playerCredentials,
      };

      clearRefreshInterval();
      setPhase(LobbyPhases.PLAY);
      setRunningMatch(match);
    },
    [gameServer, clientFactory, clearRefreshInterval]
  );

  const exitMatch = useCallback(() => {
    startRefreshInterval();
    setPhase(LobbyPhases.LIST);
    setRunningMatch(undefined);
  }, [startRefreshInterval]);

  const getPhaseVisibility = (phaseValue: LobbyPhases) => {
    return phase !== phaseValue ? 'hidden' : 'phase';
  };

  const renderMatches = (
    matchesList: LobbyAPI.MatchList['matches'],
    name: string
  ) => {
    return matchesList.map((match) => {
      const { matchID, gameName, players } = match;
      return (
        <LobbyMatchInstance
          key={'instance-' + matchID}
          match={{ matchID, gameName, players: Object.values(players) }}
          playerName={name}
          onClickJoin={joinMatch}
          onClickLeave={leaveMatch}
          onClickPlay={startMatch}
        />
      );
    });
  };

  if (renderer) {
    return renderer({
      errorMsg,
      gameComponents,
      matches,
      phase,
      playerName,
      runningMatch,
      handleEnterLobby: enterLobby,
      handleExitLobby: exitLobby,
      handleCreateMatch: createMatch,
      handleJoinMatch: joinMatch,
      handleLeaveMatch: leaveMatch,
      handleExitMatch: exitMatch,
      handleRefreshMatches: updateConnection,
      handleStartMatch: startMatch,
    });
  }

  return (
    <div id="lobby-view" style={{ padding: 50 }}>
      <div className={getPhaseVisibility(LobbyPhases.ENTER)}>
        <LobbyLoginForm
          key={playerName}
          playerName={playerName}
          onEnter={enterLobby}
        />
      </div>

      <div className={getPhaseVisibility(LobbyPhases.LIST)}>
        <p>Welcome, {playerName}</p>

        <div className="phase-title" id="match-creation">
          <span>Create a match:</span>
          <LobbyCreateMatchForm
            games={gameComponents}
            createMatch={createMatch}
          />
        </div>
        <p className="phase-title">Join a match:</p>
        <div id="instances">
          <table>
            <tbody>{renderMatches(matches, playerName)}</tbody>
          </table>
          <span className="error-msg">
            {errorMsg}
            <br />
          </span>
        </div>
        <p className="phase-title">
          Matches that become empty are automatically deleted.
        </p>
      </div>

      <div className={getPhaseVisibility(LobbyPhases.PLAY)}>
        {runningMatch && (
          <runningMatch.app
            matchID={runningMatch.matchID}
            playerID={runningMatch.playerID}
            credentials={runningMatch.credentials}
          />
        )}
        <div className="buttons" id="match-exit">
          <button onClick={exitMatch}>Exit match</button>
        </div>
      </div>

      <div className="buttons" id="lobby-exit">
        <button onClick={exitLobby}>Exit lobby</button>
      </div>
    </div>
  );
}

export default Lobby;
