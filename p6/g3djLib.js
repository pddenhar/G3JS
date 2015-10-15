(function( g3djLib, $, undefined ) { 

  g3djLib.loadModel = function(url, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == "200") {
        var model = parseModel(JSON.parse(xobj.responseText));
      }
    }
    xobj.send(); 
  }

  g3djLib.parseModel = function(loaded_object) {
    var model = new modelLib.model();
    for (var i = 0; i < loaded_object.meshes.length; i++) {
      var loaded_mesh = loaded_object.meshes[i];

      var attribute_lists = {}
      for (var i = 0; i < loaded_mesh.vertices.length;) {
        //loop through the attributes and <length> elements from vertices
        for (var j = 0; j < loaded_mesh.attributes.length; j++) {
          var attrname = loaded_mesh.attributes[j];
          if(!(attrname in attribute_lists)) {
            attribute_lists[attrname] = [];
          }
          //put <dataSize> push them to the vertex's list for that attribute
          for (var k=0; k < attributeDataSizes[attrname]; k++) {
            attribute_lists[attrname].push(loaded_mesh.vertices[i+k]);
          }
          i+=attributeDataSizes[attrname];
        };
      }

      //create mesh parts that share the attribute_lists
      for(var p = 0; p < loaded_mesh.parts.length; p++) {
        model.meshparts[loaded_mesh.parts[p].id] = new modelLib.meshpart(attribute_lists, loaded_mesh.parts[p].indices);
      }
    };
    for (var n = 0; n < loaded_object.nodes.length; n++) {
      var node = loaded_object.nodes[n];
      if("parts" in node) {
        for (var i = 0; i < node.parts.length; i++) {
          var nodepart = node.parts[i];
          var meshpart = model.meshparts[nodepart.meshpartid];
          if("bones" in nodepart) {
            var bones = [];
            for (var i = 0; i < nodepart.bones.length; i++) {
              bones.push(nodepart.bones[i].node); //only make the meshpart bones list contain the IDs of the bones
            };
            meshpart.bones = bones;
          }
        };
      }
    };
    console.log(model);
    return model;
  }

  var attributeDataSizes = { 
    "POSITION": 3,
    "NORMAL": 3,
    "TEXCOORD": 2,
    "BLENDWEIGHT": 2
   };


}( window.g3djLib = window.g3djLib || {}, null ));