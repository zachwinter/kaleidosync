<template lang="pug">
.fractal
  Three(:shader="shader" :queues="queues" :uniforms="uniforms")
  //- Controls(:uniforms="uniforms" :shader="shader" state-key="fractal")
</template>

<script>
import { mapState } from 'vuex'
import Three from '@/components/Three'
import Controls from '@/components/Controls'

export default {
  components: { Three, Controls },
  computed: mapState({
    shader: ({ fractal }) => fractal.shader,
    queues: ({ fractal }) => fractal.queues,
    uniforms: ({ fractal }) => fractal.uniforms
  })
}
</script>