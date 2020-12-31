<template lang="pug">
FontAwesomeIcon(:icon="[set, name]").icon
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome/src/components/FontAwesomeIcon'

export default {
  props: {
    set: {
      type: String,
      default: 'fal'
    },
    name: {
      type: String
    }
  },
  components: { FontAwesomeIcon }
}
</script>