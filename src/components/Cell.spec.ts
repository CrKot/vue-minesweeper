import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Cell from './Cell.vue'
import type { CellState } from '@/types/game'

const CELL_POSITION = {
  ROW: 2,
  COL: 3,
} as const

function createCell(overrides: Partial<CellState> = {}): CellState {
  return {
    isMine: false,
    isRevealed: false,
    isFlagged: false,
    neighborMines: 0,
    ...overrides,
  }
}

describe('Cell', () => {
  it('emits reveal with its position on left click', async () => {
    const wrapper = mount(Cell, {
      props: {
        cell: createCell(),
        row: CELL_POSITION.ROW,
        col: CELL_POSITION.COL,
      },
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('reveal')).toEqual([[CELL_POSITION.ROW, CELL_POSITION.COL]])
  })

  it('emits flag with its position on right click', async () => {
    const wrapper = mount(Cell, {
      props: {
        cell: createCell(),
        row: CELL_POSITION.ROW,
        col: CELL_POSITION.COL,
      },
    })

    await wrapper.trigger('contextmenu')

    expect(wrapper.emitted('flag')).toEqual([[CELL_POSITION.ROW, CELL_POSITION.COL]])
  })

  it('supports keyboard reveal and flag actions', async () => {
    const wrapper = mount(Cell, {
      props: {
        cell: createCell(),
        row: CELL_POSITION.ROW,
        col: CELL_POSITION.COL,
      },
    })

    await wrapper.trigger('keydown.enter')
    await wrapper.trigger('keydown.f')

    expect(wrapper.emitted('reveal')).toEqual([[CELL_POSITION.ROW, CELL_POSITION.COL]])
    expect(wrapper.emitted('flag')).toEqual([[CELL_POSITION.ROW, CELL_POSITION.COL]])
  })

  it('exposes an accessible label for cell state', () => {
    const wrapper = mount(Cell, {
      props: {
        cell: createCell({ isFlagged: true }),
        row: CELL_POSITION.ROW,
        col: CELL_POSITION.COL,
      },
    })

    expect(wrapper.attributes('role')).toBe('gridcell')
    expect(wrapper.attributes('tabindex')).toBe('0')
    expect(wrapper.attributes('aria-label')).toContain('флаг')
  })

  it('renders neighbor mine count for revealed numbered cells', () => {
    const neighborMines = 3
    const wrapper = mount(Cell, {
      props: {
        cell: createCell({ isRevealed: true, neighborMines }),
        row: CELL_POSITION.ROW,
        col: CELL_POSITION.COL,
      },
    })

    expect(wrapper.find('.number').text()).toBe(String(neighborMines))
    expect(wrapper.find('.number').classes()).toContain(`number-${neighborMines}`)
  })
})
