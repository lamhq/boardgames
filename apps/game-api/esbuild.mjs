import * as esbuild from 'esbuild';
import { clean } from 'esbuild-plugin-clean';

await esbuild.build({
  entryPoints: ['./src/lambda-handler.ts'],
  outfile: './dist/game-handler.mjs',
  sourcemap: true,
  platform: 'node',
  target: 'node24',
  format: 'esm',
  packages: 'bundle',
  bundle: true,
  minify: true,
  external: [
    '@nestjs/microservices', // nestjs
    '@nestjs/websockets/socket-module', // nestjs
    'node-persist', // boardgame.io
    'aws-lambda', // already provided in Lambda environment
  ],
  plugins: [
    clean({
      patterns: ['./dist/*'],
    }),
  ],
})

console.log('Build complete: dist/game-handler.mjs')
