<template>
  <div class="user-msg-container">{{msg}}</div>
</template>

<script>
export default {
  name: "user-msg",
  props: ["msg"]
};
</script>