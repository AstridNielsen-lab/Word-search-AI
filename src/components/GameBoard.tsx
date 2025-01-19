import React from 'react';
import { GameState } from '../types/game';

interface GameBoardProps {
  gameState: GameState;
  onCellClick: (row: number, col: number) => void;
  selectedCells: [number, number][];
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  onCellClick,
  selectedCells,
}) => {
  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(([r, c]) => r === row && c === col);
  };

  const isCellInFoundWord = (row: number, col: number) => {
    return gameState.words.some(word => {
      if (!word.found || !word.startPos || !word.endPos) return false;

      // Check if cell is part of this found word
      const [startRow, startCol] = word.startPos;
      const [endRow, endCol] = word.endPos;

      // Horizontal word
      if (startRow === endRow) {
        return row === startRow && 
               col >= Math.min(startCol, endCol) && 
               col <= Math.max(startCol, endCol);
      }
      // Vertical word
      else if (startCol === endCol) {
        return col === startCol && 
               row >= Math.min(startRow, endRow) && 
               row <= Math.max(startRow, endRow);
      }
      // Diagonal word
      else {
        const length = Math.abs(endCol - startCol);
        for (let i = 0; i <= length; i++) {
          const checkRow = startRow + (endRow > startRow ? i : -i);
          const checkCol = startCol + (endCol > startCol ? i : -i);
          if (row === checkRow && col === checkCol) return true;
        }
      }
      return false;
    });
  };

  return (
    <div className="grid gap-1" style={{
      gridTemplateColumns: `repeat(${gameState.board.length}, minmax(0, 1fr))`
    }}>
      {gameState.board.map((row, rowIndex) => (
        row.map((letter, colIndex) => {
          const isFound = isCellInFoundWord(rowIndex, colIndex);
          const isSelected = isCellSelected(rowIndex, colIndex);
          
          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`
                w-8 h-8 sm:w-10 sm:h-10 rounded-md font-bold text-lg
                transition-all duration-200
                ${isFound 
                  ? 'bg-green-500 text-white'
                  : isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-white hover:bg-blue-100'}
                shadow-sm border border-gray-200
              `}
              onClick={() => onCellClick(rowIndex, colIndex)}
              disabled={gameState.isGameOver}
            >
              {letter}
            </button>
          );
        })
      ))}
    </div>
  );
};