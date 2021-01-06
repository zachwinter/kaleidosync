<template lang="pug">
tr.uniform(:class="{ disabled, hidden: editingUniform }" v-if="model")
  td(v-if="devMode").del: IconButton(icon="times" size="small" @click.native="$emit('delete')")
  td.name: label {{ model.name }}
  td(:colspan="devMode ? 5 : 1"): Toggle(v-model="model.value" @input="update" :disabled="disabled")
</template>

<script>
import { bind } from '@zach.winter/vue-common/util/store'
import form from '@zach.winter/vue-common/mixins/form'
import cloneDeep from 'lodash/cloneDeep'
import IconButton from '@/components/common/IconButton'

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
  components: { IconButton },
  computed: bind(['visualizer/devMode', 'ui/editingUniform']),
  watch: {
    value: {
      handler (val) {
        this.model = cloneDeep(val)
      },
      immediate: true
    }
  },
  methods: {
    update () {
      this.$emit('input', this.model)
    }
  }
}
</script>

<style lang="scss">
.uniform {
  color: $white;
  transition: opacity $base-transition;
  
  &.hidden { opacity: 0; }

  input[type="text"] {
    @include size(60px, auto);
    color: $white;
    text-align: center;
  }

  .form-element { margin: 0; }
}
</style>