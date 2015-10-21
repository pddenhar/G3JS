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
  bones.bone3d.prototype = new bones.bone2d();
  bones.bone3d.prototype.matrixType = mat4;
  bones.bone3d.prototype.getTransform = function() {
    var out = mat4.create();
    var out = this.matrixType.fromRotationTranslation(out, this.rotation, this.pos);
    this.matrixType.scale(out,out,this.scale);
    return out;
  }


  //Private Library Methods
  // function itsPrivate(array){
  // } 

}( window.bones = window.bones || {}, null ));