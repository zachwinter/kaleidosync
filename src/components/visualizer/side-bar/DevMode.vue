<template lang="pug">
.dev-mode 
  h3 Dev Mode
  toggle(v-model="devMode")
</template>

<script>
import form from '@zach.winter/vue-common/mixins/form'
import { dualBind } from '@zach.winter/vue-common/util/store'

export default {
  mixins: [form],
  computed: dualBind(['ui/devMode']),
  watch: {
    devMode: {
      handler (val) {
        this.$store.commit('ui/SET_SHOW_CONTROL_BAR', !val)
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.dev-mode { margin-bottom: 1rem; }
</style>