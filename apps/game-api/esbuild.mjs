import * as esbuild from 'esbuild'
import { clean } from 'esbuild-plugin-clean';

await esbuild.build({
  entryPoints: ['./dist/main.js'],
  outfile: './build/game-handler.js',
  sourcemap: true,
  platform: 'node',
  target: 'node24',
  packages: 'bundle',
  bundle: true,
  minify: true,
  external: [
    '@nestjs/microservices', // nestjs
    '@nestjs/websockets/socket-module', // nestjs
    'node-persist', // boardgame.io
  ],
  plugins: [
    clean({
      patterns: ['./build/*'],
    }),
  ],
})

console.log('Build complete: build/game-handler.js')
