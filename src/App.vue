<template lang="pug">
#router-view
  router-view
</template>

<style lang="scss">
@import 'sass/global/reset';
@import 'sass/global/fonts';

html, body {
  @include size(100%);
  overflow: hidden;
}

body {
  @include open-sans;
  text-align: center;

  #app, #router-view, #router-view > * {
    @include size(100%);
    @include flex;
  }
}

$transition-duration: 400ms ease-in-out;

.fade-enter-active, .fade-leave-active {
  transition: opacity $transition-duration;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.fadey-enter-active, .fadey-leave-active {
  transition: opacity $transition-duration, transform $transition-duration;
}

.fadey-enter, .fadey-leave-to {
  opacity: 0;
  transform: translateY(100px);
}

.fadeyn-enter-active, .fadeyn-leave-active {
  transition: opacity $transition-duration, transform $transition-duration;
}

.fadeyn-enter, .fadeyn-leave-to {
  opacity: 0;
  transform: translateY(-100px);
}

.fadex-enter-active, .fadex-leave-active {
  transition: opacity $transition-duration, transform $transition-duration;
}

.fadex-enter, .fadex-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

.fadeslide-enter-active, .fadeslide-leave-active {
  @include scale(width 150px 80px);
  margin-right: 15px;
  transition: opacity $transition-duration, width $transition-duration, margin $transition-duration, height $transition-duration;
}

.fadeslide-enter, .fadeslide-leave-to {
  opacity: 0;
  width: 0 !important;
  height: 0 !important;
  margin-right: 0 !important;
  overflow: hidden;
}
</style>