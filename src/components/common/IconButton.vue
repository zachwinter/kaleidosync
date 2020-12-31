<template lang="pug">
.icon-button(:class="{ disabled }")
  button(:class="{ border, text, [color]: color }" @click="onClick")
    icon(:set="set" :name="icon")
    span(v-if="text") {{ text }}
</template>

<script>
export default {
  props: {
    set: {
      type: String,
      default: 'fal'
    },

    icon: {
      type: String,
      required: true
    },

    border: {
      type: Boolean,
      default: false
    },

    text: {
      type: String,
      default: null
    },

    color: {
      type: String,
      default: 'white'
    },

    disabled: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    onClick () {
      if (!this.disabled) this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-button {
  @include flex;
  transition: opacity $base-transition;

  &.disabled {
    opacity: .4;

    &:hover button {
      transform: none;
      cursor: default;
    }
  }
}

button {
  @include size(40px);
  @include strip;
  font-size: 26px;
  transition: all 100ms ease-out;
  opacity: 1;
  border: 2px solid transparent;

  span { display: block; }

  &:hover, &.active {
    border-color: $white;
    opacity: 1;
    cursor: pointer;
  }
  border: 0 !important;
  outline: 0 !important;

  &:hover { transform: scale(1.1); }

  svg + span { font-size: 12px; }

  /* @include max-width(mobile) {
    @include size(30px);
    font-size: 20px;
  } */

  &.text {
    @include size(auto, 40px);
    @include flex;
    @include share;
    font-size: 18px;

    svg { margin-right: 10px; }
  }
}

.white {
  color: $white;

  * { color: inherit; }
}
</style>