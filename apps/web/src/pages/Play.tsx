import { useNavigate, useSearchParams } from "react-router";
import { Client } from "@bgio/web/react";
import { SocketIO } from "@bgio/web/multiplayer";
import { TicTacToeGame } from "../tic-tac-toe";
import { TicTacToeBoard } from "../components/TicTacToeBoard";
import Layout from "../components/Layout";
import ErrorPage from "../components/ErrorPage";

export default function Play() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const gameId = searchParams.get("gameId");
  const matchId = searchParams.get("matchId");
  const playerId = searchParams.get("playerId");

  if (!gameId || !matchId || !playerId) {
    return <ErrorPage message="Invalid page arguments" />;
  }

  const BoardGameClient = Client({
    game: TicTacToeGame,
    board: TicTacToeBoard,
    multiplayer: SocketIO({
      server: "localhost:8000",
    }),
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading game...</div>
      </div>
    ),
  });

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
        {/* Player Name and Game Info */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            {playerId}
          </h1>
          <p className="text-white/70 text-sm">Match: {matchId}</p>
        </div>

        {/* Game Board */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border-2 border-white/20 p-8 mb-8">
          <BoardGameClient playerID={playerId} matchID={matchId} />
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-white underline hover:text-white/80 transition-colors duration-300 text-center text-base"
        >
          ← Back
        </button>
      </div>
    </Layout>
  );
}
