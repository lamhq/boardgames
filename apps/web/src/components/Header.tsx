import { Link } from "react-router";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-primary-dark/95 backdrop-blur-md border-b-4 border-secondary shadow-lg">
      <div className="flex justify-between items-center px-4 md:px-6 lg:px-8 py-4 max-w-6xl mx-auto">
        <Link to="/" className="flex items-center gap-2 group">
          <h1 className="text-xl md:text-2xl font-bold text-white group-hover:text-secondary transition-all duration-300">
            🎲 Board Games
          </h1>
        </Link>
        <nav className="flex gap-2 md:gap-4">
          <Link
            to="/"
            className="px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-semibold text-white border-3 border-white bg-transparent hover:bg-secondary hover:border-secondary transition-all duration-300 active:scale-95"
          >
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
