(function( renderLib, $, undefined ) { 

  renderLib.renderer = function(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.triangles = [];
  }
  renderLib.renderer.prototype.addTriangle = function(P1, P2, P3) {
    this.triangles.push([P1, P2, P3]);
  }
  renderLib.renderer.prototype.renderFrame = function(viewTransform) {
    console.log(this.triangles);
    for (var i = 0; i < this.triangles.length; i++) {
      var t = this.triangles[i];
      for (var j = 0; j < t.length; j++) {
        var vertex = t[j];
        vec4.transformMat4(vertex.renderPos, vertex.renderPos, viewTransform); 
        vec3.transformMat4(vertex.renderNormal, vertex.renderNormal, viewTransform); 
      };
    };
    console.log(this.triangles);
    this.triangles = [];
  }

}( window.renderLib = window.renderLib || {}, null ));