<template lang="pug">
header
  h1 Kaleidosync
  VisualizerPicker
  Settings
  Beta(:interior="true")
</template>

<script>
import Settings from '@/components/Settings'
import VisualizerPicker from '@/components/VisualizerPicker'
import Beta from '@/components/Beta'

export default {
  components: {
    VisualizerPicker, 
    Settings,
    Beta
  }
}
</script>


<style lang="scss" scoped>
header {
  @include position(fixed, 0 null null 0);
  @include flex(center, space-between);
  @include scale(height 140px 100px);
  width: 100%;
  background:white;
  color: black;
  z-index: 3000;
  padding: 30px;
  padding-left: 130px;

  @include max-width(header) {
    @include size(100%);
    display: block;
    padding: 30px 0 0 0;
    background: rgba(255, 255, 255, .8);
  }
}

h1 {
  @include gochi;
  @include scale(margin-left 30px 0px);
  text-transform: none;
  letter-spacing: -.1em;
  font-size: 42px;
  font-weight: 400;

  @include max-width(header) {
    line-height: 40px;
    margin-bottom: 30px;
    text-align: center;
  }
}
</style>
