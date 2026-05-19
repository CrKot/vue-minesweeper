<script setup lang="ts">
import { computed } from 'vue'
import type { CellState } from '@/types'
import Cell from '@/components/Cell'

const DEFAULT_COLUMN_COUNT = 0
const CELL_SIZE_PX = 30

const props = defineProps<{
  board: CellState[][]
}>()

const emit = defineEmits<{
  (e: 'reveal', row: number, col: number): void
  (e: 'flag', row: number, col: number): void
}>()

const cols = computed(() => props.board[DEFAULT_COLUMN_COUNT]?.length ?? DEFAULT_COLUMN_COUNT)
const boardStyle = computed(() => ({
  gridTemplateColumns: `repeat(${cols.value}, var(--cell-size))`,
  '--cell-size': `${CELL_SIZE_PX}px`,
}))
</script>

<template>
  <div class="board-wrap">
    <div class="board" role="grid" :style="boardStyle">
      <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row" role="row">
        <Cell
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          :cell="cell"
          :row="rowIndex"
          :col="colIndex"
          @reveal="(row, col) => emit('reveal', row, col)"
          @flag="(row, col) => emit('flag', row, col)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.board-wrap {
  max-width: 100%;
  overflow-x: auto;
  padding-bottom: 4px;
}

.board {
  display: inline-grid;
  gap: 0;
  border: 3px solid var(--board-border);
  background: var(--board-border);
}

.row {
  display: contents;
}
</style>
