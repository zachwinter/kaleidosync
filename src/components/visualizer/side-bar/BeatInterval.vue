<template lang="pug">
.beat-interval(:class="{ hidden: editingUniform}")
  h3 Beat Interval
  RadioGroup(:options="beatIntervalOptions" v-model="beatInterval" name="beat-interval").interval
</template>

<script>
import form from '@zach.winter/vue-common/mixins/form'
import { dualBind, bind } from '@zach.winter/vue-common/util/store'

export default {
  mixins: [form],
  data: () => ({
    beatIntervalOptions: [{
      name: 'Beat',
      value: 'beats',
    }, {
      name: 'Half-Beat',
      value: 'tatums'
    }]
  }),
  computed: {
    ...dualBind('player/beatInterval'),
    ...bind(['ui/editingUniform'])
  }
}
</script>

<style lang="scss" scoped>
.beat-interval {
  transition: opacity $base-transition;

  &.hidden { opacity: 0; }
}

h3 {
  @include separator;
  margin-top: 0 !important;
}
</style>