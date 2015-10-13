precision highp float;
uniform float time;
uniform vec2 resolution;
varying vec3 fPosition;
varying vec3 fNormal;

void main()
{
  vec3 color = vec3(0.0,0.5,0.0);
  float diff = clamp(dot(fNormal, vec3(1,1,0.5)),0.0,1.0);;
  float backlight = clamp(dot(fNormal, vec3(-1,-1,-0.5)), 0.0, 1.0);;
  gl_FragColor = vec4(color * (diff*.8 + backlight*.2), 1.0);
}
