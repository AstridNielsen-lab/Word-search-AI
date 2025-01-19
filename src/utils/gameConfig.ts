import { Difficulty, GameConfig } from '../types/game';

export const DIFFICULTY_CONFIG: Record<Difficulty, GameConfig> = {
  easy: {
    size: 8,
    wordCount: 5,
    timeLimit: 180, // 3 minutes
  },
  medium: {
    size: 10,
    wordCount: 8,
    timeLimit: 240, // 4 minutes
  },
  hard: {
    size: 12,
    wordCount: 12,
    timeLimit: 300, // 5 minutes
  },
  expert: {
    size: 15,
    wordCount: 15,
    timeLimit: 360, // 6 minutes
  },
};