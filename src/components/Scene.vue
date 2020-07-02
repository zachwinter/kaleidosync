<template lang="pug">
.scene
  Three(:shader="shader" :queues="queues" :booleans="booleans" :uniforms="uniforms" :multiply="multiply" :beatIntervalOverride="beatInterval")
  Controls(
    :uniforms="uniforms" 
    :shader="shader" 
    :booleans="booleans"
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

    booleans: {
      type: Object,
      default: null
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

<style lang="scss" scoped>
.scene {
  @include position(fixed, 0 null null 0);
  @include size(100vw, 100vh);
  will-change: opacity;
}
</style>