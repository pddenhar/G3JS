(function( inputManager, $, undefined ) { 
  inputManager.keyboardState = [];
  inputManager.mouseState = {};

  function initManager() {
    window.onkeydown=function(event) {
      //console.log(event.which);
      inputManager.keyboardState[event.which] = true;
    };
    window.onkeyup = function(event) {
      inputManager.keyboardState[event.which] = false;
    };
    window.onmousedown = function(event) {
      inputManager.mouseState[event.which] = true;
    };
    window.onmouseup = function(event) {
      inputManager.mouseState[event.which] = false;
    };
    window.onmousemove = function(event) {
      inputManager.mouseState.x = event.pageX;
      inputManager.mouseState.y = event.pageY;
    };
  }
  initManager();

}( window.inputManager = window.inputManager || {}, null ));