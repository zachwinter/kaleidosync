<template lang="pug">
.config
  h3 Configuration
  Toggle(v-if="showHiDPI" v-model="hidpi" label="HiDPI Rendering (Fast devices only!)")
  Toggle(v-model="autohideToolbar" label="Auto-hide Toolbar")
  Keys(v-if="!isMobile")
</template>

<script>
import form from '@zach.winter/vue-common/mixins/form'
import { mapState } from 'vuex'
import { dualBind } from '@zach.winter/vue-common'
import Keys from './Keys'

export default {
  mixins: [form],
  components: { Keys },
  data: () => ({
    showHiDPI: window.devicePixelRatio > 1
  }),
  computed: {
    ...mapState(['isMobile']),
    ...dualBind([
      'visualizer/hidpi',
      'ui/autohideToolbar'
    ])
  }
}
</script>

<style lang="scss">
.config {
  @include size(100%, auto);
  @include flex(flex-start, space-between, column);
  @include share;
  color: $white;
  
  .form-element {
    @include flex(center, space-between, row);
    width: 100% !important;
    /* margin: 0 1rem 0 0; */
  }

  .short {
    font-weight: normal;

    label {
      margin: 0 10px 0 0;
    }
  }

  .form-element {
    width: 200px;
    margin: .25rem 0;
    justify-content: space-between;
  }
}
</style>