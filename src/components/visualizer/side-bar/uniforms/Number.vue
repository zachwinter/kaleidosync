<template lang="pug">
tr.number(:class="{ hidden, active: uniform === value.name, disabled }" v-if="model")
  td(v-if="devMode").del: IconButton(icon="times" size="small" @click.native="$emit('delete')")
  td.name: label {{ model.name }}
  td.num(v-if="devMode"): TextInput(v-model="model.min" @input="update" :disabled="disabled")
  td: RangeInput(v-model="model.value" :step="parseFloat(model.step)" :min="parseFloat(model.min)" :max="parseFloat(model.max)" :disabled="disabled" @input="update")
  td.num(v-if="devMode"): TextInput(v-model="model.max" @input="update" :disabled="disabled")
  td.num(v-if="devMode"): TextInput(v-model="model.step" @input="update" :disabled="disabled")
</template>

<script>
import form from '@zach.winter/vue-common/mixins/form'
import { bind } from '@zach.winter/vue-common/util/store'
import mixin from '@/mixins/uniform'
import IconButton from '@/components/common/IconButton'

export default {
  mixins: [form, mixin],
  props: {
    value: Object,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: { IconButton },
  data: () => ({
    model: null
  }),
  computed: {
    ...bind(['visualizer/devMode', 'ui/uniform', 'ui/editingUniform']),
    hidden () {
      return this.editingUniform && this.uniform !== this.value.name
    },
  },
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
  transition: all $base-transition;

  &.hidden { opacity: 0; }

  &.active {
    background: rgba($black, 1);
  }

  input[type="text"] {
    @include size(60px, auto);
    color: $white;
    text-align: center;
  }

  .form-element { margin: 0; }
}
</style>