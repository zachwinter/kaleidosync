<template lang="pug">
transition(name="fade")
  .user-pill(v-if="user" :class="{ border, fixed }" :style="styles")
    img(v-if="image" :src="image")
    .img(v-else): icon(:icon="['fal', 'user']")
    p {{ name }}
    a(href="https://www.spotify.com/logout").logout Log Out
</template>

<script>
import { bind } from '@zach.winter/vue-common/util/store'

export default {
  props: {
    border: {
      type: Boolean,
      default: true
    },
    fixed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...bind(['spotify/user']),
    image () {
      // return null
      if (!this.user || !this.user.images[0]) return null
      return this.user.images[0].url
    },
    name () {
      if (!this.user) return null
      return this.user.display_name
    },
    styles () {
      if (this.fixed) return this.UIStyle
      return {}
    }
  }
}
</script>

<style lang="scss" scoped>
$pill-size: $form-control-height;
$border-size: 2px;
$color: $pink;
$transition: all 150ms linear;

.user-pill {
  @include flex(center, flex-start, row);
  @include size(auto, $pill-size);
  border: $border-size solid $color;
  border-color: transparent;
  padding: 2px;
  border-radius: $pill-size;
  transition: $transition;
  min-width: 100px;

  &.border { border-color: $color; }

  &.fixed {
    @include position(absolute, $outer-padding $outer-padding null null);
    z-index: 200;
    border: 0;

    @include max-width(tablet) {
      @include position(absolute, $outer-padding/2 $outer-padding/2 null null);
    }
  }

  &.fixed:hover {
    p { opacity: 0; }
    .logout {
      pointer-events: all;
      opacity: 1;
    }
  }
}

img, .img {
  @include size($pill-size * .8);
  @include flex(center, center, row);
  border-radius: 100%;
  background: $color;
  color: $white;
  margin-left: 2px;
}

p, a {
  padding: 0 15px 0 10px;
  /* font-family: 'Share', sans-serif; */
  /* text-transform: uppercase; */
  font-size: 16px;
  color: inherit;
  user-select: none;
  transition: all 150ms linear;
}

a {
  color: $red;
  text-decoration: none;
}

.logout {
  @include position(absolute, null 0 null ($pill-size * .8)+2px);
  text-align: center;
  opacity: 0;
  pointer-events: none;
}
</style>