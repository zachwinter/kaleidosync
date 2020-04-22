export const SET_UNIFORMS = 'SET_UNIFORMS'
export const SET_SHADER = 'SET_SHADER'

/**
 * Shout out to @Klems for the shader from which I derived this sketch.
 * https://www.shadertoy.com/view/Xd2Bzw
 */

export default {
  namespaced: true,
  state: {
    shader: `
      vec2 p;
      void main() {                                                                                                                                                                                                                                                                                                                                                                        
        p = -1.0 + 2.0 * vUv.xy;
        p *= 100.;
        p.x *= resolution.x/resolution.y;
        gl_FragColor = vec4(1, 1, 1, 1);
        for (float i = 1. ; i < 3. ; i++) {
          p = abs(2.*fract(p-.5)-1.) * mat2(sin(.5*(stream/2000.)*i*i + cos(p.y - stream/2000.)*cos(p.y - stream/2000.)*vec4(2.842,1.185,10.*sin(stream/2000.),0.)));
          gl_FragColor *= log(abs(p.y)*10.48) * 2.53*(cos(vec4((17.261 * p.x),cos(p.x - stream/2000.),(35.241*p.x + stream/2000.),0.)*i*i)*.5+.5);
        }
        gl_FragColor.rg *= .3;
      }
    `,
    queues: [{
      name: 'fractal-size',
      totalSamples: 300,
      smoothing: 5
    }, {
      name: 'fractal-beat',
      totalSamples: 700,
      smoothing: 30
    }],
    uniforms: {
      xBase: {
        name: 'xBase',
        min: 0,
        max: 200,
        value: 55
      },
      xTick: {
        name: 'xTick',
        min: 0,
        max: 500,
        value: 220
      }
    },
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