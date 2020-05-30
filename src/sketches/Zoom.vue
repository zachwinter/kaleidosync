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
#define PI 3.14159265358979323846264338327950
#define TWO_PI PI * 2.0

vec2 kaleidoscope(vec2 uv, vec2 offset, float splits) {
  float angle = atan(uv.y, uv.x);
  angle = ((angle / PI) + 1.0) * 0.5;
  angle = mod(angle, 1.0 / splits) * splits;
  angle = -abs(2.0 * angle - 1.0) + 1.0;
  angle = angle;
  float y = length(uv);
  angle = angle * (y/ySpread);
  return vec2(angle, y) - offset;
}

mat2 rotate2d(float _angle){
  return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
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
  vec2 uv = -1.0 + 2.0 * vUv;
  uv.x *= resolution.x / resolution.y;
  uv *=  zoom;//(zoom * cos(stream/5000.) + zoom);
  vec2 frac = abs(fract(uv) - .5) * 1.;
  float dist = distance(uv, vec2(0.));
  vec2 rotated = uv * rotate2d(dist * stream/40000.);
  vec2 rotated2 = uv * rotate2d(dist/2. + stream/200.);// * sin(uv.x) * cos(uv.y);
  uv = mix(rotated, rotated2, cos(stream/1000.));
  uv = kaleidoscope(uv, vec2(0), sides);
  uv /= atan(dot(uv, uv));
  vec4 result = vec4(0, 0, 0, 1);
  float t = 0.;
  float base = 1. * atan(length(uv));
  for (int p = 0; p < 3; p++) {
    float a = cos((t * base) + stream / 250.);
    float b = cos(lines * uv.x / .125 - stream / 200.);
    result[p] = 10.52 * a + 11.7 * b + base / 1000.;
    t += offset;(offset * cos(-stream/500.)) + offset;
  }
  float col = hue(result.xyxy, stream / 250.).g;
  result.xyz *= brightness * result.x;
  gl_FragColor = log(abs(result));
  gl_FragColor.r *= red;
  gl_FragColor.g *= green;
  gl_FragColor.b *= blue;
  gl_FragColor = hue(gl_FragColor, stream/5000.);
}
`

const queues = [{
  name: 'zoom-size',
  totalSamples: 300,
  smoothing: 30
}]

const uniforms = {
  "xBase": {
    "name": "xBase",
    "min": 0,
    "max": "10",
    "value": "6.417",
    "step": "0.001"
  },
  "xTick": {
    "name": "xTick",
    "min": 0,
    "max": "50",
    "value": "33.45",
    "step": 0.01
  },
  "zoom": {
    "name": "zoom",
    "min": ".01",
    "max": ".2",
    "step": "0.0001",
    "value": "0.045"
  },
  "brightness": {
    "name": "brightness",
    "min": "0.001",
    "max": "2",
    "step": "0.001",
    "value": "0.138"
  },
  "red": {
    "name": "red",
    "min": 0,
    "max": "1",
    "step": 0.01,
    "value": "0.47"
  },
  "green": {
    "name": "green",
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": "0.35"
  },
  "blue": {
    "name": "blue",
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": "0.13"
  },
  "sides": {
    "name": "sides",
    "min": "2",
    "max": "8",
    "step": "1",
    "value": "3"
  },
  "offset": {
    "name": "offset",
    "min": "1",
    "max": "150",
    "step": ".01",
    "value": "103.05"
  },
  "lines": {
    "name": "lines",
    "min": "0",
    "max": "15",
    "step": ".01",
    "value": "2.59"
  },
  "ySpread": {
    "name": "ySpread",
    "min": "20",
    "max": "800",
    "step": 0.01,
    "value": "369.33"
  }
}

const beatInterval = 'beat'

export default {
  name: 'zoom',
  mixins: [sketch],
  data: () => ({
    version: '1.0.0',
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