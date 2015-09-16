(function( bones, $, undefined ) { 
  //Private Library Property 
  var map_element = null;

  //Public Property
  //bones.thing;
 
  //Public Method
  bones.bone = function(name, parent) {
    this.parent = parent;
    this.name = name;
  };
 
  //Private Library Methods
  function makeIterator(array){
    var nextIndex = 0;
    
    return {
      next: function(){
        if(nextIndex >= array.length)
          nextIndex = 0;
        return array[nextIndex++]
      }
    }
  } 
}( window.bones = window.bones || {}, null ));