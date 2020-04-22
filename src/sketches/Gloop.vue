<template lang="pug">
.gloop
  Three(:shader="shader" :queues="queues" :uniforms="uniforms")
  //- Controls(:uniforms="uniforms" :shader="shader" state-key="gloop")
</template>

<script>
import { mapState } from 'vuex'
import Three from '@/components/Three'
// import Controls from '@/components/Controls'

export default {
  components: { Three /*, Controls */ },
  computed: mapState({
    shader: ({ gloop }) => gloop.shader,
    queues: ({ gloop }) => gloop.queues,
    uniforms: ({ gloop }) => gloop.uniforms
  })
}
</script>