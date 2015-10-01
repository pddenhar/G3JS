(function( renderLib, $, undefined ) { 

  renderLib.renderer = function(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.triangles = [];
  }
  renderLib.renderer.addTriangle() {
    
  }
  renderLib.renderer.renderFrame(viewTransform) {
    var trianglesWithTransform = this.triangles.map(function(p) { var out = vec4.create(); out[3] = 1; vec3.copy(out, p); return vec4.transformMat4(out, out, transform); });
  }

}( window.renderLib = window.renderLib || {}, null ));