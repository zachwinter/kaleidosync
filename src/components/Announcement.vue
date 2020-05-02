<template lang="pug">
.announcement
  div
    h2 Welcome to #[span Kaleidosync]!
    p I've recently had to make changes to how the visualizer works due to a massive amount of new users over the past couple of weeks.
    p Kaleidosync now assumes that you're going to listen to entire songs. If you change songs before a song ends, it won't know to sync with the new song.
    p If you do decide to switch songs before a song ends, simply click the refresh button on the left.
    button(@click="dismiss") Dismiss
</template>

<script>
import { SET_EDUCATED } from '@/store/modules/user'

export default {
  methods: {
    dismiss () {
      this.$store.commit(`user/${SET_EDUCATED}`, true)
    }
  }
}
</script>

<style lang="scss" scoped>
$spacer: 15px;

.announcement {
  @include position(fixed, 0 0 0 0);
  @include flex;
  z-index: 100000;

  div {
    width: 100%;
    max-width: 600px;
    background: $black;
    color: $white;
    padding: $spacer * 3;
  }
}

h2 {
  font-size: 28px;
  margin-bottom: $spacer * 2;
}

p { margin-bottom: $spacer; }

button {
  @include button($white);
  margin-top: $spacer;
}

@include max-width(mobile) {
  .announcement {
    background: $black;

    div { padding: $spacer * 2; }
  }


  h2 {
    font-size: 20px;
    margin-bottom: $spacer;
  }
}
</style>