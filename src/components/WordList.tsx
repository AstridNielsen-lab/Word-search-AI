import React from 'react';
import { Word } from '../types/game';
import { CheckCircle } from 'lucide-react';

interface WordListProps {
  words: Word[];
}

export const WordList: React.FC<WordListProps> = ({ words }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Palavras para Encontrar</h2>
      <div className="grid grid-cols-2 gap-2">
        {words.map((word, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 p-2 rounded ${
              word.found ? 'text-green-600 bg-green-50' : 'text-gray-700'
            }`}
          >
            {word.found && <CheckCircle size={16} />}
            <span className={word.found ? 'line-through' : ''}>
              {word.word}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};