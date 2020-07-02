<template lang="pug">
Scene(
  :shader="shader"
  :uniforms="uniforms"
  :booleans="booleans"
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
#define PI 3.14159265359

vec2 kale(vec2 uv, vec2 offset, float splits) {
  float angle = atan(uv.y, uv.x);
  angle = ((angle / PI) + 1.0) * 0.5;
  angle = mod(angle, 1.0 / splits) * splits;
  angle = -abs(2.0 * angle - 1.0) + 1.0;
  float y = length(uv);
  angle = angle * (y);
  return vec2(angle, y) - offset;
}

mat2 rotate2d(float _angle){
  return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
}

void main() {
  vec2 uv = -1.0 + 2.0 * vUv.xy;
  uv.x *= resolution.x / resolution.y;
  uv *= zoom;
  gl_FragColor = vec4(0.);
  float dist = distance(uv, vec2(0.));
  if (kaleidoscope) {
    if (warp) {
      vec2 kale1 = kale(uv, vec2(2.), sides);
      vec2 kale2 = kale(uv, vec2(0.), 2.);
      uv *= mix(kale1, kale2, abs(sin(stream/9.)));
      //uv *= kale(uv, vec2(0.), sides);
    } else {
      uv = kale(uv, vec2(0.), sides);
    }
  }
  for (float i = 0.; i < 5.0; i++) {
    float t = stream/2. - i * PI / 5.0 * cos(stream / i);
    vec2 path = vec2(cos(t), sin(t)) / cos(i / 5.0 * PI / dist + stream);
    vec3 col = cos(vec3(0, 1, -1) * PI * 2. / 3. + PI * (stream / 2. + i / 5.)) * (glow) + (glow);
    gl_FragColor += vec4(vec3(dist * .1 / length(uv - path * 0.2519) * col), 1.0);
  }
  gl_FragColor.xyz = pow(gl_FragColor.xyz, vec3(3.));
}
`

const queues = [{
  name: 'orb-a',
  totalSamples: 600,
  smoothing: 30
}, {
  name: 'orb-b',
  totalSamples: 600,
  smoothing: 60
}]

const uniforms = {
  "xBase": {
    "name": "xBase",
    "min": "0",
    "max": ".1",
    "step": "0.001",
    "value": "0.038"
  },
  "xTick": {
    "name": "xTick",
    "min": "0",
    "max": ".8",
    "step": "0.01",
    "value": "0.26"
  },
  "glow": {
    "name": "glow",
    "min": ".5",
    "max": "2",
    "step": ".001",
    "value": ".75"
  },
  "zoom": {
    "name": "zoom",
    "min": ".2",
    "max": "5",
    "step": "0.01",
    "value": "2.12"
  },
  "sides": {
    "boolean": "kaleidoscope",
    "name": "sides",
    "min": "2",
    "max": "48",
    "step": "1",
    "value": "6"
  }
}

const booleans = {
  "kaleidoscope": {
    "name": "kaleidoscope",
    "default": false,
    "value": false
  },
  "warp": {
    "boolean": "kaleidoscope",
    "name": "warp",
    "default": false,
    "value": false
  } 
}

const beatInterval = null

export default {
  name: 'orbs',
  mixins: [sketch],
  data: () => ({
    version: '2.0.0',
    shader,
    queues,
    uniforms,
    booleans,
    beatInterval
  }),
  methods: {
    reset () {
      this.onReset({ shader, queues, uniforms, booleans, beatInterval })
    }
  }
}
</script>