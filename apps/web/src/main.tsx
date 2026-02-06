import { createRoot } from "react-dom/client";
import { Client } from "boardgame.io/react";
import { GameConfig } from "./Game";
import { MyGameBoard } from "./Board";
import "./index.css";

const App = Client({
  game: GameConfig,
  board: MyGameBoard,
});

createRoot(document.getElementById("app")!).render(<App />);
