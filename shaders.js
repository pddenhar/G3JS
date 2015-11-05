var skyfs = "precision mediump float;\n\
\n\
uniform vec2 resolution;\n\
uniform vec3 cameraPosition;\n\
\n\
void main() {\n\
  vec3 normalCam = normalize(cameraPosition);\n\
  vec2 uv = gl_FragCoord.xy / resolution;\n\
  float color = 0.0;\n\
  // lifted from glslsandbox.com\n\
  vec3 sky = vec3(.5,.7,.9);\n\
  vec3 sunset = vec3(.95,.85,.5);\n\
  color += cos((uv.y-.5 - normalCam.y*.3)*5.3) * sin(uv.x*3.14);\n\
\n\
  gl_FragColor = vec4( mix(sky,sunset,color), 1.0 );\n\
}";

var skyvs = "attribute vec4 position;\n\
\n\
void main() {\n\
  gl_Position = vec4(position.xy, .999999, 1);\n\
}";

var vs = "precision mediump float;\n\
attribute vec4 POSITION;\n\
attribute vec3 NORMAL;\n\
attribute vec2 TEXCOORD0;\n\
\n\
uniform mat4 viewProjection;\n\
\n\
uniform mat4 worldTransform;\n\
//model world normal transform\n\
uniform mat3 normalTransform;\n\
\n\
varying vec3 worldNormal;\n\
varying vec4 worldPosition;\n\
varying vec2 texCoord;\n\
\n\
void main() {\n\
  //vertex position in world coords\n\
  worldPosition = worldTransform * POSITION;\n\
\n\
  //in normalized device coords\n\
  vec4 pos = viewProjection * worldPosition;\n\
\n\
  worldNormal = normalTransform * NORMAL;\n\
  gl_Position = pos;\n\
\n\
  texCoord=TEXCOORD0;\n\
}";

var fs = "precision mediump float;\n\
uniform vec2 resolution;\n\
uniform vec3 lightVector;\n\
//actual position in world coordinates of the camera\n\
uniform vec3 cameraPosition;\n\
\n\
uniform vec3 mat_diffuse;\n\
uniform vec3 mat_specular;\n\
\n\
varying vec3 worldNormal;\n\
varying vec4 worldPosition;\n\
\n\
varying vec2 texCoord;\n\
uniform sampler2D diffuse;\n\
uniform bool useTexture;\n\
\n\
vec2 blinnPhongDir(vec3 lightDir, float Ka, float Kd, float Ks, float shininess)\n\
{\n\
  vec3 s = normalize(lightDir);\n\
  //vector from the camera to the point in the world\n\
  vec3 v = normalize(cameraPosition-worldPosition.xyz);\n\
  vec3 n = normalize(worldNormal);\n\
  vec3 h = normalize(v+s);\n\
  float diffuse = Ka + Kd * max(0.0, dot(n, s));\n\
  float spec =  Ks * pow(max(0.0, dot(n,h)), shininess);\n\
  return vec2(diffuse, spec);\n\
}\n\
\n\
void main() {\n\
\n\
  vec4 diffuseColor = vec4(1.,1.,1.,1.);\n\
  if(useTexture == true)\n\
  {\n\
    diffuseColor = texture2D(diffuse, texCoord);\n\
  }\n\
\n\
  vec2 phong = blinnPhongDir(lightVector, 1.0, 1.0, 0.5, 5.0)*.8;\n\
  phong += blinnPhongDir(-lightVector, 1.0, 1.0, 0.0, 5.0)*.8;\n\
  vec3 diffColor = diffuseColor.rgb * mat_diffuse * phong.x;\n\
  vec3 specColor = mat_specular * phong.y;\n\
  gl_FragColor = vec4(diffColor + specColor, 1.0);\n\
}";