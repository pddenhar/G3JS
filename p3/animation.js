(function( animation, $, undefined ) { 
  //Private Library Property 
  //var map_element = null;

  //Public Property
  //animation.thing;
 
  //Public Object Creator
  animation.animation = function(bone) {
    this.bone = bone;
    this.keyframes = [];
    this.totalLength = 0;
  };
  animation.animation.prototype.update = function(ts) {
    ts = ts % (this.totalLength+1);
    var lkey = null;
    var rkey = null;
    for (var i = 0; i < this.keyframes.length; i++) {
      key = this.keyframes[i];
      if(ts >= key.timeMS && (lkey == null || (ts - lkey.timeMS > ts - key.timeMS))) {
        lkey=key;
      }
      if(ts <= key.timeMS && (rkey == null || (rkey.timeMS - ts > key.timeMS - ts))) {
        rkey=key;
      }
    };
    if(lkey && rkey) {
      var ktdelta = rkey.timeMS - lkey.timeMS;
      var percent = 0;
      if(ktdelta != 0) {
        percent = (ts - lkey.timeMS) / ktdelta;
      }
      lerp(lkey,rkey,this.bone,percent);
    }
  }
  //for now keyframes must be added in order for this to work
  //all keyframes for an animation must include all property values
  animation.animation.prototype.addKeyframe = function(timeMS, propertyValues) {
    this.keyframes.push(new animation.keyframe(timeMS, propertyValues));
    if(timeMS > this.totalLength) {
      this.totalLength = timeMS;
    }
  }
  
  // propertyValues: {"rotation": Math.PI / 4}
  animation.keyframe = function(timeMS, propertyValues) {
    this.propertyValues = propertyValues;
    this.timeMS = timeMS;
  };


  //Private Library Methods
  // k1, k2 are keyframes to lerp between
  // bone is the object to modify
  // percent is a number 0.0-1.0 
  function lerp(k1, k2, bone, percent){
    for(key in k1.propertyValues) {
      k1v = k1.propertyValues[key];
      k2v = k2.propertyValues[key];
      if( key == "rotation") {
        quat.slerp(bone[key], k1v, k2v, percent);
      } else {
        bone[key] = k1v + (k2v - k1v) * percent;
      }
    }
  } 

}( window.animation = window.animation || {}, null ));