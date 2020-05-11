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
  :beatInterval="beatInterval"
)
</template>

<script>
import sketch from '@/mixins/sketch'

const shader = `
mat2 rotate(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

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
  vec2 uv = -1.0 + 2.0 * vUv.xy;
  uv *= zoom;
  uv.x *= resolution.x / resolution.y;
  vec4 result = vec4(0, 0, 0, 1);
  float t = sin(uv.x);
  float base = domain * length(uv);
  float d = 1.*cos(-stream/2. + 100. * length(uv));
  d *= d * d * d;
  mat2 rot = rotate(stream - length(uv)) + d;
  float dist = distance(uv, vec2(-domain));
  uv = abs(rot * uv) * dist;
  for (int p = 0; p < 3; p++) {
    float a = 1.*cos(uv.x - stream/5.)*sin(stream/10. + t * base);
    float b = atan(-stream/1.)*cos(scales* uv.x - stream);
    float c = 2.*tan(gloop * uv.y)*sin(uv.y - stream/5.);
    uv *= rotate(atan(uv.x+stream));
    result[p] = a * b / c * atan(dist);
    t += dist * offset;
  }
  result.xyz *= result.xyz;
  gl_FragColor = hue(log(abs(result)), stream/5.);
}
`
const queues = [{
  name: 'gloop-size',
  totalSamples: 300,
  smoothing: 15
}, {
  name: 'gloop-beat',
  totalSamples: 600,
  smoothing: 60
}]

const uniforms = {
  "xBase": {
    "name": "xBase",
    "value": "0.036",
    "min": 0,
    "max": ".1",
    "step": "0.001"
  },
  "xTick": {
    "name": "xTick",
    "value": "0.25",
    "max": ".8",
    "min": 0,
    "step": 0.01
  },
  "zoom": {
    "name": "zoom",
    "min": ".001",
    "max": ".07",
    "step": "0.0001",
    "value": "0.0278"
  },
  "domain": {
    "name": "domain",
    "min": 0,
    "max": "40",
    "step": 0.01,
    "value": "6.34"
  },
  "offset": {
    "name": "offset",
    "min": 0,
    "max": "10",
    "step": 0.01,
    "value": "1.16"
  },
  "scales": {
    "name": "scales",
    "min": 0,
    "max": "300",
    "step": 0.01,
    "value": "164.39"
  },
  "gloop": {
    "name": "gloop",
    "min": "1",
    "max": "10",
    "step": 0.01,
    "value": "5.43"
  }
}

const beatInterval = null

export default {
  name: 'gloop',
  mixins: [sketch],
  data: () => ({
    version: '5.0.0',
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