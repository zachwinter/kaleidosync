<template lang="pug">
.beta(:class="{ interior }")
  h3 Beta testers needed!
  p Try out #[a(href="https://kaleidosync-beta.herokuapp.com/") Kaleidosync V2] now!
  
</template>

<script>
export default {
  props: {
    interior: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.beta {
  @include flex;
  @include position(fixed, 0 0 null 0);
  background: $red;
  color: $white;
  text-align: center;
  padding: 10px $outer-padding;

  &.interior {
    @include position(absolute, 100% 0 null 0);
    padding: 3px $outer-padding;
  }
}


h3 {
  font-weight: 300;
  margin-right: 15px;
}

a {
  font-weight: bold;
  color: $white;
}
</style>