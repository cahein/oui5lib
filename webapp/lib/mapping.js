jQuery.sap.require("oui5lib.request");
jQuery.sap.require("oui5lib.configuration");
jQuery.sap.require("oui5lib.logger");

jQuery.sap.declare("oui5lib.mapping");

(function () {
    var mappings = {};

    function getDefinition(entityName) {
        if (typeof mappings[entityName] === "undefined") {
            loadMapping(entityName);
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

    function loadMapping(entityName) {
        var dir = oui5lib.configuration.getMappingDir();
        var uri = dir + "/" + entityName + ".json";
        oui5lib.logger.info("load mapping: " + uri);
        oui5lib.request.loadJson(uri, mappingLoaded, { entity: entityName }, false);
    }
    
    function mappingLoaded(data, props) {
        if (typeof data === "object") {
            if (props !== undefined && typeof props.entity === "string") {
                mappings[props.entity] = data;
            }
        }
    }

    var mapping = oui5lib.namespace("mapping");
    mapping.getDef = getDefinition;
    mapping.getPrimaryKey = getPrimaryKey;
    mapping.getRequestDef = getRequestDefinition;
}());

