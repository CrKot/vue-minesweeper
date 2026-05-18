export type CellState = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
}

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type GameConfig = {
  rows: number
  cols: number
  mines: number
}

export const GAME_BOARD = {
  EASY_ROWS: 9,
  EASY_COLS: 9,
  EASY_MINES: 10,
  MEDIUM_ROWS: 16,
  MEDIUM_COLS: 16,
  MEDIUM_MINES: 40,
  HARD_ROWS: 16,
  HARD_COLS: 30,
  HARD_MINES: 99,
} as const

export const DIFFICULTY_CONFIG: Record<Difficulty, GameConfig> = {
  easy: {
    rows: GAME_BOARD.EASY_ROWS,
    cols: GAME_BOARD.EASY_COLS,
    mines: GAME_BOARD.EASY_MINES,
  },
  medium: {
    rows: GAME_BOARD.MEDIUM_ROWS,
    cols: GAME_BOARD.MEDIUM_COLS,
    mines: GAME_BOARD.MEDIUM_MINES,
  },
  hard: {
    rows: GAME_BOARD.HARD_ROWS,
    cols: GAME_BOARD.HARD_COLS,
    mines: GAME_BOARD.HARD_MINES,
  },
}
