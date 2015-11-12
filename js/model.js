(function( modelLib, $, undefined ) { 
  //Public Object Creator
  //Inherits from entity3d
  modelLib.model = function(name, parent, meshparts) {
    entityLib.entity3d.call(this, name, parent);
    this.meshparts = meshparts || {};
    this.shader = null;
    this.occlude = true;
  }
  modelLib.model.prototype = new entityLib.entity3d();
  modelLib.model.prototype.setUniformsAndDraw = function(renderer, parentTransform) {
    parentTransform = parentTransform || null;
    var worldTransform = this.getTransformWithParentTransform(parentTransform);

    //transform to put normals into worldspace
    var normalTransform = mat3.create();
    normalTransform = mat3.fromMat4(normalTransform, worldTransform);

    mat3.invert(normalTransform, normalTransform);
    mat3.transpose(normalTransform, normalTransform);

    //each object sets up the uniforms it needs to be rendered
    renderer.uniforms.normalTransform = normalTransform;
    renderer.uniforms.worldTransform = worldTransform;

    //tell the renderer what shader this model expects. It may or may not get used
    renderer.expectShader(this.shader);

    for (var key in this.meshparts) {
      var meshpart = this.meshparts[key];
      meshpart.setUniformsAndDraw(renderer, this.occlude)
    }

    for (var key in this.children) {
      this.children[key].setUniformsAndDraw(renderer, worldTransform);
    };
  }

  modelLib.model.prototype.createGLBuffers = function(glWebContext) {
    for (var key in this.meshparts) {
      var meshpart = this.meshparts[key];
      meshpart.createGLBuffers(glWebContext);
    }
  }

  modelLib.meshpart = function(attribute_lists, indices, bones) {
    //attribute lists usually will contain at least position and normal
    this.attribute_lists = attribute_lists || {};
    this.indices = indices || [];
    this.bones = bones || [];    
    this.material = {};
    this.bufferInfo = null;
  }
  modelLib.meshpart.prototype.setUniformsAndDraw = function(renderer, occlude) {
    //a meshpart doesn't set up it's own transform (world / normal) because the model object
    //already should have
    if("diffuse" in this.material)
      renderer.uniforms.mat_diffuse = this.material.diffuse;
    if("specular" in this.material)
      renderer.uniforms.mat_specular = this.material.specular;
    if("textures" in this.material && this.material.textures.length > 0) {
      //just use the first texture as the diffuse texture
      renderer.uniforms.diffuse = this.material.textures[0].glTexture;
      renderer.uniforms.useTexture = true;
    } else {
      renderer.uniforms.useTexture = false;
    }

    renderer.renderMeshpart(this, occlude);
  }
  modelLib.meshpart.prototype.createGLBuffers = function(glWebContext) {
    if(this.bufferInfo == null)
    {
      var arrays = {
        indices:  {numComponents:3, data:this.indices},
      };

      for (var key in this.attribute_lists) {
        var attribute = this.attribute_lists[key];
        arrays[key] = attribute;
      }

      this.bufferInfo = twgl.createBufferInfoFromArrays(glWebContext, arrays);
    }
  }

  modelLib.createGLBuffersForDict = function(gl, models) {
    for (var key in models) {
      var model = models[key];
      model.createGLBuffers(gl);
      modelLib.createGLBuffersForDict(gl, model.children);
    };
  }

  modelLib.loadTexturesForDict = function(gl, models) {
    for (var modelid in models) {
      var model = models[modelid];
      for (var meshpartid in model.meshparts) {
        var meshpart = model.meshparts[meshpartid];
        if("textures" in meshpart.material) {
          for (var i = 0; i < meshpart.material.textures.length; i++) {
            var texture = meshpart.material.textures[i];
            
            if (!("glTexture" in texture)) {
              texture.glTexture = twgl.createTexture(gl, { src: texture.filename, target: gl.TEXTURE_2D, wrap: gl.REPEAT });
            }
          };
        }
      }
      modelLib.loadTexturesForDict(gl, model.children);
    };
  }

}( window.modelLib = window.modelLib || {}, null ));