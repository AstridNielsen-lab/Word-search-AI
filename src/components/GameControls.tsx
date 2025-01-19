import React from 'react';
import { Difficulty } from '../types/game';
import { Timer, Trophy } from 'lucide-react';

interface GameControlsProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onNewGame: () => void;
  timeRemaining: number;
  score: number;
}

export const GameControls: React.FC<GameControlsProps> = ({
  difficulty,
  onDifficultyChange,
  onNewGame,
  timeRemaining,
  score,
}) => {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <Timer className="text-blue-600" />
          <span className="font-mono text-xl">{formatTime(timeRemaining)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          <span className="font-bold text-xl">{score}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 flex gap-2">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => onDifficultyChange(d)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
                ${difficulty === d
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 hover:bg-blue-50'}`}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
        
        <button
          onClick={onNewGame}
          className="col-span-2 py-3 px-6 bg-green-600 text-white rounded-md font-medium
            hover:bg-green-700 transition-colors"
        >
          Novo Jogo
        </button>
      </div>
    </div>
  );
};