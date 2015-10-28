(function( entityLib, $, undefined ) { 
  //Public Object Creator
  entityLib.entity3d = function(name, parent) {
    this.parent = parent || null;
    this.name = name;

    this.translation = vec3.create();
    this.scale = [1,1,1];
    this.rotation = quat.create();

    this.children = {};

    if(this.parent) {
      this.parent.children[name] = this;
    }
  };
  entityLib.entity3d.prototype.matrixType = mat4;
  entityLib.entity3d.prototype.getTransform = function() {
    var out = this.matrixType.create();
    var out = this.matrixType.fromRotationTranslation(out, this.rotation, this.translation);
    this.matrixType.scale(out,out,this.scale);
    return out;
  }
  entityLib.entity3d.prototype.getTransformWithParent = function() {
    var t = this.getTransform();
    return this.parent == null ? t : this.matrixType.mul(t, this.parent.getTransformWithParent(), t)
  }
  entityLib.entity3d.prototype.getTransformWithParentTransform = function(parentTfm) {
    var t = this.getTransform();
    return parentTfm == null ? t : this.matrixType.mul(t, parentTfm, t)
  }

}( window.entityLib = window.entityLib || {}, null ));