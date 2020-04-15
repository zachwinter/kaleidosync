<template lang="pug">
.toast
  h2 {{ message }} #[span(v-if="subText") {{ subText }}] 
</template>

<script>
import { mapState } from 'vuex'
import { SET_HOVER, SET_TOAST_VISIBLE } from '@/store/modules/ui'

export default { 
  data () {
    return {
      delay: 2000
    }
  },
  computed: {
    ...mapState({
      message: ({ ui }) => ui.toast.message,
      autoHide: ({ ui }) => ui.toast.autoHide,
      subText: ({ ui }) => ui.toast.subText
    })
    
  },
  mounted () {
    this.$store.commit(`ui/${SET_HOVER}`, false)
    
    if (this.autoHide === true) {
      setTimeout(() => {
        this.$store.commit(`ui/${SET_TOAST_VISIBLE}`, false)
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
    padding: 20px;
  }

  span {
    display: block;
    font-size: .5em;
    margin-top: 15px;
  }
}
</style>
