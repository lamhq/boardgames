import type { Game } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';

export interface GameState {
  cells: Array<string | null>;
}

// Return true if `cells` is in a winning configuration.
function IsVictory(cells: Array<string | null>): boolean {
  const positions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const isRowComplete = (row: number[]) => {
    const symbols = row.map((i) => cells[i]);
    return symbols.every((i) => i !== null && i === symbols[0]);
  };

  return positions.map(isRowComplete).some((i) => i === true);
}

// Return true if all `cells` are occupied.
function IsDraw(cells: Array<string | null>): boolean {
  return cells.filter((c) => c === null).length === 0;
}

export const TicTacToeGame: Game<GameState> = {
  name: 'tictactoe',

  setup: () => {
    return {
      cells: Array<string | null>(9).fill(null),
    };
  },

  moves: {
    clickCell: ({ G, playerID }, id: number) => {
      if (G.cells[id] !== null) {
        return INVALID_MOVE;
      }
      G.cells[id] = playerID;
      return undefined;
    },
  },

  turn: {
    minMoves: 1,
    maxMoves: 1,
  },

  endIf: ({ G, ctx }) => {
    if (IsVictory(G.cells)) {
      return { winner: ctx.currentPlayer };
    }
    if (IsDraw(G.cells)) {
      return { draw: true };
    }
    return undefined;
  },

  ai: {
    enumerate: (G: GameState) => {
      const moves = [];
      for (let i = 0; i < 9; i++) {
        if (G.cells[i] === null) {
          moves.push({ move: 'clickCell', args: [i] });
        }
      }
      return moves;
    },
  },
};
