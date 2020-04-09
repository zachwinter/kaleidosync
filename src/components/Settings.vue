<template lang="pug">
.settings
  form
    CheckBox(v-model="alwaysShowAlbumArt" label="Always Show Album Artwork")
    CheckBox(v-model="alwaysShowTrackInfo" label="Always Show Track Info")
</template>

<script>
import CheckBox from '@/components/CheckBox'
import {
  SET_ALWAYS_SHOW_TRACK_INFO, 
  SET_ALWAYS_SHOW_ALBUM_ART
} from '@/store/mutation-types'

export default {
  components: { CheckBox },
  computed: {
    alwaysShowTrackInfo: {
      get () {
        return this.$store.state.alwaysShowTrackInfo
      },
      set (value) {
        this.$store.commit(SET_ALWAYS_SHOW_TRACK_INFO, value)
      }
    },
    alwaysShowAlbumArt: {
      get () {
        return this.$store.state.alwaysShowAlbumArt
      },
      set (value) {
        this.$store.commit(SET_ALWAYS_SHOW_ALBUM_ART, value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.settings {
  @include flex(flex-start, flex-start);
  color: $black;
  text-align: left;
}

form {
  z-index: 80;

  @include max-width(header) { margin: 30px auto; }
}

label {
  @include flex;
  @include share;
  margin-left: 15px;
  font-size: 16px;
  color: $black;
  text-align: right;

  span { display: block; }

  @include min-width(laptop) { float: right; }

  @include max-width(laptop) {
    justify-content: flex-start;
    margin-bottom: 5px;
    margin-left: 0;

    & + label { margin-bottom: 0; }
  }
}
</style>