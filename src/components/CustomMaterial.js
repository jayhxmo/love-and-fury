// import { ShaderMaterial, Color } from "three";
import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

const CustomMaterial = shaderMaterial(
  {
    effectFactor: 2,
    dispFactor: 0,
    tex: undefined,
    tex2: undefined,
    disp: undefined,
  },
  `varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }`,
  `varying vec2 vUv;
  uniform sampler2D tex;
  uniform sampler2D tex2;
  uniform sampler2D disp;
  uniform float _rot;
  uniform float dispFactor;
  uniform float effectFactor;
  void main() {
    vec2 uv = vUv;
    vec4 disp = texture2D(disp, uv);
    vec2 distortedPosition = vec2(uv.x, uv.y + dispFactor * (disp.r*effectFactor));
    vec2 distortedPosition2 = vec2(uv.x, uv.y - (1.0 - dispFactor) * (disp.r*effectFactor));
    vec4 _texture = texture2D(tex, distortedPosition);
    vec4 _texture2 = texture2D(tex2, distortedPosition2);
    vec4 finalTexture = mix(_texture, _texture2, dispFactor);
    gl_FragColor = finalTexture;
  }`
);

extend({ CustomMaterial });

// const uniform = {
//   texture: { value: null },
//   hasTexture: { value: 0 },
//   scale: { value: 0 },
//   shift: { value: 0 },
//   opacity: { value: 1 },
//   color: { value: new Color("white") },
// };
//
// const vertexShader = `
//     precision mediump float;
//   varying vec2 vUv;
//   uniform float uTime;
//
//   void main() {
//
//     vec3 pos = position;
//     vUv = uv;
//
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
//   }
// `;
//
// const fragmentShader = `
//     precision mediump float;
//   uniform vec3 uColor;
//   varying vec2 vUv;
//   uniform float uTime;
//   uniform sampler2D uTexture;
//
//   void main() {
//     vec4 t = texture2D(uTexture, vUv);
//
//     gl_FragColor = vec4(t);
//   }
// `;
//
// class CustomMaterial extends ShaderMaterial {
//   constructor() {
//     super({
//       vertexShader: vertexShader,
//       fragmentShader: fragmentShader,
//       uniforms: uniform,
//     });
//     // uniforms: {
//     //   texture: { value: null },
//     //   hasTexture: { value: 0 },
//     //   scale: { value: 0 },
//     //   shift: { value: 0 },
//     //   opacity: { value: 1 },
//     //   color: { value: new Color("white") }
//     // }
//     // super({
//     //   vertexShader: `uniform float scale;
//     //   uniform float shift;
//     //   varying vec2 vUv;
//     //   void main() {
//     //     vec3 pos = position;
//     //     pos.y = pos.y + ((sin(uv.x * 3.1415926535897932384626433832795) * shift * 5.0) * 0.125);
//     //     vUv = uv;
//     //     gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.);
//     //   }`,
//     //   fragmentShader: `uniform sampler2D textureX;
//     //   uniform float hasTexture;
//     //   uniform float shift;
//     //   uniform float scale;
//     //   uniform vec3 color;
//     //   uniform float opacity;
//     //   varying vec2 vUv;
//     //   void main() {
//     //     float angle = 1.55;
//     //     vec2 p = (vUv - vec2(0.5, 0.5)) * (1.0 - scale) + vec2(0.5, 0.5);
//     //     vec2 offset = shift / 4.0 * vec2(cos(angle), sin(angle));
//     //     vec4 cr = texture2D(textureX, p + offset);
//     //     vec4 cga = texture2D(textureX, p);
//     //     vec4 cb = texture2D(textureX, p - offset);
//     //     if (hasTexture == 1.0) gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);
//     //     else gl_FragColor = vec4(color, opacity);
//     //   }`,
//     //   uniforms: {
//     //     texture: { value: null },
//     //     hasTexture: { value: 0 },
//     //     scale: { value: 0 },
//     //     shift: { value: 0 },
//     //     opacity: { value: 1 },
//     //     color: { value: new Color("white") }
//     //   }
//     // })
//   }
//
//   set scale(value) {
//     this.uniforms.scale.value = value;
//   }
//
//   get scale() {
//     return this.uniforms.scale.value;
//   }
//
//   set shift(value) {
//     this.uniforms.shift.value = value;
//   }
//
//   get shift() {
//     return this.uniforms.shift.value;
//   }
//
//   set map(value) {
//     this.uniforms.hasTexture.value = !!value;
//     this.uniforms.texture.value = value;
//   }
//
//   get map() {
//     return this.uniforms.texture.value;
//   }
//
//   get color() {
//     return this.uniforms.color.value;
//   }
//
//   get opacity() {
//     return this.uniforms.opacity.value;
//   }
//
//   set opacity(value) {
//     if (this.uniforms) this.uniforms.opacity.value = value;
//   }
// }
//
// extend({ CustomMaterial });
