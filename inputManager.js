(function( inputManager, $, undefined ) { 
  inputManager.keyboardState = [];
  inputManager.mouseState = {};

  inputManager.initManager = function(element) {
    inputManager.mouseState.wheelY = 0;
    
    window.onkeydown=function(event) {
      //console.log(event.which);
      inputManager.keyboardState[event.which] = true;
    };
    window.onkeyup = function(event) {
      inputManager.keyboardState[event.which] = false;
    };
    element.onmousedown = function(event) {
      if(event.which == 2)
        event.preventDefault();
      inputManager.mouseState[event.which] = true;
    };
    element.onmouseup = function(event) {
      if(event.which == 2)
        event.preventDefault();
      inputManager.mouseState[event.which] = false;
    };
    element.onmousemove = function(event) {
      inputManager.mouseState.x = event.pageX;
      inputManager.mouseState.y = event.pageY;
    };
    element.onwheel = function(event) {
      var deltaY = event.wheelDeltaY;
      inputManager.mouseState.wheelY += deltaY;
    };
  }

}( window.inputManager = window.inputManager || {}, null ));