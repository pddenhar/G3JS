(function( renderLib, $, undefined ) { 
  var light = [1,1,1];
  
  renderLib.renderer = function(glWebContext) {
    this.gl = glWebContext;
    this.programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);
    gl.useProgram(this.programInfo.program);
    gl.enable(gl.DEPTH_TEST);
  }

  renderLib.renderer.prototype.renderFrame = function(viewTransform, models, delta) {
    var lightRotation = mat4.create();
    mat4.rotateY(lightRotation, lightRotation, document.getElementById('lightspeed').value * delta);
    vec3.transformMat4(light, light, lightRotation);

    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    this.uniforms = {
      resolution: [gl.canvas.width, gl.canvas.height],
      viewTransform: viewTransform,
      lightVector: light
    };

    for (var i = models.length - 1; i >= 0; i--) {
      models[i].draw(this);
    };
  }
  renderLib.renderer.prototype.renderMeshpart = function(meshpart, normalTransform, worldTransform) { 
    this.uniforms.normalTransform = normalTransform;
    this.uniforms.worldTransform = worldTransform;
    twgl.setBuffersAndAttributes(gl, this.programInfo, meshpart.bufferInfo);
    twgl.setUniforms(this.programInfo, this.uniforms);
    twgl.drawBufferInfo(gl, gl.TRIANGLES, meshpart.bufferInfo);
  }

}( window.renderLib = window.renderLib || {}, null ));