<script setup lang="ts">
import { computed } from 'vue'
import type { CellState } from '@/types'

const MIN_NUMBERED_NEIGHBORS = 0

const props = defineProps<{
  cell: CellState
  row: number
  col: number
}>()

const emit = defineEmits<{
  (e: 'reveal', row: number, col: number): void
  (e: 'flag', row: number, col: number): void
}>()

const ariaLabel = computed(() => {
  const position = `Строка ${props.row + 1}, столбец ${props.col + 1}`

  if (props.cell.isFlagged && !props.cell.isRevealed) return `${position}, флаг`
  if (!props.cell.isRevealed) return `${position}, закрытая ячейка`
  if (props.cell.isMine) return `${position}, мина`
  if (props.cell.neighborMines > MIN_NUMBERED_NEIGHBORS) {
    return `${position}, мин рядом: ${props.cell.neighborMines}`
  }

  return `${position}, пустая ячейка`
})

const numberClass = computed(() => `number-${props.cell.neighborMines}`)

function onClick() {
  emit('reveal', props.row, props.col)
}

function onFlag(event: Event) {
  event.preventDefault()
  emit('flag', props.row, props.col)
}
</script>

<template>
  <div
    class="cell"
    :class="{
      revealed: cell.isRevealed,
      mine: cell.isRevealed && cell.isMine,
      flagged: cell.isFlagged && !cell.isRevealed,
    }"
    role="gridcell"
    tabindex="0"
    :aria-label="ariaLabel"
    :aria-selected="cell.isRevealed"
    @click="onClick"
    @contextmenu.prevent="onFlag"
    @keydown.enter.prevent="onClick"
    @keydown.space.prevent="onClick"
    @keydown.f.prevent="onFlag"
  >
    <template v-if="cell.isRevealed">
      <span v-if="cell.isMine" class="mine-icon">💣</span>
      <span
        v-else-if="cell.neighborMines > MIN_NUMBERED_NEIGHBORS"
        class="number"
        :class="numberClass"
      >
        {{ cell.neighborMines }}
      </span>
    </template>
    <span v-else-if="cell.isFlagged" class="flag-icon">🚩</span>
  </div>
</template>

<style scoped>
.cell {
  width: var(--cell-size, 30px);
  height: var(--cell-size, 30px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  user-select: none;
  cursor: pointer;
  background: var(--cell-hidden-bg);
  border: 2px outset var(--cell-hidden-border);
  box-sizing: border-box;
}

.cell:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -2px;
}

.cell.revealed {
  background: var(--cell-revealed-bg);
  border: 1px solid var(--cell-revealed-border);
  cursor: default;
}

.cell.mine {
  background: var(--cell-mine-bg);
}

.cell.flagged {
  background: var(--cell-hidden-bg);
  border: 2px outset var(--cell-hidden-border);
}

.number {
  font-family: monospace;
}

.number-1 {
  color: var(--mine-1);
}

.number-2 {
  color: var(--mine-2);
}

.number-3 {
  color: var(--mine-3);
}

.number-4 {
  color: var(--mine-4);
}

.number-5 {
  color: var(--mine-5);
}

.number-6 {
  color: var(--mine-6);
}

.number-7 {
  color: var(--mine-7);
}

.number-8 {
  color: var(--mine-8);
}

.mine-icon,
.flag-icon {
  font-size: 16px;
  line-height: 1;
}
</style>
