<template lang="pug">
label.root(:class="{ disabled }")
  span {{ label }}
  .checkbox-container(:class="{ [variant]: variant, [size]: size }")
    input(type="checkbox" :checked="value" ref="input" @change="updateValue" :disabled="disabled")
    Check
</template>

<script>
import Check from '@/assets/svg/check.svg'

export default {
  props: ['value', 'label', 'variant', 'size', 'disabled'],
  components: { Check },
  methods: {
    updateValue () {
      this.$emit('input', this.$refs.input.checked)
    }
  }
}
</script>

<style lang="scss" scoped>
.root {
  @include flex(center, space-between);
  transition: opacity .3s ease-in-out;
  padding: 2px 0;
}

.disabled {
  opacity: .5;
}

.checkbox-container {
  @include size(20px);
  position: relative;
  // margin-right: 10px;
  background: transparent;
  border: 2px solid white;
  border-radius: 100%;
  margin-right: 10px;
}

label {
  font-family: Share, sans-serif;
  text-transform: uppercase;
  margin-bottom: 10px;
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

  * { fill: white; }
}

input:checked + svg { opacity: 1; }
</style>
