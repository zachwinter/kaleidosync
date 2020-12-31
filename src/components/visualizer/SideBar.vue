<template lang="pug">
.controls(:class="{ transparent: editingUniform, hide: hideAll || (controlPanelVisible && !sketchSelectorVisible) }" v-if="connected")
  IconButton(icon="times" @click="$store.dispatch('ui/toggleSideBar')").close
  BeatInterval
  //- Volume
  Variants
  Uniforms
  .opacity(:class="{ hidden: editingUniform }")
    Config
    Contact
</template>

<script>
import { bind } from '@zach.winter/vue-common/util/store'
import IconButton from '@/components/common/IconButton'
import Uniforms from '@/components/visualizer/side-bar/Uniforms'
import BeatInterval from '@/components/visualizer/side-bar/BeatInterval'
import Variants from '@/components/visualizer/side-bar/Variants'
import Volume from '@/components/visualizer/side-bar/Volume'
import Config from '@/components/visualizer/Config'
import Contact from '@/components/visualizer/side-bar/Contact'

export default {
  props: {
    sketch: Object
  },
  components: {
    IconButton,
    BeatInterval, 
    Uniforms, 
    Variants,
    Volume,
    Config,
    Contact
  },
  computed: bind([
    'player/connected',
    'ui/fullScreen',
    'ui/hideAll',
    'ui/showControlBar',
    'ui/sketchSelectorVisible',
    'ui/controlPanelVisible',
    'ui/editingUniform'
  ])
}
</script>

<style lang="scss">
.controls {
  @include position(absolute, 0 0 $control-height null);
  @include size($sidebar-width, auto);
  transition: all $base-transition;
  overflow-y: scroll;
  z-index: 100;
  background: linear-gradient(to bottom, $ui-color, rgba($black, .25));
  color: $white;
  font-family: 'Share', sans-serif;
  text-transform: uppercase;
  padding: 1rem;

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