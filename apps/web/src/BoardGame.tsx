import type { ComponentType } from "react";
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { GameConfig } from "./Game";
import { MyGameBoard } from "./Board";

const BoardGame = Client({
  game: GameConfig,
  board: MyGameBoard,
  multiplayer: SocketIO({ server: "localhost:8000" }),
}) as ComponentType;

export default BoardGame;