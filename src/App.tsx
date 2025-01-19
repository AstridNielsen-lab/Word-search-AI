import React, { useState, useEffect } from 'react';
import { GameBoard } from './components/GameBoard';
import { WordList } from './components/WordList';
import { GameControls } from './components/GameControls';
import { GameState, Difficulty } from './types/game';
import { generateBoard, checkWordSelection } from './utils/gameLogic';
import { Search } from 'lucide-react';

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const startNewGame = async (difficulty: Difficulty) => {
    setIsLoading(true);
    try {
      const newGameState = await generateBoard(difficulty);
      setGameState(newGameState);
      setSelectedCells([]);
    } catch (error) {
      console.error('Failed to start new game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    startNewGame('easy');
  }, []);

  useEffect(() => {
    if (gameState && !gameState.isGameOver && gameState.timeRemaining > 0) {
      const timer = setInterval(() => {
        setGameState(prev => {
          if (!prev) return prev;
          const newTimeRemaining = prev.timeRemaining - 1;
          return {
            ...prev,
            timeRemaining: newTimeRemaining,
            isGameOver: newTimeRemaining <= 0
          };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState?.isGameOver]);

  const handleCellClick = (row: number, col: number) => {
    if (!gameState || gameState.isGameOver) return;
    
    setSelectedCells(prev => {
      if (prev.length === 0) {
        return [[row, col]];
      }

      const newSelection = [[prev[0][0], prev[0][1]], [row, col]] as [number, number][];
      
      const foundWord = checkWordSelection(newSelection[0], newSelection[1], gameState.words);
      
      if (foundWord) {
        setGameState(prev => {
          if (!prev) return prev;
          const newWords = prev.words.map(w => 
            w.word === foundWord.word ? { ...w, found: true } : w
          );
          return {
            ...prev,
            words: newWords,
            score: prev.score + (foundWord.word.length * 10)
          };
        });

        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/correct-2019.wav');
        audio.play().catch(() => {
          // Ignore audio play errors
        });
      }

      return [];
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin text-blue-600">
          <Search size={48} />
        </div>
      </div>
    );
  }

  if (!gameState) return null;

  const allWordsFound = gameState.words.every(w => w.found);
  if (allWordsFound && !gameState.isGameOver) {
    setGameState(prev => prev ? { ...prev, isGameOver: true } : prev);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Desafio de Caça-Palavras
          </h1>
        
        </header>

        {gameState.isGameOver && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">
              {allWordsFound ? 'Parabéns!' : 'Tempo Esgotado!'}
            </h2>
            <p className="text-blue-600 mb-4">
              {allWordsFound 
                ? `Você encontrou todas as palavras! Pontuação final: ${gameState.score}`
                : `Você encontrou ${gameState.words.filter(w => w.found).length} de ${gameState.words.length} palavras.`
              }
            </p>
            <button
              onClick={() => startNewGame(gameState.difficulty)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Jogar Novamente
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col items-center gap-8">
            <GameControls
              difficulty={gameState.difficulty}
              onDifficultyChange={(d) => startNewGame(d)}
              onNewGame={() => startNewGame(gameState.difficulty)}
              timeRemaining={gameState.timeRemaining}
              score={gameState.score}
            />

            <GameBoard
              gameState={gameState}
              onCellClick={handleCellClick}
              selectedCells={selectedCells}
            />
          </div>

          <div className="lg:col-span-1">
            <WordList words={gameState.words} />
          </div>
        </div>
      </div>
      <footer className="bg-white shadow-md mt-8">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-8">
          <div className="text-center text-gray-600">
            <p className="font-medium mb-2">
              Desenvolvido por Julio Campos Machado - Like Look Solutions
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="https://likelook.wixsite.com/solutions" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Visite nosso site
              </a>
              <span className="hidden sm:inline text-gray-400">•</span>
              <a 
                href="https://wa.me/5511970603441" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-green-600 hover:text-green-800 transition-colors"
              >
                WhatsApp: (11) 97060-3441
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
