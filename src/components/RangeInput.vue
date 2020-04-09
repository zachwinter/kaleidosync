<template lang="pug">
.range
  span {{ min }}
  input(type="range" :min="min" :max="max" :step="step" :value="value" @input="$emit('input', $event)")
  span {{ max }}
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    step: {
      type: Number,
      default: 1
    }
  }
}
</script>

<style lang="scss" scoped>
.range {
  @include flex;
}
</style>
