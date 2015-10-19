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

      //map the attributes from NORMAL0 to [NORMAL, 0]
      var attributes = loaded_mesh.attributes.map(function(attribute) {
        var re = /^(\w+?)(\d*)$/; 
        var m = re.exec(attribute);
        var index = parseInt(m[2]);
        index = (isNaN(index) ? 0 : index);
        return [attribute, attributeDataSizes[m[1]]];
      });

      var attribute_lists = {}
      for (var i = 0; i < loaded_mesh.vertices.length;) {
        //loop through the attributes and <length> elements from vertices
        for (var j = 0; j < attributes.length; j++) {
          var attrinfo = attributes[j];
          if(!(attrinfo[0] in attribute_lists)) {
            attribute_lists[attrinfo[0]] = [];
          }
          //put <dataSize> push them to the vertex's list for that attribute
          for (var k=0; k < attrinfo[1]; k++) {
            attribute_lists[attrinfo[0]].push(loaded_mesh.vertices[i+k]);
          }
          i+=attrinfo[1];
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