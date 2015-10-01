(function( renderLib, $, undefined ) { 
  var light = [1,1,1];
  var lightRotation = mat4.create();
  mat4.rotateY(lightRotation, lightRotation, Math.PI/80000);
  renderLib.renderer = function(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.triangles = [];
  }
  renderLib.renderer.prototype.addTriangle = function(P1, P2, P3) {
    this.triangles.push([P1, P2, P3]);
  }
  renderLib.renderer.prototype.renderFrame = function(viewTransform) {
    var transformNormal = mat4.create();
    mat4.invert(transformNormal, viewTransform);
    mat4.transpose(transformNormal, transformNormal);
    for (var i = 0; i < this.triangles.length; i++) {
      var t = this.triangles[i];
      var worldNormal = vec3.create();
      for (var j = 0; j < t.length; j++) {
        var vertex = t[j];
        vec3.add(worldNormal, worldNormal, vertex.transformedNormal);
        vec4.transformMat4(vertex.renderPos, vertex.transformedPos, viewTransform); 
        vec4.scale(vertex.renderPos, vertex.renderPos, 1/vertex.renderPos[3]);
      };
      vec3.scale(worldNormal, worldNormal, 1/3.0);
      vec3.transformMat4(light, light, lightRotation);
      t.brightness = Math.max(0,vec3.dot(worldNormal, light));

    };
    this.triangles.sort(function sortem(a,b) {
      var az = (a[0].renderPos[2] + a[1].renderPos[2] + a[2].renderPos[2]) / 3.0;
      var bz = (b[0].renderPos[2] + b[1].renderPos[2] + b[2].renderPos[2]) / 3.0;
      return bz - az;
    });
    for (var i = 0; i < this.triangles.length; i++) {
      var t = this.triangles[i];
      this.context.beginPath();
      this.context.strokeStyle = "hsl(120, 100%, "+(t.brightness*50+20)+"%)";
      this.context.fillStyle = "hsl(120, 100%, "+(t.brightness*30+25)+"%)";
      this.context.moveTo(t[0].renderPos[0] * this.canvas.width, t[0].renderPos[1] * this.canvas.height);
      this.context.lineTo(t[1].renderPos[0] * this.canvas.width, t[1].renderPos[1] * this.canvas.height);
      this.context.lineTo(t[2].renderPos[0] * this.canvas.width, t[2].renderPos[1] * this.canvas.height);
      this.context.closePath();
      this.context.fill();
      this.context.stroke();
    };
    this.triangles = [];
  }

}( window.renderLib = window.renderLib || {}, null ));