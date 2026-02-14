import { useLocation } from "react-router";
import { Client } from "@repo/boardgame.io/react";
import { NativeWebSocket, SocketIO } from "@repo/boardgame.io/multiplayer";
import { TicTacToeGame } from "../TicTacToeGame";
import { TicTacToeBoard } from "../TicTacToeBoard";
import Layout from "../components/Layout";

const BoardGameClient = Client({
  game: TicTacToeGame,
  board: TicTacToeBoard,
  multiplayer: NativeWebSocket({
    server: "ws://localhost:8000" 
  }),
});
// const BoardGameClient = Client({
//   game: GameConfig,
//   board: MyGameBoard,
//   multiplayer: SocketIO({ 
//     server: "localhost:8000" 
//   }),
// });

export default function Game() {
  const location = useLocation();
  const playerId = location.state?.playerId || "unknown";

  return (
    <Layout maxWidth="100%">
      <div className="flex flex-col gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border-3 border-white/30 p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-responsive-xl md:text-responsive-2xl font-bold text-white">
              Tic Tac Toe
            </h2>
            <p className="text-responsive-base text-white/90 font-semibold">
              Player: <span className="text-secondary">{playerId}</span>
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <BoardGameClient playerID={playerId} />
        </div>
      </div>
    </Layout>
  );
}
