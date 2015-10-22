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
    //load in the materials
    var materials = {};
    for (var i = 0; i < loaded_object.materials.length; i++) {
      var material = loaded_object.materials[i];
      materials[material.id] = material;
    };
    console.log(materials);

    var meshparts = loadMeshparts(loaded_object);
    //meshparts can share vertices from the main list and models can share meshparts (theoretically)
    console.log(meshparts);
    
    //the list of parent model objects in this file
    var models = {};
    for (var n = 0; n < loaded_object.nodes.length; n++) {
      var node = loaded_object.nodes[n];

      //the armature is included in nodes but is not a model
      if("parts" in node) {
        //recurse through the nodes
        models[node.id] = createModelsForNode(node, null, meshparts, materials);
      }
    };
    console.log(models);
    return models;
  }

  //this function will be used to recursively create models for all the children of each node in the nodes list
  function createModelsForNode(node, parent, meshparts, materials) {
    var name = node.id;
    var model = new modelLib.model(name, parent);
    if("parts" in node) {
      for (var i = 0; i < node.parts.length; i++) {
        var nodepart = node.parts[i];
        var loaded_meshpart = meshparts[nodepart.meshpartid];
        var material = materials[nodepart.materialid];

        loaded_meshpart.material = material;
        //place this meshpart that was loaded earlier into this node/model
        model.meshparts[nodepart.meshpartid] = loaded_meshpart;
        // if("bones" in nodepart) {
        //   var bones = [];
        //   for (var i = 0; i < nodepart.bones.length; i++) {
        //     bones.push(nodepart.bones[i].node); //only make the meshpart bones list contain the IDs of the bones
        //   };
        //   meshpart.bones = bones;
        // }
      };
    }
    if("scale" in node) {
      model.scale = node.scale;
    }
    if("translation" in node) {
      model.translation = node.translation;
    }
    if("rotation" in node) {
      model.rotation = node.rotation;
    }
    if("children" in node) {
      for (var i = 0; i < node.children.length; i++) {
        var child = node.children[i];
        //recurse through this model's children, creating more models from them
        createModelsForNode(child, model, meshparts, materials);
      };
    }
    return model;
  }

  function loadMeshparts(loaded_object) {
    var meshparts = {};
    for (var m = 0; m < loaded_object.meshes.length; m++) {
      var loaded_mesh = loaded_object.meshes[m];

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
        var meshpart = new modelLib.meshpart(attribute_lists, loaded_mesh.parts[p].indices);
        meshparts[loaded_mesh.parts[p].id] = meshpart;
      }
    };
    return meshparts;
  }

  var attributeDataSizes = { 
    "POSITION": 3,
    "NORMAL": 3,
    "TEXCOORD": 2,
    "BLENDWEIGHT": 2
   };


}( window.g3djLib = window.g3djLib || {}, null ));