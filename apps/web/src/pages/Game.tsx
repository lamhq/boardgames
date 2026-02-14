import { useEffect } from "react";
import { useParams, Link } from "react-router";
import { useForm } from "react-hook-form";
// import { Client } from "@repo/boardgame.io/react";
// import { NativeWebSocket, SocketIO } from "@repo/boardgame.io/multiplayer";
// import { TicTacToeGame } from "../TicTacToeGame";
// import { TicTacToeBoard } from "../TicTacToeBoard";
import Layout from "../components/Layout";

// const BoardGameClient = Client({
//   game: TicTacToeGame,
//   board: TicTacToeBoard,
//   multiplayer: NativeWebSocket({
//     server: "ws://localhost:8000",
//   }),
// });
// const BoardGameClient = Client({
//   game: GameConfig,
//   board: MyGameBoard,
//   multiplayer: SocketIO({
//     server: "localhost:8000"
//   }),
// });

export default function Game() {
  const { gameId } = useParams();
  const {
    register,
    watch,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      playerName: localStorage.getItem("playerName") || "",
    },
  });

  const playerName = watch("playerName");

  // Save player name to localStorage whenever it changes
  useEffect(() => {
    if (playerName) {
      localStorage.setItem("playerName", playerName);
    }
  }, [playerName]);

  const onSubmit = (data: { playerName: string }) => {
    console.log({
      gameId,
      playerName: data.playerName,
    });
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen py-12">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border-3 border-secondary shadow-xl p-6 md:p-8 max-w-md w-full">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
            Enter Player Name
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="please enter your name"
              autoFocus
              {...register("playerName")}
              className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg px-4 py-3 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all duration-300 text-white placeholder:text-white/50 placeholder:italic"
            />
            <button
              type="submit"
              disabled={!isValid}
              className="primary-btn"
            >
              Start
            </button>
            <Link
              to="/"
              className="text-white underline hover:text-white/80 transition-colors duration-300 text-center text-base"
            >
              ← Back
            </Link>
          </form>
        </div>
      </div>
    </Layout>
  );
}
