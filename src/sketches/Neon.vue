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
#define PI 3.14159265359

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

mat2 rotate2d(float _angle){
  return mat2(
    cos(_angle),
    -sin(_angle), 
    sin(_angle), 
    cos(_angle)
  );
}

void main () {
  vec2 p = -1.0 + 2.0 * vUv.xy;
  p.x *= resolution.x / resolution.y;
  p *= zoom;
  p += .5;
  gl_FragColor = vec4(0.);
  for (float i = 8.; i < 10.; i++) {
    p = abs(fract(p) - .5);
    p *= gloop*i;
    float dist = distance(p, vec2(sin(stream/100.)/10.)) +(stream/100.);
    p = rotate2d(abs(cos(dist)) - stream/100.) * p;
    gl_FragColor.r += sin(p.x * p.y);
    gl_FragColor.g += cos(p.y * i) + sin(p.y * i);
    gl_FragColor.b += sin(p.x * i) * sin(p.y / i);
  }

  gl_FragColor.r *= red;
  gl_FragColor.g *= green;
  gl_FragColor.b *= blue;
  gl_FragColor = brightness * (hue(1.-2.*log(abs(gl_FragColor)), stream/150.));
  gl_FragColor.r *= red;
  gl_FragColor.g *= green;
  gl_FragColor.b *= blue;
}
`

const queues = [{
  name: 'neon-a',
  totalSamples: 600,
  smoothing: 60
},{
  name: 'neon-b',
  totalSamples: 600,
  smoothing: 10
}]

const uniforms = {
  "xBase": {
    "name": "xBase",
    "min": 0,
    "max": "5",
    "value": "1.419",
    "step": "0.001"
  },
  "xTick": {
    "name": "xTick",
    "min": 0,
    "max": "26",
    "value": "6.4",
    "step": 0.01
  },
  "red": {
    "name": "red",
    "min": 0,
    "max": "1",
    "step": 0.01,
    "value": "0.76"
  },
  "green": {
    "name": "green",
    "min": 0,
    "max": "1",
    "step": 0.01,
    "value": "0.76"
  },
  "blue": {
    "name": "blue",
    "min": 0,
    "max": "1",
    "step": 0.01,
    "value": "0.57"
  },
  "brightness": {
    "name": "brightness",
    "min": ".1",
    "max": ".6",
    "step": 0.01,
    "value": "0.2"
  },
  "zoom": {
    "name": "zoom",
    "min": ".04",
    "max": ".16",
    "step": "0.0001",
    "value": "0.1056"
  },
  "gloop": {
    "name": "gloop",
    "min": ".2",
    "max": ".8",
    "step": 0.01,
    "value": "0.56"
  }
}

const beatInterval = null

export default {
  name: 'neon',
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