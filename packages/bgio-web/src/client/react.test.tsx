/**
 * @jest-environment jsdom
 */

/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from 'react';
import { render, act, cleanup } from '@testing-library/react';
import type { BoardProps } from './react';
import { Client } from './react';
import { Local } from './transport/local';
import { SocketIO } from './transport/socketio';

// Capture the latest props passed to TestBoard so tests can inspect them.
let boardProps: BoardProps & Record<string, any>;

function TestBoard(props: BoardProps & { doStuff?: any; extraValue?: any }) {
  boardProps = props;
  return <div data-testid="board">Board</div>;
}

beforeEach(() => {
  boardProps = undefined as any;
});

afterEach(cleanup);

test('board is rendered', () => {
  const Board = Client({
    game: {},
    board: TestBoard,
  });

  const { unmount, getByTestId } = render(<Board />);

  expect(getByTestId('board')).toBeInTheDocument();
  expect(getByTestId('board').textContent).toBe('Board');
  expect(boardProps.isActive).toBe(true);

  unmount();
});

test('board props', () => {
  const Board = Client({
    game: {},
    board: TestBoard,
  });

  render(<Board />);

  expect(boardProps.isMultiplayer).toEqual(false);
  expect(boardProps.isActive).toBe(true);
});

test('can pass extra props to Client', () => {
  const Board = Client({
    game: {},
    board: TestBoard,
  });

  render(<Board doStuff={() => true} extraValue={55} />);

  expect(boardProps.doStuff()).toBe(true);
  expect(boardProps.extraValue).toBe(55);
});

test('custom loading component', () => {
  const Loading = () => <div>custom</div>;
  const Board = Client({
    game: {},
    loading: Loading,
    board: TestBoard,
    multiplayer: SocketIO(),
  });

  const { container } = render(<Board />);

  expect(container.innerHTML).toContain('custom');
});

test('can pass empty board', () => {
  const Board = Client({
    game: {},
  });

  const { container } = render(<Board />);

  expect(container).not.toBeNull();
});

test('move api', () => {
  const Board = Client({
    game: {
      moves: {
        A: (_, arg) => ({ arg }),
      },
    },
    board: TestBoard,
  });

  render(<Board />);

  expect(boardProps.G).toEqual({});

  act(() => {
    boardProps.moves.A(42);
  });

  expect(boardProps.G).toEqual({ arg: 42 });
});

test('update matchID / playerID', () => {
  // No multiplayer.
  const Board1 = Client({
    game: {
      moves: {
        A: (_, arg) => ({ arg }),
      },
    },
    board: TestBoard,
  });

  const { rerender: rerender1, unmount: unmount1 } = render(<Board1 />);

  rerender1(<Board1 matchID="a" />);
  rerender1(<Board1 matchID="a" playerID="3" />);
  unmount1();

  // Multiplayer.
  const Board2 = Client({
    game: {
      moves: {
        A: (_, arg) => ({ arg }),
      },
    },
    board: TestBoard,
    multiplayer: Local(),
  });

  const { rerender: rerender2 } = render(
    <Board2 matchID="a" playerID="1" credentials="foo" />
  );

  // Same values — should not cause updates.
  rerender2(<Board2 matchID="a" playerID="1" credentials="foo" />);

  // Different values — should trigger updates.
  rerender2(<Board2 matchID="next" playerID="next" credentials="bar" />);
});

test('local playerView', () => {
  const Board = Client({
    game: {
      setup: () => ({ secret: true }),
      playerView: ({ playerID }) => ({ stripped: playerID }),
    },
    board: TestBoard,
    numPlayers: 2,
  });

  render(<Board playerID="1" />);

  expect(boardProps.G).toEqual({ stripped: '1' });
});

test('reset Game', () => {
  const Board = Client({
    game: {
      moves: {
        A: (_, arg) => ({ arg }),
      },
    },
    board: TestBoard,
  });

  render(<Board />);

  const initial = { G: { ...boardProps.G }, ctx: { ...boardProps.ctx } };

  expect(boardProps.G).toEqual({});

  act(() => {
    boardProps.moves.A(42);
  });

  expect(boardProps.G).toEqual({ arg: 42 });

  act(() => {
    boardProps.reset();
  });

  expect(boardProps.G).toEqual(initial.G);
  expect(boardProps.ctx).toEqual(initial.ctx);
});
