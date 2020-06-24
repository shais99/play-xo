<template>
  <div class="hero-container flex align-end justify-center">
    <form class="play-form flex column" v-on:submit.prevent="onPlayGame">
      <input
        type="text"
        v-model="name"
        name="name"
        class="play-input"
        autocomplete="off"
        placeholder="Your name..."
      />
      <button class="play-btn">Play Game!</button>
    </form>
  </div>
</template>

<script>
import { makeId } from "../services/utilService";
export default {
  data() {
    return {
      name: this.$store.getters.loggedInUser || ""
    };
  },
  created() {
    document.title = this.$route.meta.title;
    this.$store.dispatch({ type: "loadGames" });
  },
  methods: {
    async onPlayGame() {
      if (!this.name) return;
      const game = {
        mat: [
          ["", "", ""],
          ["", "", ""],
          ["", "", ""]
        ],
        players: [
          {
            id: makeId(),
            name: this.name,
            symbol: "X"
          }
        ],
        winner: null
      };
      game.currTurn = game.players[0];
      this.$store.dispatch({ type: "setUser", user: this.name });
      const newGame = await this.$store.dispatch({ type: "addGame", game });
      this.$router.push(`/play/${newGame._id}`);
      this.name = "";
    }
  }
};
</script>