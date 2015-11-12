(function( water, $, undefined ) { 

water.waterModel = function(name, parent, xdivs, zdivs) {
  modelLib.model.call(this, name, parent);
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
  console.log(POSITION);
  var tris = xdivs * zdivs * 2;
  console.log(tris);
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
  console.log(indices);
}
water.waterModel.prototype = new modelLib.model();

}( window.water = window.water || {}, null ));