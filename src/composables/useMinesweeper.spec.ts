import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useMinesweeper } from './useMinesweeper'
import { DIFFICULTY_CONFIG } from '@/types/game'

const FIRST_ROW = 0
const FIRST_COL = 0
const TIMER_SECONDS_TO_ADVANCE = 3
const SECOND_MS = 1000

function mountMinesweeper() {
  let game: ReturnType<typeof useMinesweeper> | undefined

  const wrapper = mount(
    defineComponent({
      setup() {
        game = useMinesweeper()
        return () => null
      },
    })
  )

  if (!game) {
    throw new Error('Minesweeper composable was not initialized')
  }

  return { game, wrapper }
}

describe('useMinesweeper', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('creates an easy board by default', () => {
    const { game, wrapper } = mountMinesweeper()

    expect(game.board.value).toHaveLength(DIFFICULTY_CONFIG.easy.rows)
    expect(game.board.value[FIRST_ROW]).toHaveLength(DIFFICULTY_CONFIG.easy.cols)
    expect(game.status.value).toBe('idle')
    expect(game.flagsLeft.value).toBe(DIFFICULTY_CONFIG.easy.mines)

    wrapper.unmount()
  })

  it('resets board dimensions when difficulty changes', () => {
    const { game, wrapper } = mountMinesweeper()

    game.setDifficulty('hard')

    expect(game.board.value).toHaveLength(DIFFICULTY_CONFIG.hard.rows)
    expect(game.board.value[FIRST_ROW]).toHaveLength(DIFFICULTY_CONFIG.hard.cols)
    expect(game.difficulty.value).toBe('hard')
    expect(game.status.value).toBe('idle')

    wrapper.unmount()
  })

  it('starts the game on first reveal and never places a mine on that cell', () => {
    const { game, wrapper } = mountMinesweeper()

    game.reveal(FIRST_ROW, FIRST_COL)

    expect(game.status.value).toBe('playing')
    expect(game.board.value[FIRST_ROW][FIRST_COL].isMine).toBe(false)
    expect(game.board.value[FIRST_ROW][FIRST_COL].isRevealed).toBe(true)

    wrapper.unmount()
  })

  it('counts flags after the game starts', () => {
    const { game, wrapper } = mountMinesweeper()

    game.reveal(FIRST_ROW, FIRST_COL)
    const targetCell = game.board.value
      .flatMap((row, rowIndex) => row.map((cell, colIndex) => ({ cell, rowIndex, colIndex })))
      .find(({ cell }) => !cell.isRevealed)

    expect(targetCell).toBeDefined()

    game.flag(targetCell!.rowIndex, targetCell!.colIndex)

    expect(targetCell!.cell.isFlagged).toBe(true)
    expect(game.flagsLeft.value).toBe(DIFFICULTY_CONFIG.easy.mines - 1)

    wrapper.unmount()
  })

  it('does not allow flags before start or on revealed cells', () => {
    const { game, wrapper } = mountMinesweeper()

    game.flag(FIRST_ROW, FIRST_COL)
    expect(game.board.value[FIRST_ROW][FIRST_COL].isFlagged).toBe(false)

    game.reveal(FIRST_ROW, FIRST_COL)
    game.flag(FIRST_ROW, FIRST_COL)

    expect(game.board.value[FIRST_ROW][FIRST_COL].isFlagged).toBe(false)

    wrapper.unmount()
  })

  it('loses when a mine is revealed and shows every mine', () => {
    const { game, wrapper } = mountMinesweeper()

    game.reveal(FIRST_ROW, FIRST_COL)
    const mineCell = game.board.value
      .flatMap((row, rowIndex) => row.map((cell, colIndex) => ({ cell, rowIndex, colIndex })))
      .find(({ cell }) => cell.isMine)

    expect(mineCell).toBeDefined()

    game.reveal(mineCell!.rowIndex, mineCell!.colIndex)

    expect(game.status.value).toBe('lost')
    expect(game.board.value.flat().filter((cell) => cell.isMine).every((cell) => cell.isRevealed)).toBe(
      true
    )

    wrapper.unmount()
  })

  it('wins when all safe cells are revealed', () => {
    const { game, wrapper } = mountMinesweeper()

    game.reveal(FIRST_ROW, FIRST_COL)
    const safeCells = game.board.value
      .flatMap((row, rowIndex) => row.map((cell, colIndex) => ({ cell, rowIndex, colIndex })))
      .filter(({ cell }) => !cell.isMine)

    for (const safeCell of safeCells) {
      game.reveal(safeCell.rowIndex, safeCell.colIndex)
    }

    expect(game.status.value).toBe('won')

    wrapper.unmount()
  })

  it('stops timer after unmount', () => {
    vi.useFakeTimers()
    const { game, wrapper } = mountMinesweeper()

    game.reveal(FIRST_ROW, FIRST_COL)
    vi.advanceTimersByTime(TIMER_SECONDS_TO_ADVANCE * SECOND_MS)

    expect(game.time.value).toBe(TIMER_SECONDS_TO_ADVANCE)

    wrapper.unmount()
    vi.advanceTimersByTime(SECOND_MS)

    expect(game.time.value).toBe(TIMER_SECONDS_TO_ADVANCE)
  })
})
