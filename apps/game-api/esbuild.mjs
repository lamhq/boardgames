import * as esbuild from 'esbuild'
import { clean } from 'esbuild-plugin-clean';

await esbuild.build({
  entryPoints: ['./dist/lambda-handler.js'],
  outfile: './build/game-handler.js',
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
      patterns: ['./build/*'],
    }),
  ],
})

console.log('Build complete: build/game-handler.js')
