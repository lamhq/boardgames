import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import ErrorPage from "../components/ErrorPage";

const generatePlayerName = () => {
  const adjectives = ["Swift", "Brave", "Clever", "Quick", "Smart", "Bold"];
  const nouns = ["Panda", "Tiger", "Eagle", "Wolf", "Dragon", "Phoenix"];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective}${noun}`;
};

export default function Game() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const savedName = localStorage.getItem("playerName") || generatePlayerName();
  
  const {
    register,
    watch,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      playerName: savedName,
    },
  });
  const playerName = watch("playerName");

  // Save player name to localStorage whenever it changes
  useEffect(() => {
    if (playerName) {
      localStorage.setItem("playerName", playerName);
    }
  }, [playerName]);

  if (!gameId) {
    return <ErrorPage message="Invalid game parameters" />;
  }

  const onSubmit = (data: { playerName: string }) => {
    const matchId = 'm4';
    const playerId = data.playerName;
    const params = new URLSearchParams({
      gameId,
      matchId,
      playerId,
    });
    navigate(`/play?${params.toString()}`);
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
