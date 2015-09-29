(function( g3djLib, $, undefined ) { 

  g3djLib.loadModel = function(url) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == "200") {
        var actual_JSON = JSON.parse(xobj.responseText);
        console.log(actual_JSON);
      }
    }
    xobj.send(); 
  }

}( window.g3djLib = window.g3djLib || {}, null ));