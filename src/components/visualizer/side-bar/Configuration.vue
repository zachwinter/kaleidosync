<template lang="pug">
.config
  h3 Config
  RadioGroup(label="Beat Interval" :options="beatIntervalOptions" v-model="beatInterval" name="beat-interval").interval
  Toggle(v-if="!isMobile" v-model="devMode" label="Dev Mode")
  Toggle(v-if="showHiDPI" v-model="hidpi" label="HiDPI Rendering (Fast devices only!)")
  Toggle(v-if="!devMode" v-model="autohideToolbar" label="Auto-hide Toolbar")
  p(v-if="devMode").soon #[strong Coming Soon :] Saving your own sketches!
</template>

<script>
import form from '@zach.winter/vue-common/mixins/form'
import { mapState } from 'vuex'
import { dualBind, bind } from '@zach.winter/vue-common'

export default {
  mixins: [form],
  data: () => ({
    showHiDPI: window.devicePixelRatio > 1,
    beatIntervalOptions: [{
      name: 'Beat',
      value: 'beats',
    }, {
      name: 'Half-Beat',
      value: 'tatums'
    }]
  }),
  computed: {
    ...mapState(['isMobile']),
    ...dualBind([
      'visualizer/hidpi',
      'ui/autohideToolbar',
      'player/beatInterval',
      'visualizer/devMode'
    ]),
    ...bind(['ui/editingUniform'])
  },
  watch: {
    devMode (val) {
      if (val) {
        this.$store.dispatch('visualizer/enableDevMode')
      } else {
        this.$store.dispatch('visualizer/disableDevMode')
      }
    }
  }
}
</script>

<style lang="scss">
.config {
  @include size(100%, auto);
  @include flex(flex-start, space-between, column);
  @include share;
  color: $white;

  h3 {
    margin-top: 0 !important;
  }
  
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

  .interval {
    @include flex(center, space-between, row);
    @include size(100%, 20px);

    .outer label {
      margin: 0 0 0 1rem;
    }
  }

  .soon {
    font-family: 'Quicksand', sans-serif;
    text-transform: none;
    /* margin-top: 1rem; */

    strong {
      font-family: 'Share', sans-serif;
    }
  }
}
</style>