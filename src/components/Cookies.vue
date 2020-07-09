<template lang="pug">
.cookies(:class="{ visible }")
  p Kaleidosync uses cookies to analyze web traffic and to serve more relevant ads. Learn more by visiting our #[strong #[router-link(to="/privacy") Privacy Policy]]
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
.cookies {
  @include position(fixed, null 0 0 0);
  background: $black;
  color: $white;
  margin: 0 auto;
  transform: translateY(100%);
  line-height: 24px;
  transition: transform 1000ms $bounce-easing;
  text-align: center;
  padding: 5px $outer-padding;

  &.visible { transform: translateY(0%); }
}

button {
  @include button($white);
  display: inline-block;
  padding: 0 10px;
  height: 30px;
  font-size: 12px;
  margin-left: 15px;
}

strong {
  a {
    color: $white;
  }
}
</style>