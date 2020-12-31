<template lang="pug">
.beat-interval
  h3 Beat Interval
  RadioGroup(:options="beatIntervalOptions" v-model="beatInterval" name="beat-interval").interval
</template>

<script>
import form from '@zach.winter/vue-common/mixins/form'
import { dualBind } from '@zach.winter/vue-common/util/store'

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
  computed: dualBind('player/beatInterval')
}
</script>

<style lang="scss" scoped>
h3 {
  @include separator;
  margin-top: 0;
}
</style>