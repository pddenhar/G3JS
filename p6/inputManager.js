(function( inputManager, $, undefined ) { 
  inputManager.keyboardState = [];
  function initManager() {
    window.onkeydown=function(event) {
        //console.log(event.which);
        inputManager.keyboardState[event.which] = true;
      };
      window.onkeyup = function(event) {
        inputManager.keyboardState[event.which] = false;
      };
  }
  initManager();

}( window.inputManager = window.inputManager || {}, null ));