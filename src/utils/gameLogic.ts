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

// Pool de palavras expandido para cada nível de dificuldade
const wordPool: Record<Difficulty, string[]> = {
  easy: [
    // Palavras originais
    'CASA', 'BOLA', 'GATO', 'RATO', 'PATO', 'FADA', 'LOBO', 'SAPO', 'VACA',
    'PEIXE', 'URSO', 'MESA', 'BOLO', 'FOGO', 'LAGO', 'MATO', 'REDE', 'SOPA',
    'DADO', 'FACA', 'MALA', 'PENA', 'RODA', 'SACO', 'TELA', 'VELA', 'ARCO',
    'BECO', 'CAMA', 'DEDO', 'FILA', 'GELO', 'JOGO', 'LAMA', 'MAPA', 'NATA',
    'ONDA', 'PATO', 'RAMO', 'SINO', 'TACO', 'UVAS', 'VASO', 'ZONA', 'ALHO',
    'BALA', 'CAPA', 'DAMA', 'FADA', 'GOTA', 'ILHA', 'JATO', 'LATA', 'MEIA',
    'NEVE', 'OURO', 'PIPA', 'RISO', 'SOPA', 'TETO', 'VELA', 'ZEBU',
    // Novas palavras
    'ANEL', 'AMOR', 'ATUM', 'AVES', 'AZUL', 'BAIO', 'BALA', 'BEBE', 'BICO',
    'BIFE', 'BODE', 'BOIA', 'BOLO', 'BOTA', 'BOTO', 'CAFE', 'CAJU', 'CALO',
    'CANA', 'CANO', 'CAOS', 'CAPA', 'CARA', 'CASA', 'CEDO', 'CELA', 'CERA',
    'CESTA', 'CHAO', 'CHEF', 'CIMA', 'CINE', 'CIPO', 'COCO', 'COLA', 'CONE',
    'COPO', 'CORA', 'CORO', 'COVA', 'COXA', 'CUBO', 'DADO', 'DAMA', 'DEDO',
    'DICA', 'DIVA', 'DOCE', 'DONO', 'DOTE', 'DUNA', 'DUQUE', 'EIXO', 'ERVA',
    'FACA', 'FADA', 'FALA', 'FAMA', 'FARO', 'FASE', 'FATO', 'FAVA', 'FEIRA',
    'FENO', 'FERA', 'FIGO', 'FILA', 'FITA', 'FOCA', 'FOGO', 'FOLE', 'FOME',
    'FONTE', 'FORA', 'FOTO', 'GADO', 'GALO', 'GATO', 'GELO', 'GEMA', 'GELO',
    'GIRO', 'GOTA', 'GRAO', 'GRUA', 'GUIA', 'HALO', 'HARPA', 'HERA', 'HEROI',
    'HORA', 'HOTEL', 'ILHA', 'JADE', 'JATO', 'JAZZ', 'JIPE', 'JOIA', 'JOGO',
    'JUBA', 'JUIZ', 'JUTA', 'LACO', 'LADO', 'LAGO', 'LAMA', 'LAPIS', 'LATA',
    'LAVA', 'LEAO', 'LEME', 'LENTE', 'LEVE', 'LEXA', 'LIDO', 'LIMA', 'LIMO',
    'LIRA', 'LISA', 'LISO', 'LISTA', 'LOBA', 'LOBO', 'LOJA', 'LONA', 'LOTE',
    'LOUCA', 'LOUSA', 'LUVA', 'LUXO', 'MACA', 'MACO', 'MALA', 'MAMA', 'MANA',
    'MAPA', 'MARE', 'MATA', 'MATO', 'MEAO', 'MEIA', 'MEIO', 'MESA', 'META',
    'MICO', 'MINA', 'MITO', 'MOCA', 'MODA', 'MODO', 'MOLA', 'MOLE', 'MOMO',
    'MORO', 'MOTO', 'MUDA', 'MUDO', 'MULA', 'MURO', 'NABO', 'NADO', 'NATA',
    'NAVE', 'NETO', 'NEVE', 'NINHO', 'NIVE', 'NODO', 'NOME', 'NOTA', 'NOVO',
    'NUCA', 'NULO', 'OBRA', 'OCRE', 'OGRO', 'OLEO', 'OLHO', 'ONCA', 'ONDA',
    'OURO', 'OVAL', 'OVNI', 'PACA', 'PACO', 'PAIS', 'PALA', 'PANO', 'PAPA',
    'PARA', 'PATO', 'PAUS', 'PELE', 'PENA', 'PERA', 'PESO', 'PIAO', 'PINO',
    'PIPA', 'PISO', 'PITA', 'PIVO', 'POEMA', 'POETA', 'POLO', 'POMO', 'PORO',
    'POTE', 'POUSO', 'POVO', 'PRADO', 'PRATA', 'PROA', 'PROVA', 'PUFE'
  ],
  medium: [
    'ESCOLA', 'JARDIM', 'BANANA', 'CAVALO', 'GIRAFA', 'MACACO', 'SAPATO',
    'CAMISA', 'JANELA', 'ESTRELA', 'PISCINA', 'FLORESTA', 'CASTELO',
    'TESOURO', 'PLANETA', 'OCEANO', 'MONTANHA', 'FOGUETE', 'ABACAXI',
    'BATERIA', 'CADEIRA', 'DRAGAO', 'ESCADA', 'FARINHA', 'GALINHA',
    'HAMSTER', 'IGREJA', 'JACARE', 'LAGARTO', 'MOCHILA', 'NUVENS',
    'OVELHA', 'PAPAGAIO', 'QUADRO', 'RAPOSA', 'SORVETE', 'TIGELA',
    'URUBU', 'VASSOURA', 'XICARA', 'ZEBRA', 'ARVORE', 'BALEIA',
    'CANGURU', 'DELFIM', 'ESPADA', 'FORMIGA', 'GORILA', 'HIENA',
    'IGUANA', 'JAGUAR', 'KOALA', 'LEAO', 'MACACO'
  ],
  hard: [
    'BICICLETA', 'CHOCOLATE', 'BORBOLETA', 'TELEFONE', 'COMPUTADOR',
    'ELEFANTE', 'PAPAGAIO', 'MONTANHA', 'DINOSSAURO', 'BIBLIOTECA',
    'AQUARELA', 'GIRASSOL', 'CARROSSEL', 'TARTARUGA', 'CACHORRO',
    'AEROPORTO', 'BATEDEIRA', 'CARANGUEJO', 'DIAMANTE', 'ESCORPIAO',
    'FANTASMA', 'GELADEIRA', 'HIPOPOTAMO', 'IMPRESSORA', 'JOANINHA',
    'LAGARTIXA', 'MARGARIDA', 'NOTEBOOK', 'ORANGOTANGO', 'PINGUIM',
    'QUADRADO', 'RINOCERONTE', 'SAXOFONE', 'TRAMPOLIM', 'UNICORNIO',
    'VIOLINO', 'WAFFLE', 'XADREZ', 'YAKISOBA', 'ZOOLOGICO', 'AMENDOIM',
    'BERINJELA', 'CROCODILO', 'DROMEDARIO', 'ESPINAFRE', 'FRAMBOESA',
    'GUAXINIM', 'HELICOPTERO', 'IGUANODONTE', 'JABUTICABA'
  ],
  expert: [
    'BIBLIOTECA', 'CALENDARIO', 'PROFESSOR', 'ESTUDANTE', 'GEOGRAFIA',
    'MATEMATICA', 'BORRACHA', 'CADERNO', 'UNIVERSIDADE', 'CONHECIMENTO',
    'TECNOLOGIA', 'ASTRONOMIA', 'FOTOGRAFIA', 'LITERATURA', 'ARQUITETURA',
    'ENGENHARIA', 'MEDICINA', 'PSICOLOGIA', 'ARQUEOLOGIA', 'BIOQUIMICA',
    'CRIPTOGRAFIA', 'DEMOCRACIA', 'ECOSSISTEMA', 'FISIOLOGIA', 'GEOMETRIA',
    'HIDROLOGIA', 'IMUNOLOGIA', 'JORNALISMO', 'KINESIOLOGIA', 'LINGUISTICA',
    'METEOROLOGIA', 'NEUROLOGIA', 'ODONTOLOGIA', 'PALEONTOLOGIA', 'QUIMICA',
    'RADIOLOGIA', 'SOCIOLOGIA', 'TOPOGRAFIA', 'URBANISMO', 'VETERINARIA',
    'ANTROPOLOGIA', 'BACTERIOLOGIA', 'CARDIOLOGIA', 'DERMATOLOGIA',
    'ENDOCRINOLOGIA', 'FARMACOLOGIA', 'GERONTOLOGIA', 'HEMATOLOGIA',
    'INFECTOLOGIA', 'JURISPRUDENCIA'
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