<template>
  <div class="user-msg-container" :class="colorClass">{{msg}}</div>
</template>

<script>
export default {
  name: "user-msg",
  props: ["msg", "color"],
  data() {
    return {
      colorClass: "red"
    };
  },
  created() {
    if (this.color) this.colorClass = this.color;
  }
};
</script>