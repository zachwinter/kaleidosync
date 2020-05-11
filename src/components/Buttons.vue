<template lang="pug">
.buttons
  Instagram
  Refresh
  SettingsButton
  FullScreen
</template>

<script>
import FullScreen from '@/components/FullScreen'
import Refresh from '@/components/Refresh'
import SettingsButton from '@/components/SettingsButton'
import Instagram from '@/components/Instagram'

export default { 
  components: {
    FullScreen, 
    Refresh,
    Instagram,
    SettingsButton
  }
}
</script>

<style lang="scss" scoped>
.buttons {
  @include position(fixed, #{(1.5 * $outer-padding) + 80px} null null 30px);
  @include flex(flex-start, flex-start, column);
  z-index: 10000;

  @include max-width(header) {
    @include flex(flex-start, flex-start, row);
    left: 85px;
    top: 30px;
  }
}
</style>