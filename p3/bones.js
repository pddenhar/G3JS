(function( bones, $, undefined ) { 
  //Private Library Property 
  var map_element = null;
  //Public Property
  //bones.thing;
 
  //Public Object Creator
  bones.bone2d = function(name, parent) {
    this.parent = parent || null;
    this.name = name;
    
    this.pos = vec2.create();
    this.scale = [1,1];
    this.rotation = 0;

    this.children = {};
    this.animation = null;

    if(this.parent) {
      this.parent.children[this.name] = this;
    }
  };
  bones.bone2d.prototype.matrixType = mat2d;
  bones.bone2d.prototype.getTransform = function() {
    var out = this.matrixType.create();
    this.matrixType.translate(out,out,this.pos);
    this.matrixType.rotate(out,out,this.rotation);
    this.matrixType.scale(out,out,this.scale);
    return out;
  }
  bones.bone2d.prototype.getTransformWithParent = function() {
    var t = this.getTransform();
    return this.parent == null ? t : this.matrixType.mul(t, this.parent.getTransformWithParent(), t)
  }
  bones.bone2d.prototype.getTransformWithParentTransform = function(parentTfm) {
    var t = this.getTransform();
    return parentTfm == null ? t : this.matrixType.mul(t, parentTfm, t)
  }

  bones.bone3d = function(name, parent) {
    bones.bone2d.call(this, name, parent);
    this.pos = vec3.create();
    this.scale = [1,1,1];
    this.rotation = quat.create();
  }
  bones.bone3d.prototype = new bones.bone2d()
  bones.bone3d.prototype.matrixType = mat4;
  bones.bone3d.prototype.getTransform = function() {
    var out = mat4.create();
    var out = this.matrixType.fromRotationTranslation(out, this.rotation, this.pos);
    this.matrixType.scale(out,out,this.scale);
    return out;
  }

  // x, y, z - length, width, height
  // origin is at the top of the square created by x and y
  // z extends out normal to that top square
  bones.wireBone = function(name, parent, x, y, z) {
    bones.bone3d.call(this, name, parent);
    this.points = [
      [x/2.0,y/2.0,0],
      [-x/2.0,y/2.0,0],
      [x/2.0,-y/2.0,0],
      [-x/2.0,-y/2.0,0],
      [x/2.0,y/2.0,z],
      [-x/2.0,y/2.0,z],
      [x/2.0,-y/2.0,z],
      [-x/2.0,-y/2.0,z]
    ];
    this.lines = [
    [0,1], [0,2], [3,1], [3,2], //top square
    [4,5], [4,6], [7,5], [7,6],  //bottom square
    [0,4], [1,5], [2,6], [3,7]
    ]
  }
  bones.wireBone.prototype = new bones.bone3d()
  bones.wireBone.prototype.draw = function(canvas,ctx, transform) {
    var pointsWithTransform = this.points.map(function(p) { var out = vec4.create(); out[3] = 1; vec3.copy(out, p); return vec4.transformMat4(out, out, transform); });
    for (var i = 0; i < this.lines.length; i++) {
      var p1 = pointsWithTransform[this.lines[i][0]];
      var p2 = pointsWithTransform[this.lines[i][1]];
      if(p1[3] > 0) {
        vec4.scale(p1, p1, 1/p1[3]);
      }
      if(p2[3] > 0) {
        vec4.scale(p2, p2, 1/p2[3]);
      }
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.moveTo(p1[0] * canvas.width, p1[1] * canvas.height);
      ctx.lineTo(p2[0] * canvas.width, p2[1] * canvas.height);
      ctx.stroke();
    };
  }


  //Private Library Methods
  // function itsPrivate(array){
  // } 

}( window.bones = window.bones || {}, null ));