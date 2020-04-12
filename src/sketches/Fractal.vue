<template lang="pug">
  Three(:shader="shader" :x-base="xBase" :x-tick="xTick" :queues="queues")
</template>

<script>
import { mapState } from 'vuex'
import Three from '@/components/Three'

export default {
  components: { Three },
  computed: mapState({
    shader: ({ fractal }) => fractal.shader,
    xBase: ({ fractal }) => fractal.xBase,
    xTick: ({ fractal }) => fractal.xTick,
    queues: ({ fractal }) => fractal.queues
  })
}
</script>