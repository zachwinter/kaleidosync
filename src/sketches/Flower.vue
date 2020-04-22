<template lang="pug">
.flower
  Three(:shader="shader" :queues="queues" :uniforms="uniforms" :multiply="true")
  //- Controls(:uniforms="uniforms" :shader="shader" state-key="flower")
</template>

<script>
import { mapState } from 'vuex'
import Three from '@/components/Three'
import Controls from '@/components/Controls'

export default {
  components: { Three, Controls },
  computed: mapState({
    shader: ({ flower }) => flower.shader,
    queues: ({ flower }) => flower.queues,
    uniforms: ({ flower }) => flower.uniforms
  })
}
</script>