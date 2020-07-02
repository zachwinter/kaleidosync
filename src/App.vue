<template lang="pug">
router-view
</template>

<style lang="scss">
@import 'sass/global/reset';
@import 'sass/global/fonts';
@import 'sass/global/transitions';

html, body, .home, .visualizer {
  @include size(100%);
  @include flex;
  overflow-x: hidden;
}

body { font-family: 'Open Sans', sans-serif; }
</style>
