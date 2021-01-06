<template lang="pug">
.code: codemirror(
  ref="editor"
  :value="value"
  :options="options"
  @input="onInput"
)
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/theme/shadowfox.css'

const KEYWORDS = [
  'attribute',
  'const',
  'uniform',
  'varying',
  'layout',
  'centroid',
  'flat',
  'smooth',
  'noperspective',
  'break',
  'continue',
  'do',
  'for',
  'while',
  'switch',
  'case',
  'default',
  'if',
  'else',
  'in',
  'out',
  'inout',
  'float',
  'int',
  'void',
  'bool',
  'true',
  'false',
  'invariant',
  'discard',
  'return',
  'mat2',
  'mat3',
  'mat4',
  'mat2x2',
  'mat2x3',
  'mat2x4',
  'mat3x2',
  'mat3x3',
  'mat3x4',
  'mat4x2',
  'mat4x3',
  'mat4x4',
  'vec2',
  'vec3',
  'vec4',
  'ivec2',
  'ivec3',
  'ivec4',
  'bvec2',
  'bvec3',
  'bvec4',
  'uint',
  'uvec2',
  'uvec3',
  'uvec4',
  'lowp',
  'mediump',
  'highp',
  'precision',
  'sampler1D',
  'sampler2D',
  'sampler3D',
  'samplerCube',
  'sampler1DShadow',
  'sampler2DShadow',
  'samplerCubeShadow',
  'sampler1DArray',
  'sampler2DArray',
  'sampler1DArrayShadow',
  'sampler2DArrayShadow',
  'isampler1D',
  'isampler2D',
  'isampler3D',
  'isamplerCube',
  'isampler1DArray',
  'isampler2DArray',
  'usampler1D',
  'usampler2D',
  'usampler3D',
  'usamplerCube',
  'usampler1DArray',
  'usampler2DArray',
  'sampler2DRect',
  'sampler2DRectShadow',
  'isampler2DRect',
  'usampler2DRect',
  'samplerBuffer',
  'isamplerBuffer',
  'usamplerBuffer',
  'struct',
  'gl_FragCoord',
  'gl_FragColor',
  'abs',
  'dot',
  'sin',
  'cos',
  'tan',
  'atan',
  'log',
  'pow',
  'sqrt',
  'mod',
  'length',
  'distance',
  'normalize',
]

export default {
  props: {
    value: String,
  },
  components: { codemirror },
  data: () => ({
    model: '',
    options: {
      tabSize: 2,
      theme: 'shadowfox',
      mode: {
        name: 'clike',
        keywords: KEYWORDS.reduce((acc, key) => {
          acc[key] = true
          return acc
        }, {})
      },
      lineNumbers: true,
      line: true
    }
  }),
  watch: {
    shader: {
      handler (val) {
        this.model = val
      },
      immediate: true
    }
  },
  methods: {
    onInput (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="scss">
.code {
  @include position(absolute, 0 null 0 0);
  @include size(100%);
  z-index: 10;
  background-color: transparent !important;

  .CodeMirror {
    height: 100% !important;
    width: 100% !important;
    /* background: linear-gradient(to right, rgba($black, .9), rgba(0, 0, 0, 0) ) !important; */
    background: transparent !important;
    padding: 0 !important;
  }

  .vue-codemirror {
    @include size(100%);
  }

  .CodeMirror-sizer {
    margin-bottom: 0 !important;
  }

  .cm-s-shadowfox .CodeMirror-gutters {
    background: black !important;
  }

  .CodeMirror-gutters {
    border: none !important;
  }

  span[role="presentation"] {
    background: rgba($black, .8);
  }
}
</style>