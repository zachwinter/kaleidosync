<template lang="pug">
.visualizer
  transition(name="fade")
    div(v-if="devMode"): .opacity(:class="{ visible: !editingUniform }")
      Code(v-model="devSketch.shader" @input="$store.dispatch('visualizer/onCodeInput')")
  Sketch
  transition(name="fade"): Education(v-if="(!educated)")
  transition(name="slide-y"): ControlBar(v-if="!devMode && !sketchSelectorVisible && !editingUniform && ((connected && showControlBar && (autohideToolbar ? hover : true)) || (connected && !educated) || showSideBar)")
  transition(name="slide-x"): SideBar(v-if="showSideBar && !sketchSelectorVisible")
  transition(name="fade"): Sketches(v-if="sketchSelectorVisible")  
</template>

<script>
import { bind, dualBind } from '@zach.winter/vue-common/util/store'
import Connect from '@/components/visualizer/Connect'
import Sketch from '@/components/visualizer/Sketch'
import ControlBar from '@/components/visualizer/ControlBar'
import SideBar from '@/components/visualizer/SideBar'
import Sketches from '@/components/visualizer/control-bar/Sketches'
import Education from '@/components/education/Education'
import Code from '@/components/visualizer/Code'

export default {
  components: {
    Connect,
    Sketch,
    ControlBar,
    SideBar,
    Sketches,
    Education,
    Code
  },
  data: () => ({
    hover: false
  }),
  computed: {
    ...bind([
      'player/initialized', 
      'player/connected',
      'ui/showControlBar',
      'ui/autohideToolbar',
      'ui/showSideBar',
      'ui/controlPanelVisible',
      'ui/sketchSelectorVisible',
      'ui/editingUniform',
      'education/educated',
      'visualizer/devMode'
    ]),
    ...dualBind(['visualizer/sketch', 'visualizer/devSketch'])
  },
  async mounted () {
    this.a = window.__KALEIDOSYNC_LOOP__.watch('hover', val => {
      if (val) {
        document.body.style.cursor = 'default'
      } else {
        document.body.style.cursor = 'none'
      }

      this.hover = Object.freeze(val)
    }).id
    await this.$store.dispatch('spotify/init')
    await this.$store.dispatch('player/legacyConnect')
  },
  beforeDestroy () {
    window.__KALEIDOSYNC_LOOP__.unwatch('hover', this.a)
  }
}
</script>

<style lang="scss" scoped>
.visualizer {
  @include page;
  @include flex;
  background: black;
}

.opacity {
  opacity: 0;
  transition: opacity $base-transition;

  &.visible { opacity: 1; }
}
</style>