import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import GameBoard from './GameBoard.vue'
import type { CellState } from '@/types/game'

const BOARD_ROWS = 2
const BOARD_COLS = 3

function createCell(): CellState {
  return {
    isMine: false,
    isRevealed: false,
    isFlagged: false,
    neighborMines: 0,
  }
}

function createBoard(rows = BOARD_ROWS, cols = BOARD_COLS): CellState[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, createCell))
}

describe('GameBoard', () => {
  it('renders every cell from the board matrix', () => {
    const wrapper = mount(GameBoard, {
      props: {
        board: createBoard(),
      },
    })

    expect(wrapper.findAllComponents({ name: 'Cell' })).toHaveLength(BOARD_ROWS * BOARD_COLS)
  })

  it('updates grid columns when board width changes', async () => {
    const nextBoardCols = 5
    const wrapper = mount(GameBoard, {
      props: {
        board: createBoard(),
      },
    })

    await wrapper.setProps({ board: createBoard(BOARD_ROWS, nextBoardCols) })

    expect(wrapper.find('.board').attributes('style')).toContain(`repeat(${nextBoardCols}`)
  })

  it('forwards cell events with coordinates', async () => {
    const wrapper = mount(GameBoard, {
      props: {
        board: createBoard(),
      },
    })

    await wrapper.findComponent({ name: 'Cell' }).trigger('click')

    expect(wrapper.emitted('reveal')).toEqual([[0, 0]])
  })
})
