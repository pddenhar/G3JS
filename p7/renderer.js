(function( renderLib, $, undefined ) { 
  var light = [-1,1,1];
  
  renderLib.renderer = function(glWebContext) {
    this.gl = glWebContext;
    this.programInfo = twgl.createProgramInfo(this.gl, ["vs", "fs"]);
    this.gl.useProgram(this.programInfo.program);
    this.gl.enable(this.gl.DEPTH_TEST);
  }

  renderLib.renderer.prototype.renderFrame = function(viewProjection, cameraPosition, models, delta) {
    var lightRotation = mat4.create();
    mat4.rotateY(lightRotation, lightRotation, document.getElementById('lightspeed').value * delta);
    vec3.transformMat4(light, light, lightRotation);

    twgl.resizeCanvasToDisplaySize(this.gl.canvas);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    this.uniforms = {
      resolution: [this.gl.canvas.width, this.gl.canvas.height],
      viewProjection: viewProjection,
      cameraPosition: cameraPosition,
      lightVector: light
    };

    for (var i = models.length - 1; i >= 0; i--) {
      models[i].draw(this);
    };
  }
  renderLib.renderer.prototype.renderMeshpart = function(meshpart, normalTransform, worldTransform) { 
    this.uniforms.normalTransform = normalTransform;
    this.uniforms.worldTransform = worldTransform;
    twgl.setBuffersAndAttributes(this.gl, this.programInfo, meshpart.bufferInfo);
    twgl.setUniforms(this.programInfo, this.uniforms);
    twgl.drawBufferInfo(this.gl, this.gl.TRIANGLES, meshpart.bufferInfo);
  }

}( window.renderLib = window.renderLib || {}, null ));