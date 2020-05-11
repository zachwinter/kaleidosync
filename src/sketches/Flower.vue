<template lang="pug">
Scene(
  :shader="shader"
  :uniforms="uniforms"
  :queues="queues"
  :multiply="true"
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
vec4 hue(vec4 color, float shift) {
  const vec4 kRGBToYPrime = vec4(0.299, 0.587, 0.114, 0.0);
  const vec4 kRGBToI = vec4(0.596, -0.275, -0.321, 0.0);
  const vec4 kRGBToQ = vec4(0.212, -0.523, 0.311, 0.0);
  const vec4 kYIQToR = vec4(1.0, 0.956, 0.621, 0.0);
  const vec4 kYIQToG = vec4(1.0, -0.272, -0.647, 0.0);
  const vec4 kYIQToB = vec4(1.0, -1.107, 1.704, 0.0);
  float YPrime = dot(color, kRGBToYPrime);
  float I = dot(color, kRGBToI);
  float Q = dot(color, kRGBToQ);
  float hue = atan(Q, I);
  float chroma = sqrt(I * I + Q * Q);
  hue += shift;
  Q = chroma * sin(hue);
  I = chroma * cos(hue);
  vec4 yIQ = vec4(YPrime, I, Q, 0.0);
  color.r = dot(yIQ, kYIQToR);
  color.g = dot(yIQ, kYIQToG);
  color.b = dot(yIQ, kYIQToB);
  return color;
}

void main() {
  vec2 uv = -1.0 + 2.0 * vUv;
  uv.x *= resolution.x / resolution.y;
  uv *= zoom;
  uv = abs(fract(uv) - .5) * 2.1;
  uv = abs(fract(uv) - .5) * .1;
  uv = abs(fract(uv) - .5) * 1.;
  uv = abs(fract(uv) - .5) * 1.;
  uv *= 2. * atan(uv.x / 50. + stream / 100.) - .1;
  vec4 result = vec4(0, 0, 0, 1);
  float t = 1.8;
  float base = 1000. * length(uv);
  for (int p = 0; p < 3; p++) {
    float a = cos((t * base) - stream / 1000.);
    float b = cos(660. * uv.x / .25 - stream / 100.);
    result[p] = 2.52 * a + 1.7 * b + base / 1000.;
    t += 2.6;
  }
  float col = hue(result.xyxy, stream / 1000.).g;
  result.xyz *= brightness * col;
  result.xyz = (result.xyz);
  result.xy *= abs(tan(uv.x * 200.));
  gl_FragColor = log(abs(result));
  gl_FragColor.r *= red;
  gl_FragColor.g *= green;
  gl_FragColor.b *= blue;
}
`

const queues = [{
  name: 'flower-size',
  totalSamples: 600,
  smoothing: 60
}, {
  name: 'flower-beat',
  totalSamples: 300,
  smoothing: 15
}]

const uniforms = {
  "xBase": {
    "name": "xBase",
    "min": 0,
    "max": 12,
    "value": "10.02",
    "step": 0.01
  },
  "xTick": {
    "name": "xTick",
    "min": 0,
    "max": 75,
    "value": "65.77",
    "step": 0.01
  },
  "zoom": {
    "name": "zoom",
    "min": ".002",
    "max": ".01",
    "step": "0.0001",
    "value": "0.002"
  },
  "brightness": {
    "name": "brightness",
    "min": 0,
    "max": "50",
    "step": 0.01,
    "value": "26.95"
  },
  "red": {
    "name": "red",
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": "0.19"
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
  }
}

const beatInterval = null

export default {
  name: 'flower',
  mixins: [sketch],
  data: () => ({
    version: '3.0.0',
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