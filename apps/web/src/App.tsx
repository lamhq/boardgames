import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
]);

// add some comment
export default function App() {
  return <RouterProvider router={router} />;
}
