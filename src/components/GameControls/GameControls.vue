<script setup lang="ts">
import type { Difficulty } from '@/types'

const props = defineProps<{
  difficulty: Difficulty
}>()

const emit = defineEmits<{
  (e: 'change-difficulty', difficulty: Difficulty): void
  (e: 'reset'): void
}>()

const difficulties: { label: string; value: Difficulty }[] = [
  { label: 'Лёгкий', value: 'easy' },
  { label: 'Средний', value: 'medium' },
  { label: 'Сложный', value: 'hard' },
]
</script>

<template>
  <div class="controls">
    <div class="difficulty-group">
      <button
        v-for="difficultyOption in difficulties"
        :key="difficultyOption.value"
        :class="{ active: props.difficulty === difficultyOption.value }"
        @click="emit('change-difficulty', difficultyOption.value)"
      >
        {{ difficultyOption.label }}
      </button>
    </div>
    <button class="reset-btn" @click="emit('reset')">🔄 Новая игра</button>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.difficulty-group {
  display: flex;
  gap: 6px;
}

button {
  padding: 6px 14px;
  border: 2px solid var(--border);
  background: var(--bg);
  color: var(--text);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

button:hover {
  border-color: var(--accent);
}

button.active {
  background: var(--accent-bg);
  border-color: var(--accent);
  color: var(--accent);
}

.reset-btn {
  font-weight: 500;
}
</style>
