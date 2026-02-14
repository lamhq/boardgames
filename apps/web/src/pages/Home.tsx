import { useState } from "react";
import { useNavigate } from "react-router";
import Layout from "../components/Layout";

export default function Home() {
  const [playerId, setPlayerId] = useState("");
  const navigate = useNavigate();

  const handlePlay = () => {
    if (playerId.trim()) {
      navigate("/game", { state: { playerId } });
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12 md:py-20">
        <h1 className="text-responsive-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 text-center">
          Welcome to Board Games!
        </h1>
        <p className="text-responsive-lg md:text-responsive-xl text-white/90 mb-6 md:mb-8 text-center max-w-2xl">
          Play your favorite board games online with friends and family around the world. Click and play instantly!
        </p>
        
        <div className="bg-white/98 backdrop-blur-sm rounded-xl border-3 border-secondary shadow-xl p-6 md:p-8 mt-8 max-w-md w-full">
          <div className="flex flex-col gap-6 items-center">
            <div className="w-full">
              <label className="block text-responsive-base md:text-responsive-lg font-semibold text-gray-800 mb-2">
                Player Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handlePlay()}
                className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all duration-300"
              />
            </div>
            
            <button
              onClick={handlePlay}
              disabled={!playerId.trim()}
              className="w-full px-4 md:px-6 py-2 md:py-3 bg-secondary text-white rounded-lg md:rounded-xl border-3 border-secondary font-semibold text-responsive-sm md:text-responsive-base hover:bg-primary hover:border-primary hover:shadow-lg transition-all duration-300 active:scale-95 disabled:bg-gray-500 disabled:border-gray-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Play Now
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
