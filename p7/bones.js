(function( bones, $, undefined ) { 

  bones.bone3d = function(name, parent, armature) {
    entityLib.entity3d.call(this, name, parent);
    armature.bones[name] = this;
  }
  bones.bone3d.prototype = new entityLib.entity3d();

  //armature's children will contain bones directly below it in hierarchy
  //bones dict will contain all child bones (even grandchildren etc)
  bones.armature = function(name) {
    entityLib.entity3d.call(this, name, null);
    this.bones = {};
  }
  bones.armature.prototype = new entityLib.entity3d();


}( window.bones = window.bones || {}, null ));