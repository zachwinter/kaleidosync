<template lang="pug">
.scene
  Three(:shader="shader" :queues="queues" :uniforms="uniforms" :multiply="multiply" :beatIntervalOverride="beatInterval")
  Controls(
    :uniforms="uniforms" 
    :shader="shader" 
    @update="onUpdate" 
    @reset="$emit('reset')" 
    @copyShader="$emit('copyShader')"
    @copyUniforms="$emit('copyUniforms')"
  )
</template>

<script>
import Three from '@/components/Three'
import Controls from '@/components/Controls'

export default {
  props: {
    shader: {
      type: String,
      required: true
    },

    queues: {
      type: Array,
      required: true
    },

    uniforms: {
      type: Object,
      required: true
    },

    beatInterval: {
      type: String,
      default: null
    },
    
    multiply: {
      type: Boolean,
      default: true
    }
  },
  components: { Three, Controls },
  methods: {
    onUpdate (arg) {
      this.$emit('update', arg)
    }
  }
}
</script>