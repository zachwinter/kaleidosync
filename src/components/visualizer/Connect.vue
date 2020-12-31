<template lang="pug">
.background
  .dialog
    .text
      .user
        span Logged in as
        UserPill
      h1: span Connect to Kaleidosync
      p: span Open your Spotify app, then select the Kaleidosync player in your devices menu.
    img(src="@/assets/connect.jpg")
    //- p Don't see it? That's OK!
    //- p Play a song in Spotify and then click #[a(@click="$store.dispatch('spotify/legacyConnect')") here] to connect another way.
</template>

<script>
import UserPill from '@/components/common/UserPill' 

export default {
  components: { UserPill }
}
</script>

<style lang="scss" scoped>
.background {
  @include position(fixed, 0 0 0 0);
  @include flex;
  /* background: rgba(0, 0, 0, 1); */
  z-index: 100;
}

.dialog {
  @include flex(center, center, column);
  position: relative;
  z-index: 10;
  text-align: center;
  max-height: 100vh;
  overflow-y: auto;
  color: white;

  @include max-width(tablet) {
    padding: $outer-padding / 2;
  }
}

@keyframes fadeslide {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }

  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}

.text {
  @include flex(flex-start, flex-start, column);
  animation: fadeslide 1000ms $base-easing forwards;
  position: absolute;
  left: 0;
  text-align: left;
  background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  padding: $outer-padding;

  > * {
    @include cascade(5, 50ms);
    animation: fadeslide 1000ms $base-easing forwards;
    opacity: 0;
  }
}

.user {
  margin-bottom: $base-margin;
  width: auto;

  > span {
    @include share;
    display: block;
    padding: .5em;
  }
}

h1 {
  font-size: 3rem;
  font-weight: 700;
  color: $green;
}

p {
  margin-top: $base-margin / 3;
  font-weight: 700;
  max-width: 400px;
}

@keyframes fadeslide2 {
  0% {
    opacity: 0;
    transform: translateY(150px);
  }

  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}


img {
  @include size(907px, auto);
  margin: $base-margin 0;
  animation: fadeslide 1000ms $base-easing forwards;  
  position: relative;
  z-index: -1;
}

a {
  font-weight: 700;
  color: $red;
  cursor: pointer;
  transition: color 100ms linear;

  &:hover { color: darken($red, 10%); }
}
</style>