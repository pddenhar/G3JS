(function( bones, $, undefined ) { 

  bones.bone3d = function(name, parent, armature) {
    entityLib.entity3d.call(this, name, parent);
    armature.bones[name] = this;
    this.inverseBindPose = mat4.create();
  }
  bones.bone3d.prototype = new entityLib.entity3d();
  bones.bone3d.prototype.generateInverseBindPoseRecursive = function(parentTransform) {
    var transform = this.getTransformWithParentTransform(parentTransform);
    mat4.invert(this.inverseBindPose, transform);
    for(var key in this.children) {
      this.children[key].generateInverseBindPoseRecursive(transform);
    };
  }

  //armature's children will contain bones directly below it in hierarchy
  //bones dict will contain all child bones (even grandchildren etc)
  bones.armature = function(name) {
    entityLib.entity3d.call(this, name, null);
    this.bones = {};
  }
  bones.armature.prototype = new entityLib.entity3d();
  bones.armature.prototype.generateInverseBindPoses = function() {
    var transform = this.getTransformWithParent();
    for(var key in this.children) {
      this.children[key].generateInverseBindPoseRecursive(transform);
    }
  }

}( window.bones = window.bones || {}, null ));