<template>
  <div class="wrapper">
    <div class="screen flex align-center justify-center">
      <section class="game-over-container">
        <h2 class="title">The Game Is Over!</h2>
        <h3 class="winner" v-if="isTimesUp">Times Up!</h3>
        <h3 class="winner" v-if="isDraw">It's A Draw!</h3>
        <h3 class="winner" v-else>The Winner Is: {{winner.name}}</h3>
        <button @click="onBackToHomepage" class="btn primary">Back to homepage</button>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "GameOver",
  props: ["winner", "isDraw", "isTimesUp"],
  methods: {
    onBackToHomepage() {
      this.$router.push("/");
    }
  }
};
</script>