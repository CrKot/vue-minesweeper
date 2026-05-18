<script setup lang="ts">
import { useMinesweeper } from "./composables/useMinesweeper";
import GameBoard from "./components/GameBoard.vue";
import GameControls from "./components/GameControls.vue";
import GameStatus from "./components/GameStatus.vue";

const {
  board,
  status,
  flagsLeft,
  time,
  difficulty,
  reveal,
  flag,
  resetGame,
  setDifficulty,
} = useMinesweeper();
</script>

<template>
  <div class="game-wrapper">
    <h1>Сапер</h1>
    <GameControls
      :difficulty="difficulty"
      @change-difficulty="setDifficulty"
      @reset="resetGame"
    />
    <GameStatus :status="status" :flags-left="flagsLeft" :time="time" />
    <GameBoard :board="board" @reveal="reveal" @flag="flag" />
  </div>
</template>

<style scoped>
.game-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
}

h1 {
  margin: 0 0 16px;
  font-size: 32px;
}
</style>
