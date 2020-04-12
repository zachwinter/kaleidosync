<template lang="pug">
  Three(:shader="shader" :x-base="xBase" :x-tick="xTick" :queues="queues")
</template>

<script>
import { mapState } from 'vuex'
import Three from '@/components/Three'

export default {
  components: { Three },
  computed: mapState({
    shader: ({ flower }) => flower.shader,
    xBase: ({ flower }) => flower.xBase,
    xTick: ({ flower }) => flower.xTick,
    queues: ({ flower }) => flower.queues
  })
}
</script>