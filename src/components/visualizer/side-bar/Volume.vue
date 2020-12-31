<template lang="pug">
.volume
  h3 Volume Smoothing
  RangeInput(v-model="volumeSmoothing" :min="1" :max="50" :step="1")
    //- TextInput(label="Smoothing" v-model="volumeSmoothing")
    //- TextInput(label="Reference" v-model="volumeReference")
    //- TextInput(label="Ref. Multiplier" v-model="volumeReferenceMultiplier")
</template>

<script>
import { dualBind } from '@zach.winter/vue-common/util/store'
import form from '@zach.winter/vue-common/mixins/form'

export default {
  mixins: [form],
  computed: dualBind([
    'player/volumeSmoothing',
    'player/volumeReference',
    'player/volumeReferenceMultiplier'
  ])
}
</script>

<style lang="scss">
.volume {
  margin-bottom: 1rem; 
  
  .row { @include flex(flex-start, flex-start, row); }

  input[type="text"] {
    color: $white;
    padding: 0;
  }
}
</style>