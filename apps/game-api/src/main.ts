import { Server, Origins } from '@libs/boardgame.io/server';
import { TicTacToeGame } from '@libs/games';

const server = Server({
  games: [TicTacToeGame],
  origins: [Origins.LOCALHOST],
});

const PORT = process.env.PORT || 8000;

void server.run(Number(PORT), () => {
  console.log(`Game server running on port ${PORT}`);
});
