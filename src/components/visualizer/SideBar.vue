<template lang="pug">
.controls(:class="{ full: devMode, expand: devMode, transparent: editingUniform, hide: hideAll || (controlPanelVisible && !sketchSelectorVisible) }" v-if="connected")
  IconButton(icon="times" @click="close").close
  .opacity(:class="{ hidden: editingUniform }")
    Configuration
  Variants(v-if="!devMode")
  Uniforms
  .opacity(:class="{ hidden: editingUniform }")
    Keys(v-if="!isMobile && !devMode")
    Contact
</template>

<script>
import { mapState } from 'vuex'
import { bind } from '@zach.winter/vue-common/util/store'
import IconButton from '@/components/common/IconButton'
import Uniforms from '@/components/visualizer/side-bar/Uniforms'
import Variants from '@/components/visualizer/side-bar/Variants'
import Volume from '@/components/visualizer/side-bar/Volume'
import Configuration from '@/components/visualizer/side-bar/Configuration'
import Contact from '@/components/visualizer/side-bar/Contact'
import Keys from '@/components/visualizer/Keys'

export default {
  props: {
    sketch: Object
  },
  components: {
    IconButton,
    Uniforms, 
    Variants,
    Volume,
    Configuration,
    Contact,
    Keys
  },
  computed: {
    ...mapState(['isMobile']),
    ...bind([
      'player/connected',
      'ui/fullScreen',
      'ui/hideAll',
      'ui/showControlBar',
      'ui/sketchSelectorVisible',
      'ui/controlPanelVisible',
      'ui/editingUniform',
      'visualizer/devMode'
    ])
  },
  methods: {
    close () {
      this.$store.dispatch('ui/toggleSideBar')
      this.$store.commit('visualizer/SET_DEV_MODE', false)
    }
  }
}
</script>

<style lang="scss">
.controls {
  @include position(absolute, 0 0 $control-height null);
  @include size($sidebar-width, auto);
  transition: all $base-transition;
  overflow-y: scroll;
  z-index: 100;
  background: $ui-color;
  color: $white;
  font-family: 'Share', sans-serif;
  text-transform: uppercase;
  padding: 1rem;
  box-sizing: content-box;

  &.transparent {
    background: transparent;

    h3 { opacity: 0; }
  }

  .close {
    @include position(absolute, 1rem 1rem null null);
  }

  &.expand {
    width: $sidebar-width + 150px;
    bottom: 0;
  }

  &.full {
    bottom: 0;
  }

  * {
    font-family: inherit;
    color: inherit;
    text-transform: uppercase;
  }

  h2 {
    font-size: 1rem;
    line-height: 2rem;
  }
  
  h3 {
    @include separator;
    transition: opacity $base-transition;
  }

  @include mobile-portrait {
    width: 100%;
  }

  @include mobile-landscape {
    width: 50%;
  }

  .opacity {
    transition: opacity $base-transition;

    &.hidden { opacity: 0; }
  }
}
</style>