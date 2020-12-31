<template lang="pug">
transition(name="fade")
  .current-track(v-if="track")
    img(:src="track.artwork")
    .text
      .track {{ track.track }}
      .artist {{ track.artist }}
</template>

<script>
import { bind } from '@zach.winter/vue-common/util/store'

export default {
  computed: {
    ...bind(['player/currentTrack']),
    track () {
      const track = this.currentTrack
      if (!track) return null
      return {
        artist: track.artists[0].name,
        track: track.name,
        album: track.album.name,
        artwork: track.album.images[2].url,
        albumId: track.album.id,
        artistId: track.artists[0].id
      } 
    }
  }
}
</script>

<style lang="scss" scoped>
.current-track {
  @include flex(center, center, row);
  text-align: left;
}

.text {
  @include flex(flex-start, center, column);
  height: 50px;

  @include mobile-portrait {
    display: none;
  }
}

img {
  @include size(50px);
  margin-right: $base-margin / 2; 
}

.track {
  font-family: 'Share', sans-serif;
  text-transform: uppercase;
  font-size: 22px;
  max-width: 250px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.artist {
  font-size: 14px;
}
</style>