<template lang="pug">
  Three(:shader="shader" :queues="queues" :uniforms="uniforms")
</template>

<script>
import { mapState } from 'vuex'
import Three from '@/components/Three'

export default {
  components: { Three },
  computed: mapState({
    shader: ({ fractal }) => fractal.shader,
    queues: ({ fractal }) => fractal.queues,
    uniforms: ({ flower }) => flower.uniforms
  })
}
</script>