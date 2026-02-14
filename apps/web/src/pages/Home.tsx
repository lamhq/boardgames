import { Link } from "react-router";
import Layout from "../components/Layout";

interface Game {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
}

const GAMES: Game[] = [
  {
    id: "tic-tac-toe",
    name: "Tic-Tac-Toe",
    thumbnail: "🎯",
    description: "Classic strategy game for two players",
  },
];

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col py-12 md:py-20">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-6">
            Welcome to Board Games!
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Play your favorite board games online with friends and family around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map((game) => (
            <div
              key={game.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl border-2 border-white/20 overflow-hidden hover:border-secondary hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="bg-gradient-to-br from-secondary/80 to-primary/80 h-48 flex items-center justify-center text-8xl">
                {game.thumbnail}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl md:text-2xl font-bold text-white mb-2">
                    {game.name}
                  </h2>
                  <p className="text-base md:text-lg text-white/80 mb-4">
                    {game.description}
                  </p>
                </div>

                <Link
                  to={`/game/${game.id}`}
                  className="primary-btn"
                >
                  Play
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
