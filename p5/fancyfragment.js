precision highp float;
uniform float time;
uniform vec2 resolution;
varying vec3 fPosition;
varying vec3 fNormal;
varying vec3 modelPos;

void main()
{
  vec3 red = vec3(1.0,0.0,0.0);
  vec3 blue = vec3(0.0,0.0,1.0);
  float rd = clamp(dot(fNormal, vec3(0,1,-1)),0.0,1.0) * sin(time*90.0);
  float bd = clamp(dot(fNormal, vec3(-1,1,.2)), 0.0, 1.0);// * sin(time*70.0);
  vec3 tex = vec3(sin((modelPos.z+modelPos.y)*16.),sin(modelPos.y*19.),1);
  gl_FragColor = vec4((tex*.8*(rd+bd))+.2*((red * rd) + (blue * bd)), 1.0);
 //gl_FragColor = vec4(tex, 1.0);
}
