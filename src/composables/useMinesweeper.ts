import { ref, computed, onUnmounted, type Ref } from 'vue'
import type { CellState, GameStatus, Difficulty, GameConfig } from '@/types/game'
import { DIFFICULTY_CONFIG } from '@/types/game'

const DEFAULT_NEIGHBOR_MINES = 0
const INITIAL_TIME_SECONDS = 0
const MISSING_BOARD_INDEX = -1
const FIRST_INDEX = 0
const TIMER_TICK_MS = 1000
const NEIGHBOR_OFFSETS = [-1, 0, 1] as const

function createEmptyBoard(rows: number, cols: number): CellState[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: DEFAULT_NEIGHBOR_MINES,
    }))
  )
}

function placeMines(
  board: CellState[][],
  mines: number,
  excludeRow = MISSING_BOARD_INDEX,
  excludeCol = MISSING_BOARD_INDEX
) {
  const rows = board.length
  const cols = board[FIRST_INDEX].length
  const positions: [number, number][] = []

  for (let rowIndex = FIRST_INDEX; rowIndex < rows; rowIndex++) {
    for (let colIndex = FIRST_INDEX; colIndex < cols; colIndex++) {
      if (rowIndex === excludeRow && colIndex === excludeCol) continue
      positions.push([rowIndex, colIndex])
    }
  }

  if (mines > positions.length) {
    throw new RangeError(`Cannot place ${mines} mines on ${positions.length} available cells`)
  }

  for (let positionIndex = positions.length - 1; positionIndex > FIRST_INDEX; positionIndex--) {
    const randomIndex = Math.floor(Math.random() * (positionIndex + 1))
    ;[positions[positionIndex], positions[randomIndex]] = [
      positions[randomIndex],
      positions[positionIndex],
    ]
  }

  for (let mineIndex = FIRST_INDEX; mineIndex < mines; mineIndex++) {
    const [rowIndex, colIndex] = positions[mineIndex]
    board[rowIndex][colIndex].isMine = true
  }
}

function countMines(board: CellState[][], row: number, col: number): number {
  const rows = board.length
  const cols = board[FIRST_INDEX].length
  let count = DEFAULT_NEIGHBOR_MINES
  for (const rowOffset of NEIGHBOR_OFFSETS) {
    for (const colOffset of NEIGHBOR_OFFSETS) {
      if (rowOffset === 0 && colOffset === 0) continue
      const neighborRow = row + rowOffset
      const neighborCol = col + colOffset
      if (
        neighborRow >= FIRST_INDEX &&
        neighborRow < rows &&
        neighborCol >= FIRST_INDEX &&
        neighborCol < cols &&
        board[neighborRow][neighborCol].isMine
      ) {
        count++
      }
    }
  }
  return count
}

function computeNeighborMines(board: CellState[][]) {
  const rows = board.length
  const cols = board[FIRST_INDEX].length
  for (let rowIndex = FIRST_INDEX; rowIndex < rows; rowIndex++) {
    for (let colIndex = FIRST_INDEX; colIndex < cols; colIndex++) {
      if (!board[rowIndex][colIndex].isMine) {
        board[rowIndex][colIndex].neighborMines = countMines(board, rowIndex, colIndex)
      }
    }
  }
}

function revealCell(board: CellState[][], row: number, col: number) {
  const rows = board.length
  const cols = board[FIRST_INDEX].length
  const queue: [number, number][] = [[row, col]]
  let queueIndex = FIRST_INDEX

  while (queueIndex < queue.length) {
    const [currentRow, currentCol] = queue[queueIndex]
    queueIndex++
    const cell = board[currentRow][currentCol]

    if (cell.isRevealed || cell.isFlagged) continue

    cell.isRevealed = true

    if (cell.neighborMines !== DEFAULT_NEIGHBOR_MINES || cell.isMine) continue

    for (const rowOffset of NEIGHBOR_OFFSETS) {
      for (const colOffset of NEIGHBOR_OFFSETS) {
        if (rowOffset === 0 && colOffset === 0) continue
        const neighborRow = currentRow + rowOffset
        const neighborCol = currentCol + colOffset
        if (
          neighborRow >= FIRST_INDEX &&
          neighborRow < rows &&
          neighborCol >= FIRST_INDEX &&
          neighborCol < cols
        ) {
          queue.push([neighborRow, neighborCol])
        }
      }
    }
  }
}

function checkWin(board: CellState[][]): boolean {
  for (const row of board) {
    for (const cell of row) {
      if (!cell.isMine && !cell.isRevealed) return false
    }
  }
  return true
}

export function useMinesweeper() {
  const difficulty: Ref<Difficulty> = ref('easy')
  const config = computed<GameConfig>(() => DIFFICULTY_CONFIG[difficulty.value])

  const board: Ref<CellState[][]> = ref(createEmptyBoard(config.value.rows, config.value.cols))
  const status: Ref<GameStatus> = ref('idle')
  const time = ref(INITIAL_TIME_SECONDS)
  let timerId: ReturnType<typeof setInterval> | null = null

  const flagsLeft = computed(() => {
    const flagged = board.value.flat().filter((cell) => cell.isFlagged).length
    return config.value.mines - flagged
  })

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    }
  }

  function startTimer() {
    stopTimer()
    time.value = INITIAL_TIME_SECONDS
    timerId = setInterval(() => {
      time.value++
    }, TIMER_TICK_MS)
  }

  function resetGame() {
    stopTimer()
    status.value = 'idle'
    time.value = INITIAL_TIME_SECONDS
    board.value = createEmptyBoard(config.value.rows, config.value.cols)
  }

  function startGame(firstRow: number, firstCol: number) {
    const newBoard = createEmptyBoard(config.value.rows, config.value.cols)
    placeMines(newBoard, config.value.mines, firstRow, firstCol)
    computeNeighborMines(newBoard)
    board.value = newBoard
    status.value = 'playing'
    startTimer()
    revealCell(board.value, firstRow, firstCol)
  }

  function reveal(row: number, col: number) {
    if (status.value === 'won' || status.value === 'lost') return
    if (board.value[row][col].isFlagged) return

    if (status.value === 'idle') {
      startGame(row, col)
    } else {
      if (board.value[row][col].isRevealed) return
      revealCell(board.value, row, col)
    }

    if (board.value[row][col].isMine) {
      for (const boardRow of board.value) {
        for (const cell of boardRow) {
          if (cell.isMine) cell.isRevealed = true
        }
      }
      status.value = 'lost'
      stopTimer()
      return
    }

    if (checkWin(board.value)) {
      status.value = 'won'
      stopTimer()
    }
  }

  function flag(row: number, col: number) {
    if (status.value !== 'playing') return
    const cell = board.value[row][col]
    if (cell.isRevealed) return
    cell.isFlagged = !cell.isFlagged
  }

  function setDifficulty(nextDifficulty: Difficulty) {
    difficulty.value = nextDifficulty
    resetGame()
  }

  onUnmounted(stopTimer)

  return {
    board,
    status,
    flagsLeft,
    time,
    difficulty,
    reveal,
    flag,
    resetGame,
    setDifficulty,
  }
}
