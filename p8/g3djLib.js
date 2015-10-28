(function( g3djLib, $, undefined ) { 
  //private library data
  var attributeDataSizes = { 
    "POSITION": 3,
    "NORMAL": 3,
    "TEXCOORD": 2,
    "BLENDWEIGHT": 2,
    "COLOR": 4
   };

   //transform to move from z-up coordinates
   var blenderfix = quat.create();
   quat.rotateX(blenderfix, blenderfix, -Math.PI/2);

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

    var meshparts = loadMeshparts(loaded_object);
    //meshparts can share vertices from the main list and models can share meshparts (theoretically)
    
    //the list of parent model objects in this file
    var models = {};
    var armatures = {};
    for (var n = 0; n < loaded_object.nodes.length; n++) {
      var node = loaded_object.nodes[n];        
      //the armature is included in nodes but is not a model
      if("parts" in node) {
        //recurse through the nodes
        models[node.id] = createModelsForNode(node, null, meshparts, materials);
      } else { //if there are no parts this is an armature
        var armature = createArmatureForNode(node);
        //generate inverse bind poses for all child bones
        armature.generateInverseBindPoses();
        //add to the list of armatures
        armatures[armature.name] = armature;
      }
    };

    //now the models and armatures are loaded.
    //meshparts bones list only has the names of the bones right now
    //so we will replace those with references to the bone objects
    for(key in meshparts) {
      var meshpart = meshparts[key];
      for (var i = 0; i < meshpart.bones.length; i++) {
        var bonename = meshpart.bones[i];
        var bone = null;
        for(armatureName in armatures) {
          if(bonename in armatures[armatureName].bones) {
            bone = armatures[armatureName].bones[bonename];
            break;
          }
        }
        if(bone != null) {
          meshpart.bones[i] = bone;
        } else {
          console.error("Could not find bone in armatures! "+ bonename);
        }
      };
    }


    return models;
  }

  //this function will be used to recursively create models for all the children of each node in the nodes list
  function createModelsForNode(node, parent, meshparts, materials) {
    var name = node.id;
    var model = new modelLib.model(name, parent);
    //assosciate all the meshparts that go with this node
    if("parts" in node) {
      for (var i = 0; i < node.parts.length; i++) {
        var nodepart = node.parts[i];
        var loaded_meshpart = meshparts[nodepart.meshpartid];
        var material = materials[nodepart.materialid];

        loaded_meshpart.material = material;
        //place this meshpart that was loaded earlier into this node/model
        model.meshparts[nodepart.meshpartid] = loaded_meshpart;
        if("bones" in nodepart) {
          var bones = [];
          for (var i = 0; i < nodepart.bones.length; i++) {
            bones.push(nodepart.bones[i].node); //only make the meshpart bones list contain the IDs of the bones
          };
          loaded_meshpart.bones = bones;
        }
      };
    }
    loadScaleTransRot(node,model);
    //load all child models for node
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
        if(!(m[1] in attributeDataSizes)) {
          console.error("Found attribute not in known types");
        }
        return [attribute, attributeDataSizes[m[1]]];
      });

      var attribute_lists = {}
      for (var i = 0; i < loaded_mesh.vertices.length;) {
        //loop through the attributes and <length> elements from vertices
        for (var j = 0; j < attributes.length; j++) {
          var attrinfo = attributes[j];
          var attr_id = attrinfo[0];
          var attr_size = attrinfo[1];
          if(!(attr_id in attribute_lists)) {
            attribute_lists[attr_id] = {numComponents: attr_size, data:[]};
          }
          //put <dataSize> push them to the vertex's list for that attribute
          for (var k=0; k < attr_size; k++) {
            attribute_lists[attr_id].data.push(loaded_mesh.vertices[i+k]);
          }
          i+=attr_size;
        };
      }

      //fix the normals and positions from blender coordinates
      //TODO this should be generalized
      for (var i = 0; i < attribute_lists["POSITION"].length; i+=3) {
        var x = attribute_lists["POSITION"][i];
        var y = attribute_lists["POSITION"][i+2];
        var z = -attribute_lists["POSITION"][i+1];
        attribute_lists["POSITION"][i+1] = y;
        attribute_lists["POSITION"][i+2] = z;
      }
      for (var i = 0; i < attribute_lists["NORMAL"].length; i+=3) {
        var x = attribute_lists["NORMAL"][i];
        var y = attribute_lists["NORMAL"][i+2];
        var z = -attribute_lists["NORMAL"][i+1];
        attribute_lists["NORMAL"][i+1] = y;
        attribute_lists["NORMAL"][i+2] = z;
      }

      //create mesh parts that share the attribute_lists
      for(var p = 0; p < loaded_mesh.parts.length; p++) {
        var meshpart = new modelLib.meshpart(attribute_lists, loaded_mesh.parts[p].indices);
        meshparts[loaded_mesh.parts[p].id] = meshpart;
      }
    };
    return meshparts;
  }

  function createArmatureForNode(node) {
    var armature = new bones.armature(node.id);
    loadScaleTransRot(node, armature);
    //load child bones
    if("children" in node) {
      for (var i = 0; i < node.children.length; i++) {
        createBoneForNode(node.children[i], armature, armature);
      };
    }
    return armature;
  }

  function createBoneForNode(node, parent, armature) {
    var bone = new bones.bone3d(node.id, parent, armature);
    loadScaleTransRot(node, bone);
    if("children" in node) {
      for (var i = 0; i < node.children.length; i++) {
        createBoneForNode(node.children[i], bone, armature);
      };
    }
  }

  function loadScaleTransRot(node, entity) {
    if("scale" in node) {
      entity.scale = [node.scale[0], node.scale[2], node.scale[1]];
    }
    if("translation" in node) {
      entity.translation = [node.translation[0], node.translation[2], -node.translation[1]];
    }
    if("rotation" in node) {
      entity.rotation = [node.rotation[0],node.rotation[2], -node.rotation[1],node.rotation[3]];
      //quat.calculateW(entity.rotation, entity.rotation);
      //console.log(entity.rotation);
      //entity.rotation = node.rotation
      //quat.rotateX(entity.rotation, node.rotation, -Math.PI/2);
    }
  }
}( window.g3djLib = window.g3djLib || {}, null ));