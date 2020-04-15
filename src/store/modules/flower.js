export const SET_UNIFORMS = 'SET_UNIFORMS'
export const SET_SHADER = 'SET_SHADER'

export default {
  namespaced: true,
  state: {
    shader: `
vec2 p;
const vec3 W = vec3(0.21, 0.91, 0.57);
// Made by @BradyInstead 
// bradyinstead.tumblr.com

#define PI 3.14159265358979323846

vec2 rotate2D (vec2 _st, float _angle) {
  _st -= 0.5;
  _st =  mat2(cos(_angle),-sin(_angle), sin(_angle),cos(_angle)) * _st;
  _st += 0.5;
  return _st;
}

vec2 tile (vec2 _st, float _zoom){
  _st *= _zoom;
  return abs(fract(_st) - .5);
}

float box (vec2 _st, vec2 _size, float _smoothEdges) {
  _size = vec2(0.5)-_size*0.5;
  vec2 aa = vec2(_smoothEdges*0.5);
  vec2 uv = smoothstep(_size,_size+aa,_st);
  uv *= smoothstep(_size,_size+aa,vec2(1.0)-_st);
  return uv.x*uv.y;
}

void main() {
  // Get Time
  highp float time = stream/400.;
  
  // Sample UVs and Colors
  vec2 uv = gl_FragCoord.xy/resolution.xy;
  vec3 color = vec3(0.0);
  
  // Sample Texture
  vec4 texColor = sin(uv.xyxy / 10.);
  
  // Center
  float aspectRatio = resolution.x / resolution.y;
  uv.x *= aspectRatio;
  uv.x -= aspectRatio * 1.;
  uv.y -= 1.;
  uv *= .5;
  
  // Get Distance
  float dst = 1.-distance(uv,vec2(0));
  
  // Zoom
  uv.xy *= sin(time*2.5 + dst*10.)/2. + 1.55;
  
  // Zoom out center
  //uv.xy *= 1./smoothstep(0., .2, 1.-dst);
  
  // Fisheye
  float strength = 1000.;
  uv = mix(uv, uv*20., dst/strength);

  // Divide the space in 4
  uv = tile(uv,.1);
  
  // Use a matrix to rotate the space 45 degrees
  uv = rotate2D(uv,PI*0.25 + time*(2.5 + dst/.1));
  
  float darkness = sin(abs(distance(uv, vec2(.5)))*40.);

  // Draw a square
  vec3 col = vec3(sin(length(uv)*30. + time *7.5));
  color = col;
  // color = vec3(st,0.0);
  
  float dst2 = (1.-distance(uv,vec2(0)) + dst)/2.;
  
  // Color It In
  col = 0. + .4*sin(time*5.5 + vec3(0,2,4) + dst2*3.);
  color.rgb -= mix(col, col-.1,color.r) + darkness;
  
  // Combine with Texture
  color = mix(color, texColor.rgb, (color.r + color.g + color.b)/3.);
  
  //color = mix(color, -color*.1, fract(stream*10.));

  // Frag colors
  gl_FragColor = vec4(color,1.0);
}
    `,
    queues: [{
      name: 'flower-size',
      totalSamples: 300,
      smoothing: 5
    }, {
      name: 'flower-beat',
      totalSamples: 700,
      smoothing: 30
    }],
    uniforms: {
      xBase: {
        min: 0,
        max: 10,
        value: 1
      },
      xTick: {
        min: 0,
        max: 100,
        value: 10
      }
    },
    beatInterval: 'tatums'
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