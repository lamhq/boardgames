import { useNavigate } from "react-router";
import { createPortal } from "react-dom";
import type { BoardProps } from '@bgio/web/react';
import type { TicTacToeGameState } from '../tic-tac-toe';

interface TicTacToeBoardProps extends BoardProps<TicTacToeGameState> {
  // Additional custom properties for your component
}

export function TicTacToeBoard({ ctx, G, moves }: TicTacToeBoardProps) {
  const navigate = useNavigate();
  const onClick = (id: number) => moves.clickCell(id);

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
    <>
      <div className="flex flex-col items-center justify-center">
        <table className="border-collapse">
          <tbody>{tbody}</tbody>
        </table>
      </div>

      {/* Game Over Modal */}
      {ctx.gameover && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl border-3 border-secondary shadow-2xl p-8 max-w-sm w-full text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Game Over!
            </h2>
            {ctx.gameover.draw ? (
              <p className="text-xl text-gray-600 mb-6">
                It's a Draw!
              </p>
            ) : ctx.gameover.winner !== undefined ? (
              <p className="text-xl text-gray-600 mb-6">
                Player {Number(ctx.gameover.winner) === 0 ? "X" : "O"} wins!
              </p>
            ) : null}
            <button
              onClick={() => navigate("/")}
              className="primary-btn"
            >
              Back to Home
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
