import { Link } from "react-router";
import Layout from "./Layout";

interface ErrorPageProps {
  message?: string;
}

export default function ErrorPage({ message = "Invalid game parameters" }: ErrorPageProps) {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border-3 border-secondary shadow-xl p-6 md:p-8 max-w-md w-full text-center">
          <p className="text-white text-lg mb-6">{message}</p>
          <Link
            to="/"
            className="primary-btn inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
}
