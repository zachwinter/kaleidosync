<template lang="pug">
header
  h1 Kaleidosync
  .visualizers 
    ul(:data-selected="selectedVisualizer")
      li: span.kaleidosync(@click="select('kaleidosync')"): img(src="@/assets/kaleidosync.png" alt="Original")
      li: span.trails(@click="select('trails')"): img(src="@/assets/trails.jpg" alt="Trails")
      li: span.blobs(@click="select('blobs')"): img(src="@/assets/blobs.jpg" alt="Blobs")
      li: span.wavesync(@click="select('wavesync')"): img(src="@/assets/wavesync.png" alt="Wavesync")
  Settings
</template>

<script>
import { mapState } from 'vuex'
import Settings from '@/components/Settings'
import Check from './Check'
import VISUALIZERS from '@/enums'
import { SET_VISUALIZER } from '@/vuex/mutation-types'

export default {
  components : {
    Settings,
    Check
  },
  computed: {
    ...mapState(['selectedVisualizer', 'alwaysShowAlbumArt', 'alwaysShowTrackInfo'])
  },
  methods: {
    select (name) {
      this.$store.commit(SET_VISUALIZER, name)

      if (this.$ga) {
        this.$ga.event({
          eventCategory: 'visualizer',
          eventAction: 'selected',
          eventLabel: name,
          eventValue: VISUALIZERS[name.toUpperCase()].id
        })
      }
    }
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
  }
}

h2 {
  font-size: 18px;
  margin-bottom: 20px;
}

.visualizers {
  @include flex;
  text-align: left;

  * { margin: 0; }

  ul {
    @include flex(center, flex-start);

    @include max-width(mobile) {
      max-width: 200px;
      flex-wrap: wrap;
    }
  }

  @keyframes fade-in {
    0% {
      opacity: 0;
      transform: scale(0);
    }

    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  li {
    margin-right: 20px;
    transition: opacity 200ms ease-in-out;
    // animation: fade-in 400ms $slide-easing forwards;
    // opacity: 0;
    // @include cascade;

    &:last-child { margin-right: 0; }

    @include max-width(mobile) {
      margin-bottom: 20px;
    }
  }

  li span {
    box-shadow: 0 0 10px white;
    transition: box-shadow 100ms linear;
  }

  img {
    @include size(80px);
    display: block;
    border-radius: 100px;
  }
}

%style {
  display: block;
  border-radius: 100px;
  box-shadow: 0 0 10px $blue;
}

[data-selected="kaleidosync"] .kaleidosync { @extend %style; }
[data-selected="trails"] .trails { @extend %style; }
[data-selected="wavesync"] .wavesync { @extend %style; }
[data-selected="blobs"] .blobs { @extend %style; }
[data-selected="purple"] .purple { @extend %style; }

</style>
