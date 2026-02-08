import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createGameServer } from './game.server';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  // Start the boardgame.io multiplayer server
  const gameServer = createGameServer();
  await gameServer.run(8000, () => {
    console.log('Multiplayer server running on port 8000');
  });
}

void bootstrap();
