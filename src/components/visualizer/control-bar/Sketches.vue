<template lang="pug">
.sketches
  ul
    li.clickable(
      v-for="({ shader, uniforms, _id }, i) in visibleSketches" 
      :key="i" 
      @click="selectSketch(_id)"
      :class="{ active: activeSketchId === _id}"
    ): Thumbnail(:sketch="{ shader, uniforms: buildUniforms(uniforms[0]) }")
  .buttons
    IconButton(icon="chevron-left" @click="onLeft" class="previous" :class="{ visible: showPrevious }")
    nav: a(v-for="(page, i) in pages" @click="selectPage(i)" :class="{ active: navigatorIndex === i }") {{ page }}
    IconButton(icon="chevron-right" @click="onRight"  class="next" :class="{ visible: showNext }")
    IconButton(icon="times" @click="$store.dispatch('ui/toggleSketchSelector')" class="close")
</template>

<script>
import { bind } from '@zach.winter/vue-common/util/store'
import { mapGetters } from 'vuex'
import Thumbnail from '@/components/common/Thumbnail'
import IconButton from '@/components/common/IconButton'
import { buildUniforms } from '@/util/uniforms'

export default {
  components: { Thumbnail, IconButton },
  data: () => ({
    numberVisible: 4
  }),
  computed: {
    ...bind([
      'visualizer/sketches',
      'visualizer/activeSketchId',
      'ui/sketchSelectorVisible',
      'ui/navigatorIndex',
      'keyboard/left',
      'keyboard/right'
    ]),
    ...mapGetters(['activeSketchIndex']),
    lastSketchId () {
      return this.sketches[this.activeSketchIndex - 1] ? this.sketches[this.activeSketchIndex - 1]._id : null
    },
    nextSketchId () {
      return this.sketches[this.activeSketchIndex + 1] ? this.sketches[this.activeSketchIndex + 1]._id : null
    },
    visibleSketches () {
      return [...this.sketches].slice(this.numberVisible * this.navigatorIndex, (this.numberVisible * this.navigatorIndex) + this.numberVisible)
    },
    showPrevious () {
      return this.activeSketchId !== this.sketches[0]._id
      // return this.navigatorIndex !== 0
    },
    showNext () {
      // return this.activeSketchId !== this.sketches[this.sketches.length - 1]._id
      return [...this.sketches].slice(this.numberVisible * (this.navigatorIndex + 1), (this.numberVisible * (this.navigatorIndex + 1)) + this.numberVisible).length
    },
    pages () {
      const total = Math.floor((this.sketches.length - 1) / this.numberVisible)
      const value = []
      for (let i = 0; i <= total; i++) {
        value.push(i + 1)
      }
      return value
    }
  },
  watch: {
    left () {
      const exists = this.visibleSketches.find(({ _id }) => _id === this.lastSketchId)
      if (!exists) this.$store.dispatch('ui/navBack')
      this.$store.dispatch('visualizer/selectSketch', this.lastSketchId)
    },
    right () {
      const exists = this.visibleSketches.find(({ _id }) => _id === this.nextSketchId)
      if (!exists) this.$store.dispatch('ui/navForward')
      this.$store.dispatch('visualizer/selectSketch', this.nextSketchId)
    },
  },
  methods: {
    buildUniforms,
    async onLeft () {
      this.$store.dispatch('ui/navBack')
    },
    async onRight () {
      this.$store.dispatch('ui/navForward')
    },
    selectPage (i) {
      this.$store.commit('ui/SET_NAVIGATOR_INDEX', i)
    },
    async selectSketch (_id) {
      this.$store.dispatch('visualizer/selectSketch', _id)
    }
  }
}
</script>

<style lang="scss" scoped>
$size: 200px;
$mobile-portrait-size: 60px;
$mobile-landscape-size: 100px;

.sketches {
  @include flex(center, center, row);
  @include position(fixed, 0 0 0 0);
  background: linear-gradient(to top, rgba($black, 1), rgba($black, .5));
  height: 100%;
}

ul {
  @include flex(center, center, row);
  position: relative;
  z-index: 10;
}

ul, li {
  margin: 0;
  padding: 0;
  list-style: none;
}

ul:hover {
  li {
    &:active { transform: scale(.85); }
  }
}

li {
  @include size($size);
  overflow: hidden;
  border-radius: $size;
  border: 5px solid transparent;
  transition: all $base-transition;
  box-shadow: 0 5px 5px 2px rgba($black, 1);
  margin: 0 1rem;
  transform: scale(.85);
  opacity: .7;

  @include mobile-portrait {
    @include size($mobile-portrait-size);
    border-width: 2px;
    margin: 0 .25rem;
  }

  @include mobile-landscape {
    @include size($mobile-landscape-size);
    border-width: 2px;
    margin: 0 .25rem;
  }

  &.active {
    border: 5px solid $white;
  }

  &:hover, &.active {
    opacity: 1;
    transform: scale(1);
  }
}

.icon-button {
  opacity: .25;
  pointer-events: none;
  transition: all $base-transition;

  &.visible, &.close {
    opacity: 1;
    pointer-events: all;
  }
}

.buttons {
  @include position(absolute, 50% 0 0 0);
  @include flex(center, center, row);
  z-index: 1;
}

.previous {
  left: $outer-padding;
}

.next {
  right: $outer-padding;
}

nav {
  color: $white;
  text-align: center;

  a {
    @include size(30px, auto);
    display: inline-block;
    text-align: center;

    &.active {
      font-weight: 700;

      &:hover { text-decoration: none; }
    }

    &:hover { text-decoration: underline; }
  }
}
</style>