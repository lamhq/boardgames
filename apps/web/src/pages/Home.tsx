import { Link } from "react-router";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-purple-600">
      <h1 className="text-5xl font-bold text-white mb-4">Welcome to Board Games</h1>
      <p className="text-xl text-white mb-8">Play your favorite board games online with friends</p>
      <Link to="/about" className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100">
        Learn More
      </Link>
    </div>
  );
}
