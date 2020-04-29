<template lang="pug">
Scene(
  :shader="shader"
  :uniforms="uniforms"
  :queues="queues"
  :multiply="true"
  @update="update"
  @reset="reset"
  @copyUniforms="copyUniforms"
  @copyShader="copyShader"
)
</template>

<script>
import sketch from '@/mixins/sketch'

const shader = `
vec2 p;
void main() {
  p = -1.0 + 2.0 * vUv.xy;
  p.x *= resolution.x / resolution.y;
  p *= scale;
}
`
const queues = [{
  name: 'name-size',
  totalSamples: 500,
  smoothing: 30
}, {
  name: 'name-beat',
  totalSamples: 500,
  smoothing: 60
}]

const uniforms = {
  xBase: {
    name: 'xBase',
    min: 0,
    max: 20,
    value: 17.5,
    step: .01
  },
  xTick: {
    name: 'xTick',
    min: 0,
    max: 75,
    value: 52,
    step: .01
  },
  scale: {
    name: 'scale',
    min: .001,
    max: 10,
    step: .001,
    value: 1
  }
}

const beatInterval = null

export default {
  name: 'name',
  mixins: [sketch],
  data: () => ({
    shader,
    queues,
    uniforms,
    beatInterval
  }),
  methods: {
    reset () {
      this.onReset({ shader, queues, uniforms, beatInterval })
    }
  }
}
</script>