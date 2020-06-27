<template>
  <main class="main-container flex column align-center" v-if="game">
    <game-over
      v-if="game.winner || game.isDraw"
      :winner="game.winner"
      :isTimesUp="game.isTimesUp"
      :isDraw="game.isDraw"
    />
    <choose-name
      v-if="!isLoggedInUser && game.players.length < 2"
      @toggleLoggedInUser="toggleLoggedInUser"
    />
    <waiting v-if="game.players.length < 2 && isLoggedInUser" />
    <user-msg v-if="msg" :msg="msg" />
    <game-details
      :currTurn="game.currTurn.name"
      :players="game.players"
      :timer="turnTimer"
      :setTimerInterval="setTimerInterval"
      :timerClass="timerClass"
      v-if="game.players.length === 2"
    />
    <table class="main-table">
      <tr v-for="(col, colIdx) in game.mat" :key="colIdx">
        <td
          v-for="(cell, cellIdx) in game.mat"
          :class="`cell cell-${colIdx}-${cellIdx}`"
          :key="cellIdx + 10"
          @click="onCellClick(colIdx, cellIdx)"
        >
          <img
            class="symbol"
            :src="require(`../assets/${game.mat[colIdx][cellIdx]}-symbol-white.png`)"
            v-if="game.mat[colIdx][cellIdx]"
            alt
          />
          <span v-else></span>
        </td>
      </tr>
    </table>
  </main>
</template>

<script>
import GameOver from "../components/GameOver";
import ChooseName from "../components/ChooseName";
import Waiting from "../components/Waiting";
import UserMsg from "../components/UserMsg";
import GameDetails from "../components/GameDetails";
import socketService from "../services/socketService";
import { makeId } from "../services/utilService";

export default {
  name: "play-game",
  data() {
    return {
      isLoggedInUser: false,
      msg: "",
      msgTimeout: 0,
      turnTimer: 15,
      timerInterval: 0,
      timerClass: ""
    };
  },
  async created() {
    document.title = this.$route.meta.title;
    const gameId = this.$route.params.id;

    await this.loadGame();

    const { game, user, toggleLoggedInUser } = this;

    if (user) {
      this.$store.dispatch({ type: "setUser", user });
      toggleLoggedInUser();
      if (game && user !== game.players[0].name) {
        const player = {
          id: makeId(),
          name: user,
          symbol: "O",
          isActive: true
        };
        game.players.push(player);
        this.$store.dispatch({ type: "saveGame", game });
      }
    }

    socketService.setup();
    socketService.emit("setGame", gameId);
    socketService.on("loadGame", this.setGame);
    if (!game) return this.$router.push("/");
  },
  destroyed() {
    clearInterval(this.timerInterval);
    clearTimeout(this.msgTimeout);
    this.changePlayerActive();
    socketService.off("loadGame", this.setGame);
  },
  computed: {
    game() {
      return this.$store.getters.game;
    },
    user() {
      return this.$store.getters.loggedInUser;
    }
  },
  methods: {
    changePlayerActive() {
      const { user } = this;
      if (this.game.players.length > 1) return;

      const playerIndex = this.game.players.findIndex(p => p.name === user);
      this.game.players[playerIndex].isActive = false;

      const isActivePlayer = this.game.players.some(p => p.isActive);
      if (!isActivePlayer) {
        this.$store.dispatch({ type: "removeGame", id: this.game._id });
      }
    },
    setTimerInterval() {
      if (this.timerInterval) return;
      this.timerInterval = setInterval(() => {
        if (this.turnTimer <= 0) {
          clearInterval(this.timerInterval);
          const currTurnIdx = this.game.players.findIndex(
            p => p.id === this.game.currTurn.id
          );
          const winnerIdx = currTurnIdx === 1 ? 0 : 1;
          this.game.winner = this.game.players[winnerIdx];
          this.game.isTimesUp = true;
          this.timerClass = "";
          return this.$store.dispatch({ type: "saveGame", game: this.game });
        }
        if (this.turnTimer <= 6) {
          this.timerClass = "red";
        }
        if (!this.game.winner) {
          if (this.turnTimer > 6) {
            this.timerClass = "";
          }
          this.turnTimer -= 1;
        }
      }, 1000);
    },
    getCellSymbol(symbol) {
      let cellSymbol;
      switch (symbol) {
        case "X":
          return <img src="../assets/x-symbol.png" alt="" />;
        case "O":
          return <img src="../assets/o-symbol.png" alt="" />;
        default:
          return "";
      }
      return cellSymbol;
    },
    toggleLoggedInUser() {
      this.isLoggedInUser = !this.isLoggedInUser;
    },
    setGame(game) {
      this.turnTimer = 15;
      this.$store.dispatch({ type: "setGame", game });
    },
    async loadGame() {
      const { id } = this.$route.params;
      if (!id) return this.$router.push("/");
      await this.$store.dispatch({ type: "getGameById", id });
    },
    onCellClick(colIdx, cellIdx) {
      const { game, isTimeFinish } = this;
      // Check if the game is over OR
      // already used cell OR
      // not logged in user OR
      // only 1 player -
      // Can't click on a cell

      if (this.user !== game.currTurn.name && !game.winner) {
        this.msgTimeout = setTimeout(() => {
          this.msg = "";
        }, 2000);
        return (this.msg = "It's Not your turn, please wait");
      }

      if (
        game.winner ||
        game.mat[colIdx][cellIdx] ||
        !this.isLoggedInUser ||
        game.players.length === 1
      )
        return;

      // Setting the symbol on the mat
      game.mat[colIdx][cellIdx] = game.currTurn.symbol;

      // Check if the game is over
      if (
        this.checkIsRow(colIdx, cellIdx, game.currTurn.symbol) ||
        this.checkIsCol(colIdx, cellIdx, game.currTurn.symbol) ||
        this.checkIsDiagonal(colIdx, cellIdx, game.currTurn.symbol)
      ) {
        clearInterval(this.timerInterval);
        this.$store.dispatch({ type: "saveGame", game });
        return (game.winner = game.currTurn);
      }

      if (this.checkIsDraw()) {
        clearInterval(this.timerInterval);
        this.$store.dispatch({ type: "saveGame", game });
        return (game.isDraw = true);
      }

      // Change the current turn to the other player
      const currTurnIdx = game.players.findIndex(
        p => p.id === game.currTurn.id
      );
      const nextTurnIdx = currTurnIdx === 1 ? 0 : 1;
      game.currTurn = game.players[nextTurnIdx];

      this.turnTimer = 15;

      this.$store.dispatch({ type: "saveGame", game });
    },
    checkIsRow(colIdx, cellIdx, symbol) {
      let isRow = false;
      const { mat } = this.game;
      if (cellIdx === 0) {
        if (
          mat[colIdx][cellIdx + 1] === symbol &&
          mat[colIdx][cellIdx + 2] === symbol
        )
          return (isRow = true);
      } else if (cellIdx === 1) {
        if (
          mat[colIdx][cellIdx + 1] === symbol &&
          mat[colIdx][cellIdx - 1] === symbol
        )
          return (isRow = true);
      } else if (cellIdx === 2) {
        if (
          mat[colIdx][cellIdx - 1] === symbol &&
          mat[colIdx][cellIdx - 2] === symbol
        )
          return (isRow = true);
      }
      return isRow;
    },
    checkIsCol(colIdx, cellIdx, symbol) {
      let isCol = false;
      const { mat } = this.game;

      if (colIdx === 0) {
        if (
          mat[colIdx + 1][cellIdx] === symbol &&
          mat[colIdx + 2][cellIdx] === symbol
        )
          return (isCol = true);
      } else if (colIdx === 1) {
        if (
          mat[colIdx + 1][cellIdx] === symbol &&
          mat[colIdx - 1][cellIdx] === symbol
        )
          return (isCol = true);
      } else if (colIdx === 2) {
        if (
          mat[colIdx - 1][cellIdx] === symbol &&
          mat[colIdx - 2][cellIdx] === symbol
        )
          return (isCol = true);
      }

      return isCol;
    },
    checkIsDiagonal(colIdx, cellIdx, symbol) {
      let isDiagonal = false;
      const { mat } = this.game;

      if (cellIdx === 0) {
        if (colIdx === 0) {
          if (
            mat[colIdx + 1][cellIdx + 1] === symbol &&
            mat[colIdx + 2][cellIdx + 2] === symbol
          )
            return (isDiagonal = true);
        }
        if (colIdx === 2) {
          if (
            mat[colIdx - 1][cellIdx + 1] === symbol &&
            mat[colIdx - 2][cellIdx + 2] === symbol
          )
            return (isDiagonal = true);
        }
      }
      if (cellIdx === 2) {
        if (colIdx === 0) {
          if (
            mat[colIdx + 1][cellIdx - 1] === symbol &&
            mat[colIdx + 2][cellIdx - 2] === symbol
          )
            return (isDiagonal = true);
        }
        if (colIdx === 2) {
          if (
            mat[colIdx - 1][cellIdx - 1] === symbol &&
            mat[colIdx - 2][cellIdx - 2] === symbol
          )
            return (isDiagonal = true);
        }
      }
      if (cellIdx === 1 && colIdx === 1) {
        if (
          (mat[colIdx - 1][cellIdx + 1] === symbol &&
            mat[colIdx + 1][cellIdx - 1] === symbol) ||
          (mat[colIdx - 1][cellIdx - 1] === symbol &&
            mat[colIdx + 1][cellIdx + 1] === symbol)
        )
          return (isDiagonal = true);
      }
      return isDiagonal;
    },
    checkIsDraw() {
      const { mat } = this.game;
      let isDraw = true;
      mat.forEach((col, colIdx) =>
        col.forEach((cell, cellIdx) => {
          if (!mat[colIdx][cellIdx]) isDraw = false;
        })
      );

      return isDraw;
    }
  },
  components: { GameOver, ChooseName, Waiting, UserMsg, GameDetails }
};
</script>