<template lang="pug">
.beat-interval(:class="{ hidden: editingUniform}")
  RadioGroup(label="Beat Interval" :options="beatIntervalOptions" v-model="beatInterval" name="beat-interval").interval
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

<style lang="scss">
.beat-interval {
  @include flex(center, space-between, row);
  transition: opacity $base-transition;

  &.hidden { opacity: 0; }

  .interval {
    @include flex(center, space-between, row);
    @include size(100%, 30px);

    .outer label {
      margin: 0 0 0 1rem;
    }
  }
}
</style>