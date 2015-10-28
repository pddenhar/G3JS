(function( renderLib, $, undefined ) { 
  var light = [-5,1,1];
  
  renderLib.renderer = function(glWebContext) {
    this.gl = glWebContext;
    this.programInfo = twgl.createProgramInfo(this.gl, ["vs", "fs"], ["POSITION", "NORMAL", "TEXCOORD0"]);
    this.skyProgramInfo = twgl.createProgramInfo(this.gl, ["skyvs", "skyfs"]);
    this.gl.enable(this.gl.DEPTH_TEST);

    var skyArray = {
      position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
    };
    this.skyBufferInfo = twgl.createBufferInfoFromArrays(gl, skyArray);
  }

  renderLib.renderer.prototype.renderFrame = function(viewProjection, cameraPosition, models, delta) {
    drawSky.call(this, cameraPosition);
    //draw the rest of scene
    this.gl.useProgram(this.programInfo.program);
    var lightRotation = mat4.create();
    mat4.rotateZ(lightRotation, lightRotation, document.getElementById('lightangle').value * -1.0);
    var framelight = vec3.create();
    vec3.transformMat4(framelight, light, lightRotation);

    twgl.resizeCanvasToDisplaySize(this.gl.canvas);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    this.uniforms = {
      resolution: [this.gl.canvas.width, this.gl.canvas.height],
      viewProjection: viewProjection,
      cameraPosition: cameraPosition,
      lightVector: framelight
    };

    for(key in models){
      models[key].draw(this);
    };
  }
  renderLib.renderer.prototype.renderMeshpart = function(meshpart, normalTransform, worldTransform) { 
    this.uniforms.normalTransform = normalTransform;
    this.uniforms.worldTransform = worldTransform;
    this.uniforms.mat_diffuse = meshpart.material.diffuse;
    this.uniforms.mat_specular = meshpart.material.specular;
    if("textures" in meshpart.material && meshpart.material.textures.length > 0) {
      //just use the first texture as the diffuse texture
      this.uniforms.diffuse = meshpart.material.textures[0].glTexture;
    }
    twgl.setBuffersAndAttributes(this.gl, this.programInfo, meshpart.bufferInfo);
    twgl.setUniforms(this.programInfo, this.uniforms);
    twgl.drawBufferInfo(this.gl, this.gl.TRIANGLES, meshpart.bufferInfo);
  }
  function drawSky(cameraPosition) {
    //draw sky
    this.gl.useProgram(this.skyProgramInfo.program);
    var skyuniforms = {
        resolution: [gl.canvas.width, gl.canvas.height],
        cameraPosition: cameraPosition,
    };
    twgl.setBuffersAndAttributes(gl, this.skyProgramInfo, this.skyBufferInfo);
    twgl.setUniforms(this.skyProgramInfo, skyuniforms);
    twgl.drawBufferInfo(gl, gl.TRIANGLES, this.skyBufferInfo);
  }

}( window.renderLib = window.renderLib || {}, null ));