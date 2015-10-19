(function( animation, $, undefined ) { 
  //Private Library Property 
  //var map_element = null;

  //Public Property
  //animation.thing;
 
  //Public Object Creator
  animation.animation = function(element) {
    this.element = element;
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
      lerp(lkey,rkey,this.element,percent);
    }
  }
  //for now keyframes must be added in order for this to work
  //all keyframes for an animation must include all property values
  animation.animation.prototype.addKeyframe = function(timeMS, value) {
    this.keyframes.push(new animation.keyframe(timeMS, value));
    if(timeMS > this.totalLength) {
      this.totalLength = timeMS;
    }
  }
  
  // propertyValues: {"rotation": Math.PI / 4}
  animation.keyframe = function(timeMS, value) {
    this.value = value;
    this.timeMS = timeMS;
  };


  //Private Library Methods
  // k1, k2 are keyframes to lerp between
  // element is the object to modify
  // percent is a number 0.0-1.0 
  function lerp(k1, k2, element, percent){
    for (var i = 0; i < element.length; i++) {
      console.log(element[i]);
      element[i] = k1.value[i] + (k2.value[i] - k1.value[i]) * percent;
      console.log(element[i]);
    };
  } 

}( window.animation = window.animation || {}, null ));