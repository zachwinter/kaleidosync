<template lang="pug">
.cookies(:class="{ visible: true }")
  p Kaleidosync uses cookies to analyze web traffic and to serve more relevant ads. Learn more by visiting our #[strong #[router-link(to="/privacy") Privacy Policy]]
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState({
    cookies: ({ user }) => user.cookies
  }),
  methods: {
    dismiss () {
      this.$store.dispatch('user/hideCookieNotice')
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
  opacity: 0;
  line-height: 24px;
  transition: opacity 300ms ease-in-out;
  text-align: center;
  padding: 5px $outer-padding;

  &.visible { opacity: 1; }
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