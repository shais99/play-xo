<template>
  <section class="games-container">
    <header class="games-header">
      <span>Against</span>
      <span>Created At</span>
      <span>Play Now</span>
    </header>
    <main class="games-main">
      <div class="game" v-for="game in games" :key="game._id">
        <span>{{game.players[0].name}}</span>
        <span>{{game.createdAt | moment}}</span>
        <button class="btn primary" @click="onGoToGame(game._id)">Play!</button>
      </div>
    </main>
  </section>
</template>

<script>
import moment from "moment";
export default {
  name: "games-container",
  props: ["games"],
  filters: {
    moment(date) {
      return moment(date).fromNow();
    }
  },
  methods: {
      onGoToGame(gameId) {
          this.$router.push(`/play/${gameId}`)
      }
  }
};
</script>