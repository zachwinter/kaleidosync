<template lang="pug">
  Three(:shader="shader" :queues="queues" :uniforms="uniforms")
</template>

<script>
import { mapState } from 'vuex'
import Three from '@/components/Three'

export default {
  components: { Three },
  computed: mapState({
    shader: ({ gloop }) => gloop.shader,
    queues: ({ gloop }) => gloop.queues,
    uniforms: ({ gloop }) => gloop.uniforms
  })
}
</script>