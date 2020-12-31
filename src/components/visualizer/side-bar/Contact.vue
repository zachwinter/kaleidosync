<template lang="pug">
.contact  
  header
    h3 Contact
    ul
      li: a(href="https://instagram.com/zachary.io" target="instagram"): IconButton(icon="instagram" set="fab") 
      li: a(href="https://t.me/yozic" target="telegram"): IconButton(icon="telegram" set="fab")
      li: a(href="mailto:contact@zachwinter.com" target="mail"): IconButton(icon="envelope")
      li: a(href="https://www.github.com/zachwinter/kaleidosync" target="github"): IconButton(icon="github" set="fab")
  p Did you find a bug? Do you have a feature request? Do you just want to say hello? Message me! 
</template>

<script>
import IconButton from '@/components/common/IconButton'

export default {
  components: { IconButton }  
}
</script>

<style lang="scss" scoped>
header {
  position: relative;
}

ul {
  @include flex(center, flex-start, row);
  @include position(absolute, 0 0 0 null);
  list-style: none;
}

p {
  text-transform: none;
  font-family: 'Open Sans', sans-serif;
}
</style>
