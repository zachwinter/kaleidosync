<template lang="pug">
.buttons
  Hamburger
  Instagram
  Refresh
  SettingsButton
  FullScreen
</template>

<script>
import Hamburger from '@/components/Hamburger'
import FullScreen from '@/components/FullScreen'
import Refresh from '@/components/Refresh'
import SettingsButton from '@/components/SettingsButton'
import Instagram from '@/components/Instagram'

export default { 
  components: {
    FullScreen, 
    Hamburger, 
    Refresh,
    Instagram,
    SettingsButton
  }
}
</script>