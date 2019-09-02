<template lang="pug">
.spinner
  .loader(:style="{ backgroundColor: color }")
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['color'])
  }
}
</script>

<style scoped lang="scss">
.spinner {
  @include flex;
  z-index: 100;
}

.loader,
.loader:after {
  border-radius: 50%;
  width: 4em;
  height: 4em;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loader {
  border-top: .75em solid rgba(0, 0, 0, .1);
  border-right: .75em solid rgba(0, 0, 0, .1);
  border-bottom: .75em solid rgba(0, 0, 0, .1);
  border-left: .75em solid rgba(255, 255, 255, 1);
  animation: rotate 1s infinite linear;
}
</style>