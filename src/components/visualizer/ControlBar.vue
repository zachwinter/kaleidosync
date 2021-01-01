<template lang="pug">
.control-bar
  .flex
    CurrentTrack
  PlayerButtons
  .flex
    .buttons
      a(href="https://www.instagram.com/zachary.io" target="instagram"): IconButton(set="fab" icon="instagram").button
      FullScreen
      IconButton(v-if="legacy" icon="sync-alt" @click.native="$store.dispatch('player/legacyConnect')")
      IconButton(icon="cog" @click.native="$store.dispatch('ui/toggleSideBar')")
    SketchSelector
</template>

<script>
import { mapGetters } from 'vuex'
import PlayerButtons from '@/components/visualizer/control-bar/PlayerButtons'
import CurrentTrack from '@/components/visualizer/control-bar/CurrentTrack'
import IconButton from '@/components/common/IconButton'
import FullScreen from '@/components/visualizer/control-bar/FullScreen'
import SketchSelector from '@/components/visualizer/control-bar/SketchSelector'

export default {
  components: {
    PlayerButtons,
    CurrentTrack,
    IconButton,
    FullScreen,
    SketchSelector
  },
  computed: mapGetters(['legacy'])
}
</script>

<style lang="scss" scoped>
.control-bar {
  @include position(absolute, null 0 0 0);
  @include size(100%, $control-height);
  @include flex(center, space-between, row);
  padding: 0 $outer-padding;
  margin: 0 auto;
  border-bottom: 0;
  will-change: transform;
  z-index: 300;
  color: $white;
  background: $ui-color; 

  * { color: inherit; }

  @include max-width(mobile) {
    padding: 0 $outer-padding/2;
  }
}

.flex, .buttons {
  @include flex(center, center, row);
}

.button + a .button {
  margin-right: $base-margin / 2;
}


@include max-width(mobile) {
  .button + a .button {
    margin-right: 0;
  }
}

@include mobile-portrait {
  .buttons {
    @include position(absolute, null 0 null 0);

    > * {
      margin: 0 .25rem
    }
  }
}
</style>