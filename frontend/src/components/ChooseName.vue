<template>
  <div class="wrapper">
    <div class="screen flex align-center justify-center">
      <div class="game-over-container choose-name">
        <form class="choose-name-form flex column" v-on:submit.prevent="onChooseName">
          <input
            type="text"
            v-model="name"
            name="name"
            class="name-input"
            autocomplete="off"
            placeholder="Your name..."
          />
          <button class="choose-name-btn">Play Game!</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { makeId } from "../services/utilService";
export default {
  data() {
    return {
      name: ""
    };
  },
  computed: {
    game() {
      return this.$store.getters.game;
    }
  },
  methods: {
    onChooseName() {
      const { game, name } = this;
      if (!name) return;
      const player = {
        id: makeId(),
        name,
        symbol: "O"
      };
      game.players.push(player);
      
      this.$store.dispatch({ type: "setUser", user: name });
      this.$store.dispatch({ type: "saveGame", game });
      this.$emit("toggleLoggedInUser");
      this.name = "";
    }
  }
};
</script>