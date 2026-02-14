import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import Game from "./pages/Game";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/game",
    element: <Game />,
  },
]);

// add some comment
export default function App() {
  return <RouterProvider router={router} />;
}
