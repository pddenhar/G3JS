(function( modelLib, $, undefined ) { 
  //Public Object Creator
  //Inherits from entity3d
  modelLib.model = function(name, parent, meshparts) {
    entityLib.entity3d.call(this, name, parent);
    this.meshparts = meshparts || {};
  }
  modelLib.model.prototype = new entityLib.entity3d();
  modelLib.model.prototype.draw = function(renderer, parentTransform) {
    parentTransform = parentTransform || null;
    var worldTransform = this.getTransformWithParentTransform(parentTransform);

    //transform to put normals into worldspace
    var normalTransform = mat3.create();
    normalTransform = mat3.fromMat4(normalTransform, worldTransform);

    mat3.invert(normalTransform, normalTransform);
    mat3.transpose(normalTransform, normalTransform);

    for (key in this.meshparts) {
      var meshpart = this.meshparts[key];
      renderer.renderMeshpart(meshpart, normalTransform, worldTransform);
    }

    for (key in this.children) {
      this.children[key].draw(renderer, worldTransform);
    };
  }

  modelLib.model.prototype.createGLBuffers = function(glWebContext) {
    for (key in this.meshparts) {
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

  modelLib.meshpart.prototype.createGLBuffers = function(glWebContext) {
    if(this.bufferInfo == null)
    {
      var arrays = {
        indices:  {numComponents:3, data:this.indices},
      };

      for (key in this.attribute_lists) {
        var attribute = this.attribute_lists[key];
        arrays[key] = attribute;
      }

      this.bufferInfo = twgl.createBufferInfoFromArrays(glWebContext, arrays);
    }
  }

  modelLib.createGLBuffersForDict = function(gl, models) {
    for (key in models) {
      var model = models[key];
      model.createGLBuffers(gl);
      modelLib.createGLBuffersForDict(gl, model.children);
    };
  }

  modelLib.loadTexturesForDict = function(gl, models) {
    for (modelid in models) {
      var model = models[modelid];
      for (meshpartid in model.meshparts) {
        var meshpart = model.meshparts[meshpartid];
        if("textures" in meshpart.material) {
          for (var i = 0; i < meshpart.material.textures.length; i++) {
            var texture = meshpart.material.textures[i];
            if (!("glTexture" in texture)) {
              texture.glTexture = twgl.createTexture(gl, { src: texture.filename });
            }
          };
        }
      }
      modelLib.createGLBuffersForDict(gl, model.children);
    };
  }

}( window.modelLib = window.modelLib || {}, null ));