<template lang="pug">
Scene(
  :shader="shader"
  :uniforms="uniforms"
  :queues="queues"
  :multiply="false"
  @update="update"
  @reset="reset"
  @copyUniforms="copyUniforms"
  @copyShader="copyShader",
  :beatInterval="beatInterval"
)
</template>

<script>
import sketch from '@/mixins/sketch'

const shader = `
vec2 p;
void main() {
  p = -1.0 + 2.0 * vUv.xy;
  p *= zoom;
  p.x *= resolution.x / resolution.y;
  gl_FragColor = vec4(1, 1, 1, 1);
  for (float i = 1.; i < 3.; i++) {
    float a = cos(p.y - stream / 2000.);
    float k = 10. * sin(stream / 2000.);
    vec4 b = vec4(.842, .185, k, 0.);
    vec2 c = abs(2. * fract(p - .5) - 1.);
    float h = (stream / 2000.);
    p = c * mat2(sin(h * i * i + a * a * b));
    float d = log(abs(p.y*2.) * 10.48);
    float e = cos(p.x - stream / 32000.);
    float f = pattern * p.x + stream / 3000.;
    vec4 g = vec4((pattern * p.y), e, f, 0.);
    gl_FragColor *= d * brightness * (cos(g * i * i) * .5 + .5);
  }
  gl_FragColor.r *= red;
  gl_FragColor.g *= green;
  gl_FragColor.b *= blue;
}
`
const queues = [{
  name: 'fractal-size',
  totalSamples: 500,
  smoothing: 30
}, {
  name: 'fractal-beat',
  totalSamples: 500,
  smoothing: 60
}]

const uniforms = {
  "xBase": {
    "name": "xBase",
    "min": 0,
    "max": 20,
    "value": "8.07",
    "step": 0.01
  },
  "xTick": {
    "name": "xTick",
    "min": 0,
    "max": "200",
    "value": "61.47",
    "step": 0.01
  },
  "red": {
    "name": "red",
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": "0.45"
  },
  "green": {
    "name": "green",
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": "0.18"
  },
  "blue": {
    "name": "blue",
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": "1"
  },
  "brightness": {
    "name": "brightness",
    "min": "1",
    "max": "15",
    "step": 0.01,
    "value": "1.63"
  },
  "zoom": {
    "name": "zoom",
    "min": ".01",
    "max": ".6",
    "step": "0.0001",
    "value": "0.1394"
  },
  "pattern": {
    "name": "pattern",
    "min": "10",
    "max": "200",
    "step": 0.01,
    "value": "20.82"
  }
}

const beatInterval = 'beat'

export default {
  name: 'fractal',
  mixins: [sketch],
  data: () => ({
    version: '2.0.0',
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