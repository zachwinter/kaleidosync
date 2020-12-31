<template lang="pug">
.thumbnail: Renderer(
  :hidpi="true" 
  ref="renderer" 
  :sketch="sketch"
  :autosize="true"
  :activeIntervals="activeIntervals"
  :beatInterval="beatInterval"
  :volume="volume"
).renderer
</template>

<script>
import Renderer from '@/components/common/Renderer'
import { bind } from '@zach.winter/vue-common/util/store'

export default {
  data: () => ({
    activeIntervals: null,
    volume: 0
  }),
  props: {
    sketch: Object
  },
  components: { Renderer },
  computed: bind(['player/beatInterval']),
  async mounted () {
    this.a = window.__KALEIDOSYNC_LOOP__.watch('tick', () => this.$refs?.renderer?.tick() || null).id
    this.b = window.__KALEIDOSYNC_LOOP__.watch('activeIntervals', val => this.activeIntervals = Object.freeze(val)).id
    this.c = window.__KALEIDOSYNC_LOOP__.watch('volume', val => this.volume = val).id
    this.$refs.renderer.tick()
  },
  beforeDestroy () {
    window.__KALEIDOSYNC_LOOP__.unwatch('tick', this.tick)
    window.__KALEIDOSYNC_LOOP__.unwatch('activeIntervals', this.b)
    window.__KALEIDOSYNC_LOOP__.unwatch('volume', this.c)
  }
}
</script>

<style lang="scss" scoped>
.thumbnail {
  @include size(100%);
  border-radius: 100px;
  overflow: hidden;
}

.renderer {
  transition: transform $hover-transition;
}
</style>