(function () {
   var mappings = {};

   function getDefinition(entityName) {
      if (typeof mappings[entityName] === "undefined") {
         loadMappingData(entityName);
      }
      return mappings[entityName];
   }

   function getPrimaryKey(entityName) {
      var defs = getDefinition(entityName);
      return defs.primaryKey;
   }

   function getRequestDefinition(entityName, requestName) {
      var defs = getDefinition(entityName);
      return defs.request[requestName];
   }

   function loadMappingData(entityName) {
       var dir = oui5lib.configuration.getMappingDir();
       var uri = dir + "/" + entityName + ".json";

       var mapping = oui5lib.request.loadFile(uri);
       alert(uri);
       if (typeof mapping === "object") {
           mappings[entityName] = mapping;
       }
   }
   
   var mapping = oui5lib.namespace("mapping");
   mapping.getDef = getDefinition;
   mapping.getPrimaryKey = getPrimaryKey;
   mapping.getRequestDef = getRequestDefinition;
}());

