(function( water, $, undefined ) { 

water.waterModel = function(name, parent, xdivs, zdivs) {
  modelLib.model.call(this, name, parent);
  this.shader = "water";
  var watermesh = new modelLib.meshpart();
  var POSITION = [];
  var indices = [];
  for (var i = 0; i <= xdivs; i++) {
    for (var j = 0; j <= zdivs; j++) {
      var index = i*(zdivs+1)+j;
      //console.log(i + " " + j + " " + index)
      var x = 1.0/xdivs * i;
      var z = 1.0/zdivs * j;
      POSITION[(index) * 3] = x;
      POSITION[(index) * 3 + 1] = 0; // y = 0
      POSITION[(index) * 3 + 2] = z; 
    };
  };
  var tris = xdivs * zdivs * 2;
  for (var i = 0; i < xdivs; i++) {
    for (var j = 0; j < zdivs; j++) {
      var index = (i*zdivs+j) * 6;
      indices[index] = i*(zdivs+1)+j;
      indices[index + 1] = i*(zdivs+1)+j + 1;
      indices[index + 2] = (i+1)*(zdivs+1)+j;
      indices[index + 3] = i*(zdivs+1)+j + 1;
      indices[index + 4] = (i+1)*(zdivs+1)+j;
      indices[index + 5] = (i+1)*(zdivs+1)+j + 1;
    }
  }
  watermesh.indices = indices;
  watermesh.attribute_lists.POSITION = POSITION;
  watermesh.material = {
    "diffuse": [
       0.000000, 0.154463, 0.800000
    ],
    "id": "Material__Water",
    "specular": [
       0.088986, 0.861024, 1.000000
    ],
  }
  this.meshparts.watermesh = watermesh;
}

water.waterModel.prototype = new modelLib.model();

water.waterModel.prototype.setUniformsAndDraw = function(renderer, parentTransform) {
  var time = new Date().getTime();
  renderer.uniforms.time = time;
  modelLib.model.prototype.setUniformsAndDraw.call(this, renderer, parentTransform);
}

}( window.water = window.water || {}, null ));