<template>
  <div class="hero-container flex column align-center">
    <div class="show-games-btn-container">
      <button
        @click="onGamesToggle"
        class="show-games-btn btn"
      >{{isGamesContainerOpen ? 'Hide Games' : 'Show Games'}}</button>
    </div>
    <games-container :games="games" v-if="isGamesContainerOpen" />
    <user-msg v-if="userMsg" :msg="userMsg" color="green" />
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
import GamesContainer from "../components/GamesContainer";
import socketService from "../services/socketService";
import UserMsg from "../components/UserMsg";

export default {
  data() {
    return {
      name: this.$store.getters.loggedInUser || "",
      isGamesContainerOpen: false,
      userMsg: "",
      userMsgTimeout: 0
    };
  },
  created() {
    document.title = this.$route.meta.title;
    this.setGames();

    socketService.setup();

    socketService.emit("setGames", this.games);
    socketService.on("loadGames", this.setGames);
    socketService.on("gameAdded", this.setUserMsg);
  },
  destroyed() {
    socketService.off("gameAdded", this.setUserMsg);
    socketService.off("loadGames", this.setGames);
    socketService.terminate();
    clearTimeout(this.userMsgTimeout);
  },
  computed: {
    games() {
      return this.$store.getters.games;
    }
  },
  methods: {
    setUserMsg(msg) {
      this.userMsg = msg;
      this.userMsgTimeout = setTimeout(() => {
        this.userMsg = "";
      }, 5000);
    },
    setGames() {
      this.$store.dispatch({ type: "loadGames" });
    },
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
            symbol: "X",
            isActive: true
          }
        ],
        winner: null,
        isDraw: false,
        isTimesUp: false,
        createdAt: new Date()
      };
      game.currTurn = game.players[0];
      this.$store.dispatch({ type: "setUser", user: this.name });
      const newGame = await this.$store.dispatch({ type: "addGame", game });
      this.userMsg = "Someone is looking for a partner... Let's Play!";
      socketService.emit("gameAdded", this.userMsg);

      this.$router.push(`/play/${newGame._id}`);
      this.name = "";
    },
    onGamesToggle() {
      this.isGamesContainerOpen = !this.isGamesContainerOpen;
    }
  },
  components: { GamesContainer, UserMsg }
};
</script>