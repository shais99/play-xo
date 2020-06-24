<template>
  <div class="wrapper">
    <div class="screen flex align-center justify-center">
      <section class="game-over-container">
        <h2 class="title">The Game Is Over!</h2>
        <h3 class="winner">The Winner Is: {{winner.name}}</h3>
        <button @click="onBackToHomepage" class="btn primary">Back to homepage</button>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "GameOver",
  props: ['winner'],
  methods: {
    onBackToHomepage() {
      this.$router.push('/')
    }
  }
};
</script>