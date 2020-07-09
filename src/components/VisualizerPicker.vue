<template lang="pug">
.visualizers 
  ul
    li(v-for="([viz, isNew], i) in visualizers" :key="i" @click="select(viz)")
      span(:class="{ selected: selectedVisualizer === viz }")
        img(:src="`https://s3-us-west-1.amazonaws.com/kaleidosync.com/${viz}.jpg`" :alt="viz")
      i(v-if="isNew") New
    li(@click="select('template')" v-if="!production").template Template
</template>

<script>
import { mapState } from 'vuex'
import { SET_SELECTED_VISUALIZER } from '@/store/modules/user'

export default {
  data: () => ({
    visualizers: [
      ['orbs', true],
      ['zoom', false],
      ['neon', false],
      // ['gloop', false],
      ['flower', false],
      ['fractal', false],
      ['trails', false],
      ['kaleidosync', false],
      ['blobs', false]
    ],
    production: PRODUCTION // eslint-disable-line
  }),
  computed: mapState({
    selectedVisualizer: ({ user }) => user.selectedVisualizer
  }),
  methods: {
    select (name) {
      this.$store.commit(`user/${SET_SELECTED_VISUALIZER}`, name)
    }
  }
}
</script>

<style lang="scss" scoped>
.visualizers {
  @include flex;
  text-align: left;
}

* { margin: 0; }

ul {
  @include flex(center);

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
  margin: 0 10px;
  transition: opacity 200ms ease-in-out;
  position: relative;

  @include max-width(mobile) { margin-bottom: 20px; }
}

li span {
  box-shadow: 0 0 10px white;
  transition: box-shadow 100ms linear;
}

img {
  @include size(50px);
  display: block;
  border-radius: 100px;
}

svg {
  @include size(50px);
  padding: 10px;
  display: block;
  border-radius: 100px;
}

.selected {
  display: block;
  border-radius: 100px;
  box-shadow: 0 0 10px $blue;
}

i {
  @include position(absolute, null 0 0 null);
  padding: 2px 5px;
  background: $red;
  color: $white;
  border-radius: 10px;
  font-size: 10px;
  font-style: normal;
}

.template { @include button($black); }
</style>