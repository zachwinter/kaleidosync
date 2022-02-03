<template lang="pug">
.sketch-selector(ref="container")
  transition(name="fade"): Thumbnail(v-if="activeSketch" :sketch="sketch" @click.native="click")
</template>

<script>
import Thumbnail from '@/components/common/Thumbnail'
import { bind } from '@zach.winter/vue-common/util/store'

export default {
  components: { Thumbnail },
  computed: bind(['visualizer/sketch', 'visualizer/activeSketch', 'education/educated']),
  methods: {
    click () {
      this.$store.dispatch('ui/toggleSketchSelector')
      if (!this.educated) this.$store.commit('education/SET_EDUCATED', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.sketch-selector {
  @include size(54px);
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