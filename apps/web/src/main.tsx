import { createRoot } from "react-dom/client";
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { GameConfig } from "./Game";
import { MyGameBoard } from "./Board";
import "./index.css";

const App = Client({
  game: GameConfig,
  board: MyGameBoard,
  multiplayer: SocketIO({ server: "localhost:8000" }),
});

// Get playerID from URL query parameter or use "0" as default
const queryParams = new URLSearchParams(window.location.search);
const playerID = queryParams.get("playerID") || "0";
const matchID = queryParams.get("matchID") || "default-match";

createRoot(document.getElementById("app")!).render(
  <App playerID={playerID} matchID={matchID} />
);
