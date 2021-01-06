<template lang="pug">
tr.color(:class="{ hidden }")
  td(v-if="devMode").del: IconButton(icon="times" size="small" @click.native="$emit('delete')")
  td.name: label {{ value.name }}
  td(:colspan="devMode ? 4 : 1" :style="{ background: rgbString }" class="color"): input(type="color" :value="hex" @input="onInput")
</template>

<script>
import { bind } from '@zach.winter/vue-common/util/store'
import { hexToRgb, rgbToHex } from '@zach.winter/common/js/colors'
import IconButton from '@/components/common/IconButton'

export default {
  props: {
    value: Object
  },
  components: { IconButton },
  computed: {
    ...bind(['visualizer/devMode', 'ui/uniform', 'ui/editingUniform']),
    rgbString () {
      const [r, g, b] = this.value.value
      return `rgb(${r * 255}, ${g * 255}, ${b * 255})`
    },
    hex () {
      const [r, g, b] = this.value.value
      return rgbToHex(r * 255, g * 255, b * 255)
    },
    hidden () {
      return this.editingUniform && this.value.name !== this.uniform
    }
  },
  methods: {
    onInput (e) {
      const { r, g, b } = hexToRgb(e.target.value)
      const value = [r, g, b].map(val => val / 255)
      this.$emit('input', { ...this.value, value })
    }
  }
}
</script>

<style lang="scss" scoped>
.color {
  height: $form-control-height;

  &.hidden { opacity: 0; }

  input[type="color"] {
    @include strip;
    width: 100%;
    height: $form-control-height;

    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    &::-webkit-color-swatch {
      border: none;
    }
  }

  td.color { padding: 0; }

  label {
    text-transform: none;
    font-family: 'Open Sans', sans-serif;
    text-transform: none;
  }

  .edit {
    text-align: center;
  }
}
</style>