(function( modelLib, $, undefined ) { 
  //Public Object Creator
  modelLib.model = function(meshparts) {
    this.meshparts = meshparts || {};
  }

  modelLib.meshpart = function(vertices, indices, vertex_type, bones) {
    this.vertices = vertices || [];
    this.indices = indices || [];
    this.vertex_type = vertex_type || "TRIANGLES";
    this.bones = bones || [];
  }


}( window.modelLib = window.modelLib || {}, null ));