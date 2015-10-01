(function( modelLib, $, undefined ) { 
  //Public Object Creator
  modelLib.model = function(meshparts) {
    this.meshparts = meshparts || {};
  }

  modelLib.model.prototype.draw = function(renderer) {
    for (key in this.meshparts) {
      var meshpart = this.meshparts[key];
      meshpart.draw(renderer);
    }
  }

  modelLib.meshpart = function(vertices, indices, vertex_type, bones) {
    this.vertices = vertices || [];
    this.indices = indices || [];
    this.vertex_type = vertex_type || "TRIANGLES";
    this.bones = bones || [];
  }

  modelLib.meshpart.prototype.draw = function(renderer) {
    for (var i = 0; i < this.indices.length; i+=3) {
      var indice1 = this.indices[i];
      var indice2 = this.indices[i+1];
      var indice3 = this.indices[i+2];
      var vertex1 = this.vertices[indice1];
      var vertex2 = this.vertices[indice2];
      var vertex3 = this.vertices[indice3];
      prepareVertexForRender(vertex1);
      prepareVertexForRender(vertex2);
      prepareVertexForRender(vertex3);
      renderer.addTriangle(vertex1,vertex2,vertex3);
    };
  }

  function prepareVertexForRender(vertex) {
    //would do bone / parent transforms on vertexes here if I was doing them
    vec4.set(vertex.transformedPos, 0,0,0,1);
    vec3.set(vertex.transformedNormal, 0,0,0);
    //copy first attribute from list of NORMAL and POSITION
    vec3.add(vertex.transformedPos, vertex.transformedPos, vertex.POSITION[0]);
    vec3.add(vertex.transformedNormal, vertex.transformedNormal, vertex.NORMAL[0]);
  }

}( window.modelLib = window.modelLib || {}, null ));