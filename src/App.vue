<template lang="pug">
router-view
</template>

<script>
export default {
  created () {
    this.$store.dispatch('init')
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;700&family=Share&family=Gochi+Hand&display=swap');
@include reset;

html, body {
  @include size(100%);
}

body {
  font-family: 'Quicksand', sans-serif;
  font-weight: 300;

  * {
    font-family: inherit;
    font-weight: inherit;
  }

  @include mobile-landscape {
    @include size(100vw, 100vh);
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity $base-transition-duration $base-easing;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.fade-slow-enter-active, .fade-slow-leave-active {
  transition: opacity 1000ms $bounce-easing;
}

.fade-slow-enter, .fade-slow-leave-to {
  opacity: 0;
}

.slide-y-enter-active, .slide-y-leave-active {
  transition: transform $base-transition-duration $base-easing, opacity $base-transition-duration $base-easing;
}

.slide-y-enter, .slide-y-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.slide-x-enter-active, .slide-x-leave-active {
  transition: opacity $base-transition-duration $base-easing, transform $base-transition-duration $base-easing;
}

.slide-x-enter, .slide-x-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.shrink-enter-active, .shrink-leave-active {
  transition: all $base-transition-duration $base-easing;
}

.shrink-enter, .shrink-leave-to {
  height: 0px;
  opacity: 0;
  margin-top: 0rem;
}

</style>

