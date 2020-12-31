<template lang="pug">
tr.number(:class="{ disabled }" v-if="model")
  td.close(v-if="devMode"): Icon(name="times" @click.native="$emit('delete')")
  td.name: label {{ model.name }}
  td.num(v-if="devMode"): TextInput(v-model="model.min" @input="update" :disabled="disabled")
  td: RangeInput(v-model="model.value" :step="parseFloat(model.step)" :min="parseFloat(model.min)" :max="parseFloat(model.max)" :disabled="disabled" @input="update")
  td.num(v-if="devMode"): TextInput(v-model="model.max" @input="update" :disabled="disabled")
  td.num(v-if="devMode"): TextInput(v-model="model.step" @input="update" :disabled="disabled")
</template>

<script>
import form from '@zach.winter/vue-common/mixins/form'
import { bind } from '@zach.winter/vue-common/util/store'
// import cloneDeep from 'lodash/cloneDeep'

export default {
  mixins: [form],
  props: {
    value: Object,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    model: null
  }),
  computed: bind(['ui/devMode']),
  watch: {
    value: {
      handler (val) {
        this.model = {
          ...val,
          min: parseFloat(val.min),
          max: parseFloat(val.max),
          value: parseFloat(val.value)
        }
      },
      immediate: true
    }
  },
  methods: {
    update () {
      this.$emit('input', {
        ...this.model,
        min: parseFloat(this.model.min),
        max: parseFloat(this.model.max),
        value: parseFloat(this.model.value)
      })
    }
  }
}
</script>

<style lang="scss">
.number {
  color: $white;

  input[type="text"] {
    @include size(60px, auto);
    color: $white;
    text-align: center;
  }

  .form-element { margin: 0; }
}
</style>