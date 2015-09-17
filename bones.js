(function( bones, $, undefined ) { 
  //Private Library Property 
  var map_element = null;
  var matrixType = mat2d;
  //Public Property
  //bones.thing;
 
  //Public Object Creator
  bones.bone = function(name, parent) {
    this.parent = parent || null;
    this.name = name;
    this.transform = matrixType.create();

    this.children = {};

    if(this.parent) {
      this.parent.children[this.name] = this;
    }
  };

  bones.bone.prototype.getTransformWithParent = function() {
    var out = matrixType.create();
    return this.parent == null ? this.transform : matrixType.mul(out, this.transform, this.parent.getTransformWithParent())
  }

  // image - HTML5 Image() object
  // ox, oy - bone local origin location on image (0,0 is top left)
  bones.imageBone = function(name, parent, imageSrc, ox, oy) {
    bones.bone.call(this, name, parent);
    this.image = new Image(); // HTML5 Constructor
    this.image.src = imageSrc;
    this.ox = ox;
    this.oy = oy;
  }

  bones.imageBone.prototype = new bones.bone()
  bones.bone.prototype.drawToTransformedCtx = function(ctx) {
    ctx.drawImage(this.image, -this.ox, -this.oy);
  }

  //Private Library Methods
  // function itsPrivate(array){
  // } 

}( window.bones = window.bones || {}, null ));