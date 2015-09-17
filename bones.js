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
    this.rotation = quat();
  }
  bones.bone3d.prototype.matrixType = mat4;
  bones.bone3d.prototype = new bones.bone2d()
  bones.bone3d.prototype.getTransform = function() {
    
  }

  // image - HTML5 Image() object
  // ox, oy - bone local origin location on image (0,0 is top left)
  bones.imageBone = function(name, parent, imageSrc, ox, oy) {
    bones.bone2d.call(this, name, parent);
    this.image = new Image(); // HTML5 Constructor
    this.image.src = imageSrc;
    this.ox = ox;
    this.oy = oy;
  }
  bones.imageBone.prototype = new bones.bone2d()
  bones.imageBone.prototype.drawToTransformedCtx = function(ctx) {
    //console.log("drawing " + this.name + this.pos)
    ctx.drawImage(this.image, -this.ox, -this.oy);
  }

  //Private Library Methods
  // function itsPrivate(array){
  // } 

}( window.bones = window.bones || {}, null ));