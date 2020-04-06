<template lang="pug">
.buttons
  Hamburger
  FullScreen
  Instagram
</template>

<script>
import Hamburger from '@/components/Hamburger'
import FullScreen from '@/components/FullScreen'
import Instagram from '@/components/Instagram'

export default { 
  components: { FullScreen, Hamburger, Instagram }
}
</script>