(function( inputManager, $, undefined ) { 
  inputManager.keyboardState = [];
  inputManager.mouseState = {};

  function initManager() {
    inputManager.mouseState.wheelY = 0;
    
    window.onkeydown=function(event) {
      //console.log(event.which);
      inputManager.keyboardState[event.which] = true;
    };
    window.onkeyup = function(event) {
      inputManager.keyboardState[event.which] = false;
    };
    window.onmousedown = function(event) {
      if(event.which == 2)
        event.preventDefault();
      inputManager.mouseState[event.which] = true;
    };
    window.onmouseup = function(event) {
      if(event.which == 2)
        event.preventDefault();
      inputManager.mouseState[event.which] = false;
    };
    window.onmousemove = function(event) {
      inputManager.mouseState.x = event.pageX;
      inputManager.mouseState.y = event.pageY;
    };
    window.onwheel = function(event) {
      var deltaY = event.wheelDeltaY;
      inputManager.mouseState.wheelY += deltaY;
    };
  }
  initManager();

}( window.inputManager = window.inputManager || {}, null ));