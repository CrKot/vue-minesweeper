<script setup lang="ts">
import type { GameStatus } from '@/types/game'

const props = defineProps<{
  status: GameStatus
  flagsLeft: number
  time: number
}>()

const statusEmoji: Record<GameStatus, string> = {
  idle: '🙂',
  playing: '😐',
  won: '😎',
  lost: '😵',
}
</script>

<template>
  <div class="status-bar" aria-live="polite">
    <div class="counter" aria-label="Осталось флагов">
      <span class="label" aria-hidden="true">💣</span>
      <span class="value">{{ flagsLeft }}</span>
    </div>
    <div class="emoji" :aria-label="`Статус игры: ${props.status}`">{{ statusEmoji[props.status] }}</div>
    <div class="counter" aria-label="Время игры">
      <span class="label" aria-hidden="true">⏱</span>
      <span class="value">{{ time }}</span>
    </div>
  </div>
</template>

<style scoped>
.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 8px 12px;
  border: 2px inset var(--status-border);
  background: var(--status-bg);
  margin-bottom: 12px;
  min-width: 200px;
}

.counter {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: monospace;
  font-size: 18px;
  font-weight: bold;
  color: var(--status-counter-text);
  background: var(--status-counter-bg);
  padding: 2px 8px;
  border: 1px inset var(--status-counter-border);
}

.label {
  font-size: 14px;
  color: var(--status-label);
  background: transparent;
}

.value {
  font-variant-numeric: tabular-nums;
}

.emoji {
  font-size: 24px;
  line-height: 1;
}
</style>
