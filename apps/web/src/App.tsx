import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Play from "./pages/Play";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/game/:gameId",
    element: <Game />,
  },
  {
    path: "/play",
    element: <Play />,
  },
]);

// add some comment
export default function App() {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
          style: {
            background: "#ef4444",
            color: "#fff",
            borderRadius: "0.75rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            padding: "16px 20px",
            fontSize: "14px",
            fontWeight: "500",
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}
