<template lang="pug">
.flower
  Three(:shader="shader" :x-base="xBase" :x-tick="xTick" :queues="queues" :uniforms="uniforms")
  Controls(:uniforms="uniforms" :shader="shader" state-key="flower" :xBase="xBase" :xTick="xTick")
</template>

<script>
import { mapState } from 'vuex'
import Three from '@/components/Three'
import Controls from '@/components/Controls'

export default {
  components: { Three, Controls },
  computed: mapState({
    shader: ({ flower }) => flower.shader,
    xBase: ({ flower }) => flower.xBase,
    xTick: ({ flower }) => flower.xTick,
    queues: ({ flower }) => flower.queues,
    uniforms: ({ flower }) => flower.uniforms
  })
}
</script>