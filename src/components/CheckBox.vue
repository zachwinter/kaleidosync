<template lang="pug">
label.root
  .checkbox-container(:class="{ [variant]: variant, [size]: size }")
    input(type="checkbox" :checked="value" ref="input" @change="updateValue")
    Check
  span {{ label }}
</template>

<script>
import Check from '@/assets/svg/check.svg'

export default {
  props: ['value', 'label', 'variant', 'size'],
  components: { Check },
  methods: {
    updateValue () {
      this.$emit('input', this.$refs.input.checked)
    }
  }
}
</script>

<style lang="scss" scoped>
.root { @include flex(center, flex-end); }

.checkbox-container {
  @include size(40px);
  position: relative;
  // margin-right: 10px;
  background: transparent;
  border: 2px solid black;
  border-radius: 100%;
  margin-right: 10px;

  @include max-width(laptop) {
    @include size(30px);
  }

  &.light {
    border: 2px solid white;
  }

  &.sm {
    @include size(20px);
  }
}

label label {
  margin: 0;
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

.light svg * { fill: white; }
</style>
