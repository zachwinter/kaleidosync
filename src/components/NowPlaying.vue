<template lang="pug">
.now-playing
  transition(name="fadeslide")
    img(v-if="image.length > 0 && (albumArtVisible || alwaysShowAlbumArt) && !settingsVisible && !toast.visible && !hideAll" :src="image")
  transition(name="fade")
    div(:class="{ transitioning, initialized }" v-if="!settingsVisible && !toast.visible && !hideAll && (trackInfoVisible || alwaysShowTrackInfo)")
      span.name
        span(v-if="name" :style="{ transition: `opacity ${300}ms` }") {{ name }}
      br
      span.artist
        span(v-if="artist" :style="{ transition: `opacity ${300}ms` }") {{ artist }}
</template>

<script>
import { mapState} from 'vuex' 
import { SET_ALBUM_ART_VISIBLE, SET_TRACK_INFO_VISIBLE } from '@/store/modules/ui'

export default {
  data () {
    return {
      delay: 6000, // Visibility duration (ms)
      transitioning: false,
      initialized: false,
      image: '',
      name: '',
      artist: ''
    }
  },
  computed: mapState({
    currentlyPlaying: ({ spotify }) => spotify.currentlyPlaying,
    selectedVisualizer: ({ spotify }) => spotify.selectedVisualizer,
    loadingNextSong: ({ spotify }) => spotify.loadingNextSong,
    albumArtVisible: ({ ui }) => ui.albumArtVisible,
    alwaysShowAlbumArt: ({ user }) => user.alwaysShowAlbumArt,
    trackInfoVisible: ({ ui }) => ui.trackInfoVisible,
    alwaysShowTrackInfo: ({ user }) => user.alwaysShowTrackInfo,
    toast: ({ ui }) => ui.toast,
    settingsVisible: ({ ui }) => ui.settingsVisible,
    hover: ({ ui }) => ui.hover,
    hideAll: ({ ui }) => ui.hideAll
  }),
  watch: {
    currentlyPlaying: {
      handler (val, old) {
        const { image, artist, name } = this.getCurrentlyPlaying(val)
        this.image = image
        this.artist = artist
        this.name = name
        this.show(val, old)
      },
      immediate: true
    }
  },
  methods: {
    show () {
      this.$store.commit(`ui/${SET_ALBUM_ART_VISIBLE}`, true)
      this.$store.commit(`ui/${SET_TRACK_INFO_VISIBLE}`, true)
    
      this.timeout = setTimeout(() => {
        if (this.alwaysShowAlbumArt === false) {
          this.$store.commit(`ui/${SET_ALBUM_ART_VISIBLE}`, false)
        }

        if (this.alwaysShowTrackInfo === false) {
          this.$store.commit(`ui/${SET_TRACK_INFO_VISIBLE}`, false)
        }
      }, this.delay)
    },
    getCurrentlyPlaying (val = this.currentlyPlaying || null) {
      if (!val) return {}
      const name = val.name || false
      const album = val.album 
      const image = album ? album.images[1].url : false
      const artist = album ? album.artists[0].name : ''
      return { name, image, artist }
    }
  }
}
</script>

<style lang="scss" scoped>
.now-playing {
  @include position(fixed, null 0 0 0);
  @include flex(center, flex-start);
  @include scale(min-height 210px 140px);
  padding: 30px;
  z-index: 200;
  text-align: left;
  pointer-events: none;
}

img {
  @include scale(width 150px 80px, height 150px 80px);
  margin-right: 15px;
}

.name {
  @include share;
  @include scale(font-size 32px 18px);
}

.artist {
  @include scale(font-size 18px 14px);
}

.name, .artist {
  position: relative;
  span {
  background: black;
  color: white;
  padding: 3px 6px;
    position: relative;
    z-index: 10;

    // opacity: 0;
  }
}

i {
  @include position(absolute, 0 0 0 0);
  transform: scaleX(0);
  z-index: 20;
  display: block;
  background: #ffffff;
  transform-origin: left;
}

.initialized {
  .name, .artist {
    span { opacity: 1; }
  }
}

.transitioning i { transform: scaleX(1); }
</style>
