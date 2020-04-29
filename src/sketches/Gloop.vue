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
#define PI 3.14159265358979323846264338327950
#define TWO_PI PI * 2.0

float map(float v, float a, float b, float c, float d) {
  return c + ((v - a) / (b - a)) * (d - c);
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

float circle(vec2 p, vec2 center, float radius, float l) {
  float d = distance(p, center);
  return smoothstep(radius, l, d);
}

mat2 rotate(float a) {
  return mat2(cos(a), -sin(a), sin(a), cos(a));
}
mat2 scale(float a) {
  return mat2(a, 0, 1, a);
}

void main() {
  vec2 p = .6 * gl_FragCoord.xy / resolution.xy - .5;
  p.x *=1. * (resolution.x / resolution.y);
  p *= rotate(((p.y - stream / 150.)));
  p *= .2 * p.y * scale(.1);
  p *= .1;
  vec2 cen = vec2(.5);
  vec2 corn = vec2(0.0);
  float md = distance(corn, cen);
  float d = distance(p, cen);
  float a = map(d, 0.0, md, 0.0, TWO_PI * 15.);
  float col = circle(p - .5, cen - 0.5, 0.1, 0.8);
  float inner = map((cos(stream * p.x/100.) / 10.0 * sin(p.x)), -1.0, 1.0, 1.0, 1.0);
  float radius = length(p - .5) * .5 - inner;
  float angle = atan(p.y - .5, p.x - .5) / PI;
  float spin = map((p.y * p.x), -1., 1., 1., .2);
  float spiral = sin(a - spin - stream/100.);
  float arms = angle * TWO_PI * 3.0;
  col += sin(arms + spiral) - radius;
  col *= sin(arms - spiral) - radius;
  col *= sin(arms - spiral) + radius;
  col *= sin(arms + spiral + (stream / 1000.0)) + radius;
  vec3 mix1 = mix(
    vec3(1., 1., 0),
    vec3(0, 1., .0),
    sin(spiral + stream / 200.)
  );
  vec3 mix2 = mix(
    vec3(1., cos(p.y / 10.), 0.),
    vec3(p.x / 1., tan(p.x / 10. - stream / 5000.), cos(p.y / 100.)),
    cos(arms * spiral) * col
  );
  vec3 color = mix(mix1, mix2, col);
  gl_FragColor = log(abs(vec4((color*2.), 1)));
  gl_FragColor.rb += sin(stream / 500.);
  gl_FragColor.gb *= 1.5*hue(gl_FragColor, stream/500.).rg;
  gl_FragColor = hue(log(gl_FragColor), stream/100.);
}
`
const queues = [{
  name: 'gloop-size',
  totalSamples: 100,
  smoothing: 10
}, {
  name: 'gloop-beat',
  totalSamples: 600,
  smoothing: 60
}]

const uniforms = {
  "xBase": {
    "name": "xBase",
    "value": "0.95",
    "min": 0,
    "max": 5,
    "step": 0.01
  },
  "xTick": {
    "name": "xTick",
    "value": "4.9",
    "max": 15,
    "min": 0,
    "step": 0.01
  }
}

const beatInterval = 'beat'

export default {
  name: 'gloop',
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