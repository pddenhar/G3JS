precision highp float;
attribute vec3 position;
attribute vec3 normal;
uniform float time;
uniform mat3 normalMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying vec3 fNormal;
varying vec3 fPosition;
varying vec3 modelPos;

mat4 rotationMatrix(vec3 axis, float angle);

void main()
{
  fNormal = normalize(normalMatrix * normal);
  
  mat4 rotation = rotationMatrix(vec3(0,0,1), 3.14/2.0 * sin(time*10.0)*length(position.xy));
  vec3 rotatedPos = position;
  modelPos = rotatedPos;
  vec4 pos = modelViewMatrix * rotation * vec4(rotatedPos, 1.0);
  fPosition = pos.xyz;
  gl_Position = projectionMatrix * pos;
}

//helpful rotation matrix function from Neil Mendoza http://www.neilmendoza.com/glsl-rotation-about-an-arbitrary-axis/
mat4 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}
