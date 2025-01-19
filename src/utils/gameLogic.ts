import { GameState, Word, Difficulty } from '../types/game';
import { DIFFICULTY_CONFIG } from './gameConfig';

type Direction = 'horizontal' | 'vertical' | 'diagonal';

interface WordPlacement {
  word: string;
  row: number;
  col: number;
  direction: Direction;
}

const directions: Direction[] = ['horizontal', 'vertical', 'diagonal'];

// Extended word lists for each difficulty level
const wordPool: Record<Difficulty, string[]> = {
  easy: [
    'CASA', 'BOLA', 'GATO', 'RATO', 'PATO', 'FADA', 'LOBO', 'SAPO', 'VACA',
    'PEIXE', 'URSO', 'MESA', 'BOLO', 'FOGO', 'LAGO', 'MATO', 'REDE', 'SOPA'
  ],
  medium: [
    'ESCOLA', 'JARDIM', 'BANANA', 'CAVALO', 'GIRAFA', 'MACACO', 'SAPATO',
    'CAMISA', 'JANELA', 'ESTRELA', 'PISCINA', 'FLORESTA', 'CASTELO',
    'TESOURO', 'PLANETA', 'OCEANO', 'MONTANHA', 'FOGUETE'
  ],
  hard: [
    'BICICLETA', 'CHOCOLATE', 'BORBOLETA', 'TELEFONE', 'COMPUTADOR',
    'ELEFANTE', 'PAPAGAIO', 'MONTANHA', 'DINOSSAURO', 'BIBLIOTECA',
    'AQUARELA', 'GIRASSOL', 'CARROSSEL', 'TARTARUGA', 'CACHORRO'
  ],
  expert: [
    'BIBLIOTECA', 'CALENDARIO', 'PROFESSOR', 'ESTUDANTE', 'GEOGRAFIA',
    'MATEMATICA', 'BORRACHA', 'CADERNO', 'UNIVERSIDADE', 'CONHECIMENTO',
    'TECNOLOGIA', 'ASTRONOMIA', 'FOTOGRAFIA', 'LITERATURA', 'ARQUITETURA',
    'ENGENHARIA', 'MEDICINA', 'PSICOLOGIA'
  ]
};

const getRandomWords = (difficulty: Difficulty, count: number): string[] => {
  const availableWords = [...wordPool[difficulty]];
  const selectedWords: string[] = [];

  while (selectedWords.length < count && availableWords.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    selectedWords.push(availableWords.splice(randomIndex, 1)[0]);
  }

  return selectedWords;
};

const canPlaceWord = (
  board: string[][],
  word: string,
  row: number,
  col: number,
  direction: Direction
): boolean => {
  const size = board.length;
  const wordLength = word.length;

  // Check if word fits on board
  if (direction === 'horizontal' && col + wordLength > size) return false;
  if (direction === 'vertical' && row + wordLength > size) return false;
  if (direction === 'diagonal' && (row + wordLength > size || col + wordLength > size)) return false;

  // Check if space is available
  for (let i = 0; i < wordLength; i++) {
    let currentRow = row;
    let currentCol = col;

    if (direction === 'horizontal') currentCol += i;
    if (direction === 'vertical') currentRow += i;
    if (direction === 'diagonal') {
      currentRow += i;
      currentCol += i;
    }

    if (board[currentRow][currentCol] !== '' && 
        board[currentRow][currentCol] !== word[i]) {
      return false;
    }
  }

  return true;
};

const placeWord = (
  board: string[][],
  word: string,
  row: number,
  col: number,
  direction: Direction
): void => {
  for (let i = 0; i < word.length; i++) {
    if (direction === 'horizontal') {
      board[row][col + i] = word[i];
    } else if (direction === 'vertical') {
      board[row + i][col] = word[i];
    } else {
      board[row + i][col + i] = word[i];
    }
  }
};

const tryPlaceWord = (
  board: string[][],
  word: string
): WordPlacement | null => {
  const size = board.length;
  const maxAttempts = 50;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);

    if (canPlaceWord(board, word, row, col, direction)) {
      placeWord(board, word, row, col, direction);
      return { word, row, col, direction };
    }
  }

  return null;
};

export const generateBoard = async (difficulty: Difficulty): Promise<GameState> => {
  const config = DIFFICULTY_CONFIG[difficulty];
  
  try {
    // Get random words from our word pool
    const wordList = getRandomWords(difficulty, config.wordCount);

    // Initialize empty board
    const board = Array(config.size).fill(null)
      .map(() => Array(config.size).fill(''));

    // Place words on the board
    const words: Word[] = [];
    for (const word of wordList) {
      const placement = tryPlaceWord(board, word);
      if (placement) {
        words.push({
          word,
          found: false,
          startPos: [placement.row, placement.col],
          endPos: [
            placement.direction === 'horizontal' ? placement.row : placement.row + word.length - 1,
            placement.direction === 'vertical' ? placement.col : placement.col + word.length - 1
          ]
        });
      }
    }

    // Fill remaining empty spaces with random letters
    for (let i = 0; i < config.size; i++) {
      for (let j = 0; j < config.size; j++) {
        if (!board[i][j]) {
          // Use only consonants and vowels that make sense in Portuguese
          const letters = 'ABCDEFGHIJLMNOPQRSTUVXZ';
          board[i][j] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }

    return {
      board,
      words,
      difficulty,
      timeRemaining: config.timeLimit,
      isGameOver: false,
      score: 0,
    };
  } catch (error) {
    console.error('Error generating game:', error);
    throw error;
  }
};

export const checkWordSelection = (
  startCell: [number, number],
  endCell: [number, number],
  words: Word[]
): Word | null => {
  return words.find(word => {
    if (word.found || !word.startPos || !word.endPos) return false;

    // Check both forward and reverse directions
    const forwardMatch = (
      (startCell[0] === word.startPos[0] && startCell[1] === word.startPos[1] &&
       endCell[0] === word.endPos[0] && endCell[1] === word.endPos[1]) ||
      (startCell[0] === word.endPos[0] && startCell[1] === word.endPos[1] &&
       endCell[0] === word.startPos[0] && endCell[1] === word.startPos[1])
    );

    // Check if it's a diagonal word
    const isDiagonal = Math.abs(word.endPos[0] - word.startPos[0]) === Math.abs(word.endPos[1] - word.startPos[1]);
    
    if (isDiagonal) {
      // For diagonal words, check if the selection follows the diagonal path
      const rowDiff = Math.abs(endCell[0] - startCell[0]);
      const colDiff = Math.abs(endCell[1] - startCell[1]);
      const isValidDiagonal = rowDiff === colDiff;

      if (!isValidDiagonal) return false;
    }

    return forwardMatch;
  }) || null;
};