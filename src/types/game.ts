export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface GameConfig {
  size: number;
  wordCount: number;
  timeLimit: number; // in seconds
}

export interface Word {
  word: string;
  found: boolean;
  startPos?: [number, number];
  endPos?: [number, number];
}

export interface GameState {
  board: string[][];
  words: Word[];
  difficulty: Difficulty;
  timeRemaining: number;
  isGameOver: boolean;
  score: number;
}