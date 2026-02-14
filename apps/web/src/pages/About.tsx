import { Link } from "react-router";
import Layout from "../components/Layout";

export default function About() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12 md:py-20">
        <h1 className="text-responsive-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 text-center">
          About Board Games
        </h1>
        
        <div className="bg-white/95 backdrop-blur-sm rounded-xl border-3 border-secondary shadow-xl p-6 md:p-8 max-w-3xl w-full">
          <div className="text-gray-800 space-y-4 md:space-y-6">
            <p className="text-responsive-base md:text-responsive-lg">
              Welcome to our online board games platform! We're dedicated to bringing friends and family together through classic and modern board games.
            </p>
            
            <p className="text-responsive-base md:text-responsive-lg">
              Our mission is to provide a fun, engaging, and accessible way to play board games with people around the world. We believe that gaming should be straightforward, without requiring setup or purchasing, providing a "click-and-play" experience to users.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 md:mt-8">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-4 border-2 border-primary/30">
                <p className="text-responsive-xl font-bold text-primary mb-2">🌍</p>
                <p className="text-gray-700 font-semibold text-responsive-sm">Global Play</p>
                <p className="text-gray-600 text-responsive-sm mt-1">Play with people from around the world</p>
              </div>
              
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-4 border-2 border-primary/30">
                <p className="text-responsive-xl font-bold text-primary mb-2">⚡</p>
                <p className="text-gray-700 font-semibold text-responsive-sm">Instant Play</p>
                <p className="text-gray-600 text-responsive-sm mt-1">No downloads or installations needed</p>
              </div>
              
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-4 border-2 border-primary/30">
                <p className="text-responsive-xl font-bold text-primary mb-2">👨‍👩‍👧‍👦</p>
                <p className="text-gray-700 font-semibold text-responsive-sm">For Everyone</p>
                <p className="text-gray-600 text-responsive-sm mt-1">Fun for kids, teens, and adults</p>
              </div>
            </div>

            <div className="flex gap-4 mt-8 md:mt-10">
              <Link
                to="/"
                className="flex-1 text-center px-4 md:px-6 py-2 md:py-3 bg-secondary text-white rounded-lg md:rounded-xl border-3 border-secondary font-semibold text-responsive-sm md:text-responsive-base hover:bg-primary hover:border-primary hover:shadow-lg transition-all duration-300 active:scale-95 disabled:bg-gray-500 disabled:border-gray-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Back to Home
              </Link>
              <Link
                to="/game"
                className="flex-1 text-center px-4 md:px-6 py-2 md:py-3 bg-transparent text-white rounded-lg md:rounded-xl border-3 border-white font-semibold text-responsive-sm md:text-responsive-base hover:bg-secondary hover:border-secondary hover:shadow-lg transition-all duration-300 active:scale-95 disabled:border-gray-500 disabled:text-gray-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Play Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
