/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React, { useRef, useState, useEffect } from 'react';
import { Client as RawClient } from './client';
import type { ClientOpts, ClientState, _ClientImpl } from './client';

type WrappedBoardDelegates = 'matchID' | 'playerID' | 'credentials';

export type WrappedBoardProps = Pick<
  ClientOpts,
  WrappedBoardDelegates | 'debug'
>;

type ExposedClientProps<G extends any = any> = Pick<
  _ClientImpl<G>,
  | 'log'
  | 'moves'
  | 'events'
  | 'reset'
  | 'undo'
  | 'redo'
  | 'playerID'
  | 'matchID'
  | 'matchData'
  | 'sendChatMessage'
  | 'chatMessages'
>;

export type BoardProps<G extends any = any> = ClientState<G> &
  Omit<WrappedBoardProps, keyof ExposedClientProps<G>> &
  ExposedClientProps<G> & {
    isMultiplayer: boolean;
  };

type ReactClientOpts<
  G extends any = any,
  P extends BoardProps<G> = BoardProps<G>,
  PluginAPIs extends Record<string, unknown> = Record<string, unknown>
> = Omit<ClientOpts<G, PluginAPIs>, WrappedBoardDelegates> & {
  board?: React.ComponentType<P>;
  loading?: React.ComponentType;
};

/**
 * Client
 *
 * boardgame.io React client.
 *
 * @param {...object} game - The return value of `Game`.
 * @param {...object} numPlayers - The number of players.
 * @param {...object} board - The React component for the game.
 * @param {...object} loading - (optional) The React component for the loading state.
 * @param {...object} multiplayer - Set to a falsy value or a transportFactory, e.g., SocketIO()
 * @param {...object} debug - Enables the Debug UI.
 * @param {...object} enhancer - Optional enhancer to send to the Redux store
 *
 * Returns:
 *   A React component that wraps board and provides an
 *   API through props for it to interact with the framework
 *   and dispatch actions such as MAKE_MOVE, GAME_EVENT, RESET,
 *   UNDO and REDO.
 */
export function Client<
  G extends any = any,
  P extends BoardProps<G> = BoardProps<G>,
  PluginAPIs extends Record<string, unknown> = Record<string, unknown>
>(opts: ReactClientOpts<G, P, PluginAPIs>) {
  const { game, numPlayers, board, multiplayer, enhancer } = opts;
  let { loading, debug } = opts;

  // Component that is displayed before the client has synced
  // with the game master.
  if (loading === undefined) {
    const Loading = () => <div className="bgio-loading">connecting...</div>;
    loading = Loading;
  }

  type AdditionalProps = Omit<P, keyof BoardProps<G>>;

  /*
   * WrappedBoard
   *
   * The main React component that wraps the passed in
   * board component and adds the API to its props.
   */
  const WrappedBoard: React.FC<WrappedBoardProps & AdditionalProps> = (props) => {
    const {
      matchID = 'default',
      playerID = null,
      credentials = null,
      debug: debugProp = true,
      ...rest
    } = props;

    const clientRef = useRef<_ClientImpl<G> | null>(null);
    const [, setUpdateTrigger] = useState<object>({});

    // Determine effective debug value
    const effectiveDebug = debug !== undefined ? debug : debugProp;

    // Initialize client once on mount
    useEffect(() => {
      clientRef.current = RawClient({
        game,
        debug: effectiveDebug,
        numPlayers,
        multiplayer,
        matchID,
        playerID,
        credentials,
        enhancer,
      });

      const unsubscribe = clientRef.current.subscribe(() =>
        setUpdateTrigger({})
      );

      clientRef.current.start();

      return () => {
        clientRef.current?.stop();
        unsubscribe();
      };
    }, []);

    // Handle matchID changes
    useEffect(() => {
      clientRef.current?.updateMatchID(matchID);
    }, [matchID]);

    // Handle playerID changes
    useEffect(() => {
      clientRef.current?.updatePlayerID(playerID);
    }, [playerID]);

    // Handle credentials changes
    useEffect(() => {
      clientRef.current?.updateCredentials(credentials);
    }, [credentials]);

    const state = clientRef.current?.getState() ?? null;

    if (state === null) {
      const LoadingComponent = loading;
      return <LoadingComponent />;
    }

    if (!board || !clientRef.current) {
      return <div className="bgio-client" />;
    }

    const client = clientRef.current;
    const BoardComponent = board;
    
    return (
      <div className="bgio-client">
        <BoardComponent
          {...state}
          {...(rest as P)}
          isMultiplayer={!!multiplayer}
          moves={client.moves}
          events={client.events}
          matchID={client.matchID}
          playerID={client.playerID}
          reset={client.reset}
          undo={client.undo}
          redo={client.redo}
          log={client.log}
          matchData={client.matchData}
          sendChatMessage={client.sendChatMessage}
          chatMessages={client.chatMessages}
        />
      </div>
    );
  };

  WrappedBoard.displayName = 'WrappedBoard';

  return WrappedBoard;
}
