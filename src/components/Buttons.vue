<template lang="pug">
.buttons
  Hamburger
  Instagram
  Refresh
  FullScreen
</template>

<script>
import Hamburger from '@/components/Hamburger'
import FullScreen from '@/components/FullScreen'
import Refresh from '@/components/Refresh'
import Instagram from '@/components/Instagram'

export default { 
  components: {
    FullScreen, 
    Hamburger, 
    Refresh,
    Instagram
  }
}
</script>