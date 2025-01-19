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
    'POTE', 'POUSO', 'POVO', 'PRADO', 'PRATA', 'PROA', 'PROVA', 'PUFE',
    // Novas palavras
    'ALVO', 'AMIGA', 'AMIGO', 'ANJO', 'ARCO', 'ARMA', 'ASSO', 'AZAR', 'BAU',
    'BASTO', 'BEBE', 'BELEZA', 'BOCA', 'BOLSA', 'BOSQUE', 'BUCHO', 'CACHO', 
    'CADERNO', 'CACHIMBO', 'CALHA', 'CANTO', 'CAPOTE', 'CARA', 'CARO', 'CASCA',
    'CEGA', 'CINZA', 'CIRCULO', 'CISCO', 'CIDADE', 'CLORE', 'CLOU', 'COALHO', 
    'COELHO', 'COLAR', 'CORPO', 'CORRE', 'COSTA', 'CRAVO', 'CREME', 'CRUZ',
    'CURIOSO', 'DANÇA', 'DAS', 'DEUS', 'DIA', 'DOIS', 'DOLAR', 'DORES', 'DURO',
    'ECO', 'EDUCA', 'ELA', 'ELE', 'ELO', 'ENGOLI', 'ENTRE', 'ESCUDO', 'ESPELHO',
    'ESTA', 'ESTUDO', 'FALTA', 'FAMA', 'FARO', 'FATA', 'FELIZ', 'FERRO', 'FLORE',
    'FOGO', 'FORÇA', 'FORMA', 'FORO', 'FUMO', 'GALO', 'GALO', 'GARFO', 'GATO',
    'GEMA', 'GOLPE', 'GORDO', 'GRALHA', 'GUITAR', 'GUIA', 'HOMINHO', 'HORTA',
    'IDEIA', 'IMPACTO', 'INSTRU', 'JAMAIS', 'JUNTO', 'JURADO', 'JURIS', 'LAGOA',
    'LAIS', 'LADRA', 'LESTE', 'LIVRO', 'LÍDER', 'LODO', 'LOJA', 'MALHA', 'MANO',
    'MARCA', 'MEIA', 'MESA', 'MEXE', 'MODA', 'MORDA', 'MOTE', 'MUSO', 'NACIO',
    'NAO', 'NAVIO', 'NEVO', 'NOVA', 'NOVO', 'PADO', 'PAI', 'PAPA', 'PEAR',
    'PEDO', 'PONTA', 'PRESA', 'RAIZ', 'REI', 'REI', 'RIBA', 'ROCA', 'RUA',
    'SABIO', 'SERRA', 'SOMA', 'SOM', 'SOMBRIO', 'SUSI', 'TERRA', 'TOPO', 
    'TONA', 'VIRAL', 'VITOR', 'VITA', 'VITOR', 'VIVA', 'VIVRE'
  ],
  medium: [
    // Palavras originais
    'ESCOLA', 'JARDIM', 'BANANA', 'CAVALO', 'GIRAFA', 'MACACO', 'SAPATO',
    'CAMISA', 'JANELA', 'ESTRELA', 'PISCINA', 'FLORESTA', 'CASTELO',
    'TESOURO', 'PLANETA', 'OCEANO', 'MONTANHA', 'FOGUETE', 'ABACAXI',
    'BATERIA', 'CADEIRA', 'DRAGAO', 'ESCADA', 'FARINHA', 'GALINHA',
    'HAMSTER', 'IGREJA', 'JACARE', 'LAGARTO', 'MOCHILA', 'NUVENS',
    'OVELHA', 'PAPAGAIO', 'QUADRO', 'RAPOSA', 'SORVETE', 'TIGELA',
    'URUBU', 'VASSOURA', 'XICARA', 'ZEBRA', 'ARVORE', 'BALEIA',
    'CANGURU', 'DELFIM', 'ESPADA', 'FORMIGA', 'GORILA', 'HIENA',
    'IGUANA', 'JAGUAR', 'KOALA', 'LEAO', 'MACACO',
    // Novas palavras
    'ABACATE', 'ABELHA', 'ABRACO', 'ACEROLA', 'AGENDA', 'AGULHA', 'ALFACE',
    'ALGODAO', 'ALICATE', 'ALMOFADA', 'AMEIXA', 'AMIZADE', 'ANCORA',
    'ANEL', 'ANTENA', 'APITO', 'AQUARIO', 'ARANHA', 'ARARA', 'ARQUIVO',
    'ARROZ', 'ATALHO', 'AVENTAL', 'AVIADOR', 'AZULEJO', 'BAIRRO',
    'BALANÇO', 'BAMBU', 'BANDEIRA', 'BARALHO', 'BARRIGA', 'BASTAO',
    'BATATA', 'BATOM', 'BELICHE', 'BERMUDA', 'BEXIGA', 'BIGODE',
    'BISCOITO', 'BLUSA', 'BOBINA', 'BONECA', 'BORRACHA', 'BOSQUE',
    'BOTAO', 'BRINCO', 'BRONZE', 'BRUXA', 'BUZINA', 'CABANA',
    'CABELO', 'CABIDE', 'CABO', 'CACTO', 'CADERNO', 'CAFUNE',
    'CAIXOTE', 'CALCA', 'CAMELO', 'CANECA', 'CANETA', 'CANHAO',
    'CANTIL', 'CAPIM', 'CARIMBO', 'CARPETE', 'CARRETA', 'CARTAO',
    'CARTEIRA', 'CASACO', 'CASULO', 'CAVERNA', 'CENOURA', 'CENTAVO',
    'CEREJA', 'CHALEIRA', 'CHAMINE', 'CHAPEU', 'CHARUTO', 'CHINELO',
    'CHUPETA', 'CIGARRA', 'CINEMA', 'CIRANDA', 'CIRCO', 'COBERTOR',
    'COELHO', 'COFRE', 'COLHER', 'COLMEIA', 'COMETA', 'COMPASSO',
    'CONCHA', 'CORDA', 'COROA', 'CORRENTE', 'CORTINA', 'CORUJAS',
    'COSTELA', 'CRAYON', 'CREME', 'CRISTA', 'CROCODILO', 'CUEIRO',
    'DEGRAU', 'DENTISTA', 'DESERTO', 'DESENHO', 'DIPLOMA', 'DOMINÓ',
    'DOURADO', 'DUENDE', 'ECLIPSE', 'ENXADA', 'ESCOVA', 'ESCUDO',
    'ESPELHO', 'ESPIGA', 'ESTANTE', 'ESTRADA', 'ESTRELA', 'ETIQUETA',
    'FAISCA', 'FANTOCHE', 'FARINHA', 'FAROFA', 'FERRADURA', 'FERRAMENTA',
    'FIVELA', 'FLORESTA', 'FOGUEIRA', 'FOLHAGEM', 'FORMIGA', 'FORNALHA',
    'FORNO', 'FRANJA', 'FRIGIDEIRA', 'FUNIL', 'FUTEBOL', 'GAITA',
    'GALHO', 'GARRAFA', 'GAVETA', 'GAZELA', 'GELEIA', 'GILETE',
    'GOLFINHO', 'GORRO', 'GRAVATA', 'GRINALDA', 'GUARDA', 'GUARDA-CHUVA',
    'GUITARRA', 'HALTER', 'HARPA', 'HASTE', 'HELICOPTERO', 'HIDRANTE',
    'HOLOFOTE', 'HORIZONTE', 'HOSPEDE', 'HUMIDADE', 'IGLU', 'ILHA',
    'IMAN', 'INDIO', 'INSETO', 'ISCA', 'ISQUEIRO', 'JANTAR',
    'JARDIM', 'JARRA', 'JASMIM', 'JIBOIA', 'JOANINHA', 'JOGO',
    'JORNAL', 'JUJUBA', 'JUNCO', 'JUNTA', 'LACRE', 'LADRILHO',
    'LAGARTA', 'LAGOSTA', 'LAMPADA', 'LAMPIAO', 'LANTERNA', 'LARANJA',
    'LAREIRA', 'LATA', 'LATAO', 'LEITE', 'LEME', 'LENCOL',
    'LENHA', 'LEOPARDO', 'LETRA', 'LETREIRO', 'LIMPEZA', 'LINGUA',
    'LITORAL', 'LIVRARIA', 'LIVRO', 'LIXEIRA', 'LOJA', 'LOMBADA',
    'LUNETA', 'LUSTRE', 'MACACO', 'MACHADO', 'MADEIRA', 'MALETA',
    'MALHA', 'MAMAO', 'MANCHA', 'MANGA', 'MANGUEIRA', 'MANTEIGA',
    'MAQUINA', 'MARGARIDA', 'MARTELO', 'MASCARA', 'MEDALHA', 'MEDUSA',
    // Novas palavras
    'ABACAXI', 'ABISMO', 'ACOLHE', 'AFETAR', 'ALFAME', 'ALINHA', 'AMADO', 'AMIGO',
    'AMOROSO', 'ANANÁS', 'ANTENA', 'APENAS', 'ARCOIR', 'ARROBA', 'ATENDE', 'AULAS',
    'BALADA', 'BALDE', 'BANGAL', 'BANCO', 'BASCA', 'BASTO', 'BEBIDA', 'BELA', 'BOCA',
    'BOMBA', 'BOSCO', 'BULHA', 'CABRA', 'CADERNO', 'CAMPO', 'CAPPA', 'CAPTA', 'CARRA',
    'CAUSA', 'CENTE', 'CIDADE', 'CIRCO', 'CLAUS', 'COALHO', 'COCOA', 'CONTA', 'COPA',
    'CORRE', 'CRAVO', 'CROTA', 'CURVA', 'DADOS', 'DELOI', 'DEMOS', 'DENGO', 'DESDE',
    'DICAS', 'DURAS', 'DOAR', 'DOLOR', 'DUETO', 'EFETO', 'ELOP', 'FADOS', 'FEIRA',
    'FELIC', 'FORNE', 'FOSSO', 'FOURT', 'GELAO', 'GIRAR', 'GOLA', 'GUIN', 'HOJE',
    'IDEIA', 'IMPAR', 'INFORM', 'JARDIM', 'JIRA', 'JIRU', 'JOGO', 'JUNTO', 'LADOS',
    'LIVRE', 'LUMIN', 'LOUVA', 'MATER', 'MELHO', 'METRO', 'MESA', 'MEXEU', 'MUTA',
    'NATURE', 'NAVE', 'NAUS', 'NEURO', 'NOVA', 'NORTE', 'NUBIA', 'OLHAS', 'OLHA',
    'OIRAO', 'PASTA', 'PISCA', 'PONTO', 'PRAZO', 'SABER', 'SINA', 'SOMAR', 'SOMBR',
    'SOMOS', 'TEMPO', 'TERRA', 'TEXTO', 'TOPO', 'TROCO', 'VITIA', 'VERO', 'VISTO'
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
    'GUAXINIM', 'HELICOPTERO', 'IGUANODONTE', 'JABUTICABA',
    // Novas palavras
    'ABACATEIRO', 'ABISSAL', 'ABUSIVO', 'ACELERAR', 'ACORDADO', 'ADORMECER', 'AERONAVE', 
    'ALAVANCAR', 'ALTERNAR', 'ANALISTA', 'ANIMADO', 'ASSOCIAR', 'ASSUMIR', 'ATACANTE', 
    'ATENDIMENTO', 'BALANÇO', 'BANDIDO', 'BANDEIRA', 'BARGANHA', 'BARTERIA', 'BASÍLICO', 
    'BATALHÃO', 'BELEZA', 'BEMVINDO', 'BERÇÁRIO', 'BIBLIOTECA', 'BOMBEIRO', 'BOUCLE', 
    'CABANAS', 'CAÇADOR', 'CALIFORNIA', 'CAMELO', 'CANTAR', 'CAPITÃO', 'CARROCA', 
    'CAIXOTE', 'CEMITÉRIO', 'CRISTAIS', 'CRIATIVO', 'CURIOSO', 'CUVERT', 'DIRETOR', 
    'DURADOURO', 'DÁDIVA', 'DESAFIO', 'DESTINO', 'DESINFEÇÃO', 'DINAMO', 
    'DISTRIBUIR', 'DOLADO', 'DOMÍNIO', 'EMBOLADO', 'EMERGENTE', 'EXCLUSIVO', 'EXPOSITOR', 
    'EXTRAÇÃO', 'FAFÁ', 'FALECER', 'FALIDO', 'FENÔMENO', 'FEITIÇOS', 'FREIOR', 
    'FUNDAMENTO', 'GALERIA', 'GARFO', 'GOTAS', 'GASTADO', 'GEMAS', 'GERENTE', 
    'GRAÇA', 'GRANDE', 'GUIA', 'GUSTO', 'HEITOR', 'HEITZEL', 'HONRAR', 'INFIM', 'INFLAÇÃO',
    'INFORMAÇÃO', 'INSISTENTE', 'INSUBMUNDO', 'INTIMAÇÃO', 'INTERNO', 'IMPREVÍVEL', 'JUGADOR',
    'JURISDICAO', 'JURISPRUDÊNCIA', 'LATERAL', 'LAVANDERIA', 'LÍDER', 'LEITURA',
    'LOTEAMENTO', 'LUAR', 'MÁGOA', 'MARGEM', 'MERCADO', 'MODIFICADO', 'MOVIMENTO', 
    'MEXEREM', 'MOROSO', 'MUTÁVEL', 'NAUSEA', 'NEGÓCIO', 'NOVA', 'OPINIÃO', 'OFÍCIO',
    'PRAZO', 'PARAÍSO', 'PERIGOSO', 'PREFERÊNCIA', 'PESQUISA', 'PORTAL', 'PORTO',
    'PASTAGEM', 'PODEROSO', 'PONTOS', 'PRODUTOS', 'PÓS', 'QUIDADO', 'QUINTEIRO',
    'REABRIR', 'RECEBER', 'REVELAR', 'RESPONDE', 'REVOLTADO', 'REGENERA', 'RISADAS',
    'SELEÇÃO', 'SERVIDOR', 'SOMBRIO', 'SUCESSO', 'SINTOMA', 'SÓFRE', 'SOMAR', 'TEMPO',
    'TERRENOS', 'TEXTO', 'TRAÇÃO', 'TORNEIO', 'TRIUNFADO', 'VICÍNIO', 'VISITAR',
    'VIDA', 'VOGAL', 'VIRADA', 'VALOR', 'VÍDEO', 'VITÓRIA', 'VENDAS', 'VENDENDO', 
    'VESTIR', 'ZUMBIDO', 'ZURZEAR'
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
    'INFECTOLOGIA', 'JURISPRUDENCIA', 
    'ACELERAÇÃO', 'ADMIRÁVEL', 'ALIMENTAÇÃO', 'AMERICANO', 'ANALITICA', 'APRENDIZAGEM', 'APROPRIAÇÃO', 
'ARQUITETURA', 'AUSTERIDADE', 'AUTORIDADE', 'BIBLIOTECA', 'CALENDARIO', 'CAPACIDADE', 'CARGA', 
'CONCEITUAL', 'CONSERVAÇÃO', 'CONSUMO', 'CORRESPONDE', 'DESAFIO', 'DESEJOSO', 'DESPREZADO', 
'DESENVOLVER', 'DESORGANIZAÇÃO', 'DISTRIBUIÇÃO', 'ENCERRAMENTO', 'ENERGÉTICO', 'ESPECIALISTA', 
'EXCLUSIVIDADE', 'EXERCÍCIO', 'EXTRAORDINÁRIO', 'FANTASIOSO', 'FAVORÁVEL', 'FISIOLOGIA', 'GARANTIDO', 
'GERENCIAMENTO', 'GLOBALIZAÇÃO', 'IMPRESSIONANTE', 'INDIVIDUAL', 'INSTRUMENTAL', 'INTERNACIONAL', 
'INTERAÇÃO', 'JORNALISTA', 'JURISPRUDÊNCIA', 'LABORATÓRIO', 'MATERIALIZAÇÃO', 'MESTRADO', 
'MINISTÉRIO', 'MOTIVAÇÃO', 'MULTICULTURAL', 'NECESSIDADE', 'OBSERVAÇÃO', 'ORIENTAÇÃO', 
'PALEONTOLOGIA', 'PENSAMENTO', 'PERSPECTIVA', 'POLÍTICA', 'POTENCIAL', 'PROGRESSO', 'PROTEÍNA', 
'PSICOLOGIA', 'QUALIFICAÇÃO', 'RECONHECIMENTO', 'RESPONSABILIDADE', 'REVELAÇÃO', 'RUMORES', 
'SEGURANÇA', 'SISTEMÁTICO', 'SOCIÁVEL', 'TECNOLOGIA', 'TOPOGRAFIA', 'TERRITÓRIO', 'VETERINÁRIA', 
'VIDA', 'VIGOROSA', 'ZOOLOGIA', 'ACIDENTE', 'DESAFIO', 'ESTÁVEL', 'EXCELENTE', 'EXPERIÊNCIA', 
'DESAFIO', 'ASSIMILAÇÃO', 'TRAJETÓRIA', 'SATISFAÇÃO', 'VENCIMENTO', 'ACOLHIMENTO', 'CARGA', 'DURABILIDADE', 
'FOTOGRAFIA', 'AGÊNCIA', 'SOCIALIZAÇÃO', 'SUPERAÇÃO', 'EXPOSIÇÃO', 'RECONHECIMENTO', 'HUMILDADE', 
'ALCANCE', 'TEORIA', 'SUSTENTÁVEL', 'MEIOAMBIENTE', 'EXTRAORDINÁRIA', 'ADAPTAR', 'ANTAGONISMO', 
'CONQUISTA', 'CONSTRUIR', 'HISTÓRIA', 'DESAPARECIMENTO', 'ZUMBIDO', 'JUSTIÇA', 'POTENCIALIZAR'
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