(function( world, $, undefined ) { 
  world.objects;
  world.cameraPosition;

  world.init = function(objects, cameraPosition) {
    world.objects = objects || {};
    world.cameraPosition = cameraPosition || vec3.create();
  }

  world.handleInput = function(delta, inputManager) {
  //HANDLE INPUT
  if(inputManager.keyboardState[65]) //a
  {
    var rotationMatrix = mat4.create();
    mat4.rotateY(rotationMatrix, rotationMatrix, Math.PI/2000 * delta);
    vec3.transformMat4(world.cameraPosition, world.cameraPosition, rotationMatrix);
  }

  if(inputManager.keyboardState[68]) //d
  {
    var rotationMatrix = mat4.create();
    mat4.rotateY(rotationMatrix, rotationMatrix, -Math.PI/2000 * delta);
    vec3.transformMat4(world.cameraPosition, world.cameraPosition, rotationMatrix);
  }

  if(inputManager.keyboardState[87] && vec3.len(world.cameraPosition) > 10) //w
  {
    var cameraMove = vec3.create();
    vec3.normalize(cameraMove,world.cameraPosition);
    vec3.scale(cameraMove,cameraMove,delta/16);
    vec3.sub(world.cameraPosition, world.cameraPosition, cameraMove);
  }

  if(inputManager.keyboardState[83]) //s
  {
    var cameraMove = vec3.create();
    vec3.normalize(cameraMove,world.cameraPosition);
    vec3.scale(cameraMove,cameraMove,delta/16);
    vec3.add(world.cameraPosition, world.cameraPosition, cameraMove);
  }

  if(inputManager.mouseState[2]) {
    if(lastX == null || lastY == null) {
      lastX = inputManager.mouseState.x;
      lastY = inputManager.mouseState.y;
    } else {
      var diffX = inputManager.mouseState.x - lastX;
      var diffY = inputManager.mouseState.y - lastY;
      lastX = inputManager.mouseState.x;
      lastY = inputManager.mouseState.y;

      var rotationMatrix = mat4.create();
      mat4.rotateY(rotationMatrix, rotationMatrix, Math.PI/1000 * -diffX);

      var rotateAxis = vec3.create();
      vec3.cross(rotateAxis, world.cameraPosition, [0,1,0]);
      vec3.normalize(rotateAxis,rotateAxis);
      mat4.rotate(rotationMatrix, rotationMatrix, Math.PI/1000 * diffY, rotateAxis);
      vec3.transformMat4(world.cameraPosition, world.cameraPosition, rotationMatrix);
    }
  } else {
    lastX = null;
    lastY = null;
  }
}
}( window.world = window.world || {}, null ));