(function( modelLib, $, undefined ) { 
  //Public Object Creator
  modelLib.model = function(meshparts, worldTransform) {
    this.meshparts = meshparts || {};
    this.worldTransform = worldTransform || mat4.create();
  }

  modelLib.model.prototype.draw = function(renderer) {
    //transform to put normals into worldspace
    var normalTransform = mat3.create();
    normalTransform = mat3.fromMat4(normalTransform, this.worldTransform);

    mat3.invert(normalTransform, normalTransform);
    mat3.transpose(normalTransform, normalTransform);

    for (key in this.meshparts) {
      var meshpart = this.meshparts[key];
      renderer.renderMeshpart(meshpart, normalTransform, this.worldTransform);
    }
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

    
  }

  modelLib.meshpart.prototype.createGLBuffers = function(glWebContext) {
    var arrays = {
      position: this.attribute_lists.POSITION,
      normal: this.attribute_lists.NORMAL,
      indices:  this.indices,
    };

    this.bufferInfo = twgl.createBufferInfoFromArrays(glWebContext, arrays);
  }



}( window.modelLib = window.modelLib || {}, null ));