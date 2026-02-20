import { Server, Origins } from '@bgio/server';
import { TicTacToeGame } from '@repo/games';

const server = Server({
  games: [TicTacToeGame],
  origins: [Origins.LOCALHOST],
});

const PORT = process.env.PORT || 8000;

void server.run(Number(PORT), () => {
  console.log(`Game server running on port ${PORT}`);
});
