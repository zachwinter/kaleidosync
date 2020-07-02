<template lang="pug">
.uniform(v-if="!production")
  .flex
    button(@click.prevent="$emit('delete', uniform.name)"): icon(icon="trash")
    input(type="text" :value="uniform.name" @keypress="onNameChange" :class="{ hidden: showValue }").name
    .value(:class="{ visible: showValue }") {{ uniform.value}}
  .flex
    input(type="text" ref="min" :value="uniform.min" @input="onMinChange")
    input(type="range" :min="uniform.min" :max="uniform.max" :step="uniform.step" :value="uniform.value" @input="onInput")
    input(type="text" ref="max" :value="uniform.max" @input="onMaxChange")
    span(v-if="!production") @
    input(type="text" ref="step" :value="uniform.step" @input="onStepChange")
.uniform(v-else :class="{ disabled }")
  label {{ uniform.name }}
  input(type="range" :min="uniform.min" :max="uniform.max" :step="uniform.step" :value="uniform.value" @input="onInput")
</template>

<script>
export default {
  props: {
    uniform: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showValue: false,
      timeout: null,
      production: PRODUCTION // eslint-disable-line
    }
  },
  methods: {
    async onMinChange ({ target }) {
      this.$store.dispatch('ui/hover')
      this.$emit('update', {
        uniform: {
          ...this.uniform,
          min: target.value
        }
      })
      await this.$nextTick()
      target.focus()
    },
    async onInput ({ target }) {
      this.$store.dispatch('ui/hover')
      clearTimeout(this.timeout)
      this.showValue = true
      this.$emit('update', {
        uniform: {
          ...this.uniform,
          value: target.value
        }
      })
      this.timeout = setTimeout(() => {
        this.showValue = false
      }, 500)
      await this.$nextTick()
      target.focus()
    },
    async onMaxChange ({ target }) {
      this.$store.dispatch('ui/hover')
      this.$emit('update', {
        uniform: {
          ...this.uniform,
          max: target.value
        }
      })
      await this.$nextTick()
      target.focus()
    },
    async onStepChange ({ target }) {
      this.$store.dispatch('ui/hover')
      this.$emit('update', {
        uniform: {
          ...this.uniform,
          step: target.value
        }
      })
      await this.$nextTick()
      target.focus()
    },
    async onNameChange ({ target, keyCode }) {
      this.$store.dispatch('ui/hover')
      if (keyCode === 13) {
        this.$emit('update', {
          uniform: {
            ...this.uniform,
            name: target.value
          },
          rename: true,
          from: this.uniform.name
        })
      }
      await this.$nextTick()
      target.focus()
    }
  }
}
</script>

<style scoped lang="scss">
$input-height: 14px;

.flex { @include flex; }

button {
  @include size(20px);
  background: transparent;
  border: 0;
  color: $white;
  padding: 0;
  position: relative;
  z-index: 5;
}

.uniform {
  @include flex(center, space-evenly);
  font-family: monospace;
  text-align: left;
  width: 100%;
  padding: 4px 0;
  transition: opacity .3s ease-in-out;

  &.disabled { opacity: .5; }
}

.flex:first-of-type {
  @include flex(flex-start, center);
  position: relative;
  height: 20px;
  width: $input-height * 8 + 20px;
  font-family: monospace;

  button {
    @include position(absolute, 0 null 0 0);
  }
}

.name, .value {
  @include position(absolute, 0 0 0 20px);
  @include size(100%);
  font-size: 14px;
  line-height: 20px;
  transition: opacity 300ms ease-in-out;
  height: 20px !important;
  padding: 0 10px;
  text-align: center;
  margin: 0;
  &.visible { opacity: 1; }
  &.hidden { opacity: 0; }
}

.value {
  opacity: 0;
}

.name {
  z-index: 10;
}
  
input {
  outline: 0;
  background: transparent;
  color: white;
  margin: 0 10px;
}

input[type="text"] {
  @include size($input-height * 2, 20px);
  text-align: center;
  line-height: $input-height;
  border: 0;
  font-size: 12px;
  -webkit-appearance: none;
  appearance: none;

  &.name, &.value {
    width: $input-height * 8;
    // text-align: right;
  }
}

span {
  font-size: 12px;
}

input[type=range] {
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: $white;
  border-radius: 10px; /* Otherwise white in Chrome */
  height: 10px;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  @include size($input-height * 2);
  border: 4px solid $black;
  background: $blue;
  border-radius: 100px;
}

input[type=range]:focus {
  outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
}

.production {
  .flex {
    width: auto;
  }
  .name {
    position: static;
    width: auto !important;
    // text-align: right;
  }
}

label {
  font-family: Share, sans-serif;
  text-transform: uppercase;
  padding: 0 30px 0 0;
}
</style>