import type { BoardProps } from 'boardgame.io/react';
import type { MyGameState } from './Game';

interface MyGameProps extends BoardProps<MyGameState> {
  // Additional custom properties for your component
}

export function MyGameBoard({ ctx, G, moves }: MyGameProps) {
  const onClick = (id: number) => moves.clickCell(id);

  let winner;
  if (ctx.gameover) {
    winner =
      ctx.gameover.winner !== undefined ? (
        <div className="mt-5 text-lg font-bold">
          Winner: Player {ctx.gameover.winner}
        </div>
      ) : (
        <div className="mt-5 text-lg font-bold">
          Draw!
        </div>
      );
  }

  const cellClasses = "w-12 h-12 flex items-center justify-center text-2xl font-bold box-border";

  const tbody = [];
  for (let i = 0; i < 3; i++) {
    const cells = [];
    for (let j = 0; j < 3; j++) {
      const id = 3 * i + j;
      cells.push(
        <td key={id} className="p-0 m-0">
          {G.cells[id] ? (
            <div className={`${cellClasses} border border-gray-600 bg-gray-700`}>
              {G.cells[id]}
            </div>
          ) : (
            <button
              className={`${cellClasses} bg-transparent hover:bg-gray-600 transition disabled:cursor-not-allowed p-0 m-0 outline-none focus:outline-none`}
              style={{ border: '1px solid #4b5563' }}
              onClick={() => onClick(id)}
              disabled={ctx.gameover ? true : false}
            />
          )}
        </td>
      );
    }
    tbody.push(<tr key={i}>{cells}</tr>);
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <table className="border-collapse">
        <tbody>{tbody}</tbody>
      </table>
      {winner}
    </div>
  );
}
