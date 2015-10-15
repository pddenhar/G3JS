(function( modelLib, $, undefined ) { 
  //Public Object Creator
  modelLib.model = function(meshparts) {
    this.meshparts = meshparts || {};
  }

  modelLib.model.prototype.draw = function(renderer) {
    for (key in this.meshparts) {
      var meshpart = this.meshparts[key];
      meshpart.draw(renderer);
    }
  }

  modelLib.meshpart = function(attribute_lists, indices, bones) {
    //attribute lists usually will contain at least position and normal
    this.attribute_lists = attribute_lists || {};
    this.indices = indices || [];
    this.bones = bones || [];
  }

  modelLib.meshpart.prototype.draw = function(renderer) {

  }

  function prepareVertexForRender(vertex) {

  }

}( window.modelLib = window.modelLib || {}, null ));