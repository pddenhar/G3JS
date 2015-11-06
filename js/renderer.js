(function( renderLib, $, undefined ) { 
  var light = [-40,30,-40];
  var currentProgram = null;
  var quadShader;
  var depthTextureExt;
  renderLib.renderer = function(glWebContext) {
    this.gl = glWebContext;
    this.programInfo = twgl.createProgramInfo(this.gl, [vs, fs]);
    createAttribUnsetter(this.gl, this.programInfo);

    this.skyProgramInfo = twgl.createProgramInfo(this.gl, [skyvs, skyfs]);

    depthTextureExt = gl.getExtension("WEBGL_depth_texture"); // Or browser-appropriate prefix
    if(!depthTextureExt) { alert("Your browser does not support depth textures! Please use chrome."); }
    var size = 1024;

    var attachments = [
      { format: gl.RGBA, type: gl.UNSIGNED_BYTE, min: gl.NEAREST, mag: gl.NEAREST, wrap: gl.CLAMP_TO_EDGE },
      { format: gl.DEPTH_COMPONENT, type: gl.UNSIGNED_SHORT, min: gl.NEAREST, mag: gl.NEAREST, wrap: gl.CLAMP_TO_EDGE  },
    ];
    
    this.shadowProgramInfo = twgl.createProgramInfo(this.gl, [vs, shadowfs]);
    createAttribUnsetter(this.gl, this.shadowProgramInfo);
    this.shadowBuffer = twgl.createFramebufferInfo(gl, attachments, size, size);
    this.shadowBuffer.size = size;

    this.gl.enable(this.gl.DEPTH_TEST);

    var skyArray = {
      position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
    };
    this.skyBufferInfo = twgl.createBufferInfoFromArrays(gl, skyArray);
  }
  // Function adapted from code by Brandon Jones
  function drawTexturedQuad(gl, texture, x, y, width, height) {
    if(!quadShader) {
        // Set up the verticies and indices
        var arrays = {
          position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
          texture: {numComponents:2, data:[0,0,  1,0,  0,1,  0,1,  1,0,  1,1]},
        };

        quadShader = twgl.createProgramInfo(this.gl, [quadVS, quadFS]);
        quadShader.buffers = twgl.createBufferInfoFromArrays(gl, arrays);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // This is a terrible way to do this, use a transform matrix instead
    var viewport = gl.getParameter(gl.VIEWPORT);
    gl.viewport(x, y, width, height);

    gl.disable(gl.DEPTH_TEST);

    gl.useProgram(quadShader.program);

    twgl.setBuffersAndAttributes(gl, quadShader, quadShader.buffers);
    
    twgl.setUniforms(quadShader,{dinky:texture});

    twgl.drawBufferInfo(gl, gl.TRIANGLES, quadShader.buffers);

    gl.enable(gl.DEPTH_TEST);
    //gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);
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
      cameraPosition: cameraPosition,
      viewProjection: viewProjection
    };
    renderShadowMap.call(this, framelight);
    //set the view projection to the real thing (not a shadow projection)
    this.uniforms.viewProjection = viewProjection;
    //draw the real scene with the full shader
    this.gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    drawTexturedQuad.call(this, this.gl, this.shadowBuffer.attachments[1], 0, 0, 200,200);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
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
    mat4.ortho(projection, -50,50,-50,50,1,200);

    var viewProjection = mat4.create();
    mat4.multiply(viewProjection, cameraMatrix, viewProjection);
    mat4.multiply(viewProjection, projection, viewProjection);
    
    this.uniforms.viewProjection = viewProjection;
    //this uniform will get used later during actual drawing

    this.uniforms.lightViewProjection = viewProjection;
    
    this.gl.viewport(0, 0, this.shadowBuffer.size, this.shadowBuffer.size);
    this.gl.bindFramebuffer(gl.FRAMEBUFFER, this.shadowBuffer.framebuffer);
    //gl.colorMask(false, false, false, false); // Don't write to the color channels at all
    gl.clear(gl.DEPTH_BUFFER_BIT); // Clear only the depth buffer
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

    this.uniforms.shadowMap = this.shadowBuffer.attachments[1]

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