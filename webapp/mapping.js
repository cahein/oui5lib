jQuery.sap.require("oui5lib.request");
jQuery.sap.require("oui5lib.configuration");
jQuery.sap.require("oui5lib.logger");
jQuery.sap.require("oui5lib.lib.listHelper");

jQuery.sap.declare("oui5lib.mapping");

/** @namespace oui5lib.mapping */
(function () {
    var mappings = {};
    /**
     * Get the mapping for the given entity. Will try to load the mapping if necessary.
     * @memberof oui5lib.mapping
     * @param {string} entityName The name of the entity.
     * @returns {object} The mapping object.
     */
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

    function getPropertyDefinition(entityName, propertyName) {
        var defs = getDefinition(entityName);
        var props = defs.entity;
        var def = oui5lib.listHelper.getItemByKey(props, "name", propertyName);

        if (typeof def.type === "undefined") {
            def.type = "string";
        }
        var tests = [];
        if (typeof def.validate !== "undefined") {
            if (def.validate instanceof Array) {
                tests = def.validate;
            }
        }
        
        if (typeof def.required !== "boolean") {
            def.required = false;
        }
        if (def.required && tests.indexOf("required") === -1) {
            tests.push("required");
        }

        if (typeof def.i18n === "undefined") {
            def.i18n = {};
        }
        if (typeof def.ui5 === "undefined") {
            def.ui5 = {};
        }
        return def;
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
    mapping.getPropertyDefinition = getPropertyDefinition;
    mapping.getRequestDef = getRequestDefinition;
}());

