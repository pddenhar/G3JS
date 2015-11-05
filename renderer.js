(function( renderLib, $, undefined ) { 
  var light = [-40,30,-40];
  var currentProgram = null;

  renderLib.renderer = function(glWebContext) {
    this.gl = glWebContext;
    this.programInfo = twgl.createProgramInfo(this.gl, [vs, fs]);
    createAttribUnsetter(this.gl, this.programInfo);

    this.skyProgramInfo = twgl.createProgramInfo(this.gl, [skyvs, skyfs]);

    this.shadowProgramInfo = twgl.createProgramInfo(this.gl, [vs, fs]);
    createAttribUnsetter(this.gl, this.shadowProgramInfo);
    this.shadowBuffer = twgl.createFramebufferInfo(gl, null, 1024, 1024);

    this.gl.enable(this.gl.DEPTH_TEST);

    var skyArray = {
      position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
    };
    this.skyBufferInfo = twgl.createBufferInfoFromArrays(gl, skyArray);
  }

  renderLib.renderer.prototype.renderFrame = function(viewProjection, cameraPosition, models, delta) {
    drawSky.call(this, cameraPosition);

    //draw the rest of scene
    var lightRotation = mat4.create();
    mat4.rotateZ(lightRotation, lightRotation, document.getElementById('lightangle').value * -1.0);
    var framelight = vec3.create();
    vec3.transformMat4(framelight, light, lightRotation);

    twgl.resizeCanvasToDisplaySize(this.gl.canvas);

    this.uniforms = {
      resolution: [this.gl.canvas.width, this.gl.canvas.height],
      lightVector: framelight,
      cameraPosition: cameraPosition
    };
    this.uniforms.viewProjection = viewProjection;
    renderShadowMap.call(this, framelight);

    //set the view projection to the real thing (not a shadow projection)
    this.uniforms.viewProjection = viewProjection;
    //draw the real scene with the full shader
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.gl.useProgram(this.programInfo.program);
    currentProgram = this.programInfo;
    for(key in models){
      models[key].draw(this);
    };
  }
  function renderShadowMap(frameLight) {
    var cameraMatrix = mat4.create();
    mat4.lookAt(cameraMatrix, frameLight, [0,0,0], [0,1,0]);

    var projection = mat4.create();
    mat4.ortho(projection, -100,100,-100,100,1,200);

    var viewProjection = mat4.create();
    mat4.multiply(viewProjection, cameraMatrix, viewProjection);
    mat4.multiply(viewProjection, projection, viewProjection);
    
    this.uniforms.viewProjection = viewProjection;
    
    this.gl.viewport(0, 0, 1024, 1024);
    this.gl.bindFramebuffer(gl.FRAMEBUFFER, this.shadowBuffer.framebuffer);
    this.gl.useProgram(this.shadowProgramInfo.program);
    currentProgram = this.shadowProgramInfo;
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
      this.uniforms.useTexture = true;
    } else {
      this.uniforms.useTexture = false;
    }
    currentProgram.unsetAttribs();
    twgl.setBuffersAndAttributes(this.gl, currentProgram, meshpart.bufferInfo);
    twgl.setUniforms(currentProgram, this.uniforms);
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

  function createAttribUnsetter(gl, programInfo) {
    var program = programInfo.program;
    var indexes = [];
    var numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (var ii = 0; ii < numAttribs; ++ii) {
      var attribInfo = gl.getActiveAttrib(program, ii);
      if (!attribInfo) {
        break;
      }
      var index = gl.getAttribLocation(program, attribInfo.name);
      indexes.push(index);
    }
    programInfo.unsetAttribs = function() {
      for (var i = indexes.length - 1; i >= 0; i--) {
        index = indexes[i];
        gl.disableVertexAttribArray(index);
      };
    }
  }

}( window.renderLib = window.renderLib || {}, null ));