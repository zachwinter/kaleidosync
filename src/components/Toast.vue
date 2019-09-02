<template lang="pug">
.toast
  h2 {{ message }}
</template>

<script>
import { mapState } from 'vuex'
import { SET_HOVER, SET_TOAST_VISIBLE } from '@/vuex/mutation-types'

export default { 
  data () {
    return {
      delay: 2000
    }
  },
  computed: {
    ...mapState({
      message: s => s.toast.message,
      autoHide: s => s.toast.autoHide
    })
  },
  mounted () {
    this.$store.commit(SET_HOVER, false)
    
    if (this.autoHide === true) {
      setTimeout(() => {
        this.$store.commit(SET_TOAST_VISIBLE, false)
      }, this.delay)
    }
  } 
}
</script>

<style lang="scss" scoped>
.toast {                               
  @include position(fixed, 0 0 0 0);
  @include flex;
  text-align: center;  
  z-index: 150;

  h2 {
    @include share;
    @include scale(font-size 60px 30px);
    color: white;
    background: black;
    padding: 5px 10px;
  }
}
</style>
