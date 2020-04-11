<template lang="pug">
router-view
</template>

<style lang="scss">
@import 'sass/global/reset';
@import 'sass/global/fonts';
@import 'sass/global/transitions';

html, body, .home, .visualizer {
  @include size(100%, calc(100% + 1px));
  @include flex;
  overflow-x: hidden;
}

body { font-family: 'Open Sans', sans-serif; }
canvas { @include position(fixed, 0 0 0 0); }
</style>
