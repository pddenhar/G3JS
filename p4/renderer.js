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
    for (var i = 0; i < this.triangles.length; i++) {
      var t = this.triangles[i];
      for (var j = 0; j < t.length; j++) {
        var vertex = t[j];
        vec4.transformMat4(vertex.renderPos, vertex.transformedPos, viewTransform); 
        vec3.transformMat4(vertex.renderNormal, vertex.transformedNormal, viewTransform); 
        vec4.scale(vertex.renderPos, vertex.renderPos, 1/vertex.renderPos[3]);
      };

      this.context.beginPath();
      this.context.strokeStyle = "black";
      this.context.moveTo(t[0].renderPos[0] * this.canvas.width, t[0].renderPos[1] * this.canvas.height);
      this.context.lineTo(t[1].renderPos[0] * this.canvas.width, t[1].renderPos[1] * this.canvas.height);
      this.context.moveTo(t[0].renderPos[0] * this.canvas.width, t[0].renderPos[1] * this.canvas.height);
      this.context.lineTo(t[2].renderPos[0] * this.canvas.width, t[2].renderPos[1] * this.canvas.height);
      this.context.moveTo(t[1].renderPos[0] * this.canvas.width, t[1].renderPos[1] * this.canvas.height);
      this.context.lineTo(t[2].renderPos[0] * this.canvas.width, t[2].renderPos[1] * this.canvas.height);
      this.context.stroke();
    };
    this.triangles = [];
  }

}( window.renderLib = window.renderLib || {}, null ));