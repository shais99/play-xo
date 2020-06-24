<template>
  <div class="game-details-container">
    <h2 class="curr-turn">
      Current Turn:
      <span class="semi-bold">{{currTurn}}</span>
    </h2>
    <h2 class="curr-turn">
      <span class="semi-bold">{{`${players[0].name} VS ${players[1].name}`}}</span>
    </h2>
    <h2 class="curr-turn">
      Time left:
      <span>{{timer}}</span>
    </h2>
  </div>
</template>

<script>
export default {
  name: "game-details",
  props: ["currTurn", "players", "timer", "setTimerInterval"],
  mounted() {
    this.setTimerInterval();
  }
};
</script>