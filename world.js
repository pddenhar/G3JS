(function( world, $, undefined ) { 
  world.objects;
  world.cameraPosition;

  world.init = function(objects, cameraPosition) {
    world.objects = objects || {};
    world.cameraPosition = cameraPosition || vec3.create();
  }
  world.update = function(delta, inputManager) {
    world.handleInput(delta, inputManager);
    world.updateCamera(delta);
  }
  var cameraVz = Math.PI/55; //rad/sec
  var deltaVz = 0;
  var deltaVy = 0;
  world.updateCamera = function(delta){
    //rotate side to side
    var rotationMatrix = mat4.create();
    mat4.rotateY(rotationMatrix, rotationMatrix, delta/1000 * (cameraVz + deltaVz));
    vec3.transformMat4(world.cameraPosition, world.cameraPosition, rotationMatrix);
    //rotate up/down
    var normalCamera = vec3.create();
    vec3.normalize(normalCamera, world.cameraPosition);
    var dot = vec3.dot(normalCamera, [0,1,0]);
    if((dot < .98 || deltaVy < 0) && (dot > -.98 || deltaVy > 0)) {
      var rotateAxis = vec3.create();
      vec3.cross(rotateAxis, world.cameraPosition, [0,1,0]);
      vec3.normalize(rotateAxis,rotateAxis);
      mat4.rotate(rotationMatrix, rotationMatrix, delta/1000 * (deltaVy), rotateAxis);
      vec3.transformMat4(world.cameraPosition, world.cameraPosition, rotationMatrix);
    }

    //reset deltas slowly
    if(!inputManager.mouseState[2] && !inputManager.mouseState[1]) {
      deltaVz -= deltaVz * .05;
      deltaVy -= deltaVy * .05;
    }
  }
  var lastX = null, lastY=null, lastWheelY=0;
  world.handleInput = function(delta, inputManager) {
    //HANDLE INPUT
    if(inputManager.keyboardState[65]) //a
    {
      if(deltaVz > -cameraVz * 3)
        deltaVz -= delta/1000;
    }

    if(inputManager.keyboardState[68]) //d
    {
      if(deltaVz < cameraVz*2)
        deltaVz += delta/1000;
    }

    function zoom(amount) {
      var cameraMove = vec3.create();
      vec3.normalize(cameraMove,world.cameraPosition);
      vec3.scale(cameraMove,cameraMove,amount);
      vec3.add(world.cameraPosition, world.cameraPosition, cameraMove);
    }

    if(inputManager.keyboardState[87] && vec3.len(world.cameraPosition) > 5) //w
    {
      zoom(-delta/16);
    }
    if(inputManager.mouseState.wheelY != lastWheelY) {
      var deltaY = inputManager.mouseState.wheelY - lastWheelY;
      lastWheelY = inputManager.mouseState.wheelY;
      zoom(-deltaY/25);
    }
    if(inputManager.keyboardState[83]) //s
    {
      zoom(delta/16);
    }

    if(inputManager.mouseState[2] || inputManager.mouseState[1]) {
      if(lastX == null || lastY == null) {
        lastX = inputManager.mouseState.x;
        lastY = inputManager.mouseState.y;
      } else {
        var diffX = inputManager.mouseState.x - lastX;
        var diffY = inputManager.mouseState.y - lastY;
        lastX = inputManager.mouseState.x;
        lastY = inputManager.mouseState.y;

        if(deltaVz > -cameraVz*10 && diffX > 0)
          deltaVz -= diffX/200;

        if(deltaVz < cameraVz*10 && diffX < 0)
          deltaVz -= diffX/200;

        if(deltaVy > -cameraVz*10 && diffY < 0)
          deltaVy += diffY/200;

        if(deltaVy < cameraVz*10 && diffY > 0)
          deltaVy += diffY/200;
      }
    } else {
      lastX = null;
      lastY = null;
    }
  }
}( window.world = window.world || {}, null ));