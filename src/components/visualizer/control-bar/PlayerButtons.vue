<template lang="pug">
.player-buttons(v-if="!legacy")
  IconButton(icon="step-backward" @click="previous")
  IconButton(icon="play" v-if="paused" @click="play")
  IconButton(icon="pause" v-else @click="pause")
  IconButton(icon="step-forward" @click="next")
</template>

<script>
import IconButton from '@/components/common/IconButton'
import { bind } from '@zach.winter/vue-common/util/store'
import { mapGetters } from 'vuex'

export default {
  components: { IconButton },
  data: () => ({
    expanded: false
  }),
  computed: {
    ...mapGetters(['legacy']),
    ...bind(['player/paused'])
  },
  methods: {
    async play () {
      await this.$store.dispatch('spotify/play')
    },
    async pause () {
      await this.$store.dispatch('spotify/pause')
    },
    async previous () {
      await this.$store.dispatch('spotify/previous')
    },
    async next () {
      await this.$store.dispatch('spotify/next')
    }
  }
}
</script>

<style lang="scss" scoped>
.player-buttons {
  @include position(absolute, 50% null null 50%);
  @include flex(center, center, row);
  transform: translateX(-50%) translateY(-50%);
  color: $white;

  * { color: inherit; }

  @include max-width(tablet) {
    position: static;
    transform: none;
  }
}
</style>