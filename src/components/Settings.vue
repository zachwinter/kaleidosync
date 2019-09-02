<template lang="pug">
.settings
  form
    label
      .checkbox-container
        input(type="checkbox" v-model="alwaysShowAlbumArt")
        Check
      span Always Show Album Artwork
    label
      .checkbox-container
        input(type="checkbox" v-model="alwaysShowTrackInfo")
        Check
      span Always Show Track Info
</template>

<script>
import Check from './Check'
import { SET_ALWAYS_SHOW_TRACK_INFO, SET_ALWAYS_SHOW_ALBUM_ART } from '@/vuex/mutation-types'

export default {
  components: { Check },
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

h1 {
  @include share;
  @include scale(font-size 120px 50px, line-height 120px 50px);
  margin-bottom: 30px;
  color: $black;
}

form {
  z-index: 80;

  @include max-width(header) {
    margin: 30px auto;
  }
}

label {
  @include flex;
  @include share; 
  @include scale(font-size 16px 16px);
  color: $black;

  margin-left: 15px;
  text-align: right;

  span { display: block; }

  @include min-width(laptop) {
    float: right;
  }

  @include max-width(laptop) {
    justify-content: flex-start;
    margin-bottom: 5px;
    margin-left: 0;

    &+label { margin-bottom: 0; }
  }
}

.checkbox-container {
  @include size(40px);
  position: relative;
  margin-right: 10px;
  background: transparent;
  border: 2px solid black;
  border-radius: 100%;

  @include max-width(laptop) {
    @include size(30px);
  }
}

input {
  @include position(absolute, 0 0 0 0);
  @include size(100%);
  opacity: 0;
  z-index: 2;
}
</style>

<style lang="scss">
.settings form {
  svg {
    @include position(absolute, 20% 0 0 20%);
    @include size(60%);
    transition: opacity .3s ease-in-out;
    opacity: 0;
    z-index: 1;

    * { 
      fill: $black;
    }
  }

  input:checked + svg { opacity: 1; }
}
</style>