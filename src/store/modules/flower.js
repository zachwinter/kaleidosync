export const SET_UNIFORMS = 'SET_UNIFORMS'
export const SET_SHADER = 'SET_SHADER'

export default {
  namespaced: true,
  state: {
    shader: `
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
      
      mat2 rotate(float angle) {
        float c = cos(angle);
        float s = sin(angle);
        return mat2(c, -s, s, c);
      }
      
      void main() {
        vec2 uv = -1.0 + 2.0 * vUv;
        uv.x *= resolution.x / resolution.y;
        uv *= .003;
        uv = abs(fract(uv) - .5) * 2.1;
        uv = abs(fract(uv) - .5) * .1;
        uv = abs(fract(uv) - .5) * 1.;
        uv = abs(fract(uv) - .5) * 1.;
        uv *= 2. * atan(uv.x / 50. + stream / 100.) - .1;
        vec4 result = vec4(0, 0, 0, 1);
        float offset = stream;
        float t = 1.8;
        float base = 1000. * length(uv);
        mat2 rot = rotate(5. * length(uv));
        for (int p = 0; p < 3; p++) {
          result[p] = 2.52 * cos((t * base) - stream / 1000.) + 1.7 * cos(660. * uv.x / .25 - stream / 100.) + base / 1000.;
          t += 2.6;
        }
        result.xyz *= 12.7 * hue(result.xyxy, stream / 1000.).g;
        result.xyz = (result.xyz);
        result.xy *= abs(tan(uv.x * 200.));
        gl_FragColor = log(abs(result));
        gl_FragColor.rg *= .2;
      }
    `,
    queues: [{
      name: 'flower-size',
      totalSamples: 1000,
      smoothing: 50
    }, {
      name: 'flower-beat',
      totalSamples: 500,
      smoothing: 30
    }],
    uniforms: {
      xBase: {
        name: 'xBase',
        min: 0,
        max: 10,
        value: 5.58
      },
      xTick: {
        name: 'xTick',
        min: 0,
        max: 50,
        value: 40
      }
    },
    beatInterval: 'auto'
  },

  mutations: {
    [SET_UNIFORMS] (state, val) {
      state.uniforms = val
    },
    [SET_SHADER] (state, val) {
      state.shader = val
    }
  }
}