<template lang="pug">
.uniform
  .flex
    button(@click.prevent="$emit('delete', uniform.name)"): icon(icon="trash")
    input(type="text" :value="uniform.name" @keypress="onNameChange" :class="{ hidden: showValue }").name
    .value(:class="{ visible: showValue }") {{ uniform.value}}
  .flex
    input(type="text" :value="uniform.min" @input="onMinChange")
    input(type="range" :min="uniform.min" :max="uniform.max" :step="uniform.step" :value="uniform.value" @input="onInput")
    input(type="text" :value="uniform.max" @input="onMaxChange")
    span @
    input(type="text" :value="uniform.step" @input="onStepChange")
</template>

<script>
export default {
  props: {
    uniform: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showValue: false,
      timeout: null
    }
  },
  methods: {
    onMinChange ({ target }) {
      this.$emit('update', {
        uniform: {
          ...this.uniform,
          min: target.value
        }
      })
    },
    onInput ({ target }) {
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
    },
    onMaxChange ({ target }) {
      this.$emit('update', {
        uniform: {
          ...this.uniform,
          max: target.value
        }
      })
    },
    onStepChange ({ target }) {
      this.$emit('update', {
        uniform: {
          ...this.uniform,
          step: target.value
        }
      })
    },
    onNameChange ({ target, keyCode }) {
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
  @include flex;
  font-family: monospace;
  text-align: left;
}

.flex:first-of-type {
  @include flex(flex-start, center);
  position: relative;
  height: 20px;
  width: $input-height * 4 + 20px;
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
}

input[type="text"] {
  @include size($input-height * 2, 20px);
  text-align: center;
  line-height: $input-height;
  border: 0;
  font-size: 12px;
  -webkit-appearance: none;
  appearance: none;

  &.name {
    width: $input-height * 4;
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
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  @include size($input-height/1.5);
  background: $blue;
  border-radius: 100px;
}

input[type=range]:focus {
  outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
}
</style>