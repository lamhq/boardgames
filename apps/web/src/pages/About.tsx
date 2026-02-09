import { Link } from "react-router";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-500 to-pink-600 p-8">
      <div className="max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">About Board Games</h1>
        <p className="text-gray-700 mb-4">
          Welcome to our online board games platform! We're dedicated to bringing friends and family together through classic and modern board games.
        </p>
        <p className="text-gray-700 mb-6">
          Our mission is to provide a fun, engaging, and accessible way to play board games with people around the world.
        </p>
        <Link to="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
