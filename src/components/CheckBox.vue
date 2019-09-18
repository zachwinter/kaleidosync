<template lang="pug">
label
  .checkbox-container
    input(type="checkbox" :checked="value" ref="input" @change="updateValue")
    Check
  span {{ label }}
</template>

<script>
import Check from '@/assets/svg/check.svg'

export default {
  props: ['value', 'label'],
  components: { Check },
  methods: {
    updateValue () {
      this.$emit('input', this.$refs.input.checked)
    }
  }
}
</script>

<style lang="scss" scoped>
.checkbox-container {
  @include size(40px);
  position: relative;
  margin-right: 10px;
  background: transparent;
  border: 2px solid black;
  border-radius: 100%;

  @include max-width(laptop) {
    @include size(30px);
  }
}

input {
  @include position(absolute, 0 0 0 0);
  @include size(100%);
  opacity: 0;
  z-index: 2;
}

svg {
  @include position(absolute, 20% 0 0 20%);
  @include size(60%);
  transition: opacity .3s ease-in-out;
  opacity: 0;
  z-index: 1;

  * { fill: $black; }
}

input:checked + svg { opacity: 1; }
</style>
