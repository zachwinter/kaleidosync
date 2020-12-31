<template lang="pug">
.sketch-selector(ref="container")
  Thumbnail(:sketch="sketch" @click.native="$store.dispatch('ui/toggleSketchSelector')")
</template>

<script>
import Thumbnail from '@/components/common/Thumbnail'
import { bind } from '@zach.winter/vue-common/util/store'

export default {
  components: { Thumbnail },
  computed: bind(['visualizer/sketch'])
}
</script>

<style lang="scss" scoped>
.sketch-selector {
  margin-left: 1rem;
  cursor: pointer;
}

.thumbnail {
  @include size(50px);
  box-sizing: content-box;
  border: 2px solid $white;
  overflow: hidden;
  position: relative;
  z-index: 100;
}
</style>