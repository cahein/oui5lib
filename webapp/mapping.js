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
     * @inner 
     * @param {string} entityName The name of the entity.
     * @returns {object} The mapping object.
     */
    function getDefinition(entityName) {
        if (typeof mappings[entityName] === "undefined") {
            loadMapping(entityName);
        }
        return mappings[entityName];
    }

    /**
     * Get the primary key of the specified entity.
     * @memberof oui5lib.mapping
     * @param {string} entityName The name of the entity.
     * @returns {string} The primaryKey property from the mapping.
     */
    function getPrimaryKey(entityName) {
        var defs = getDefinition(entityName);
        return defs.primaryKey;
    }

    function getPropertyDefinitions(entityName) {
        var defs = getDefinition(entityName);
        return defs.entity;
    }
    
    /**
     * Get the definition of a property.
     * @memberof oui5lib.mapping
     * @param {string} entityName The name of the entity.
     * @param {string} propertyName The name of the property.
     * @returns {object} The definition of the property from the mapping.
     */
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
    
    /**
     * Get the definition of a request.
     * @memberof oui5lib.mapping
     * @param {string} entityName The name of the entity.
     * @param {string} requestName The name of the request.
     * @returns {object} The definition of the request from the mapping.
     */
    function getRequestDefinition(entityName, requestName) {
        var defs = getDefinition(entityName);
        return defs.request[requestName];
    }

    /**
     * Load the mapping file.
     * @memberof oui5lib.mapping
     * @inner 
     * @param {string} entityName The name of the entity.
     */
    function loadMapping(entityName) {
        var dir = oui5lib.configuration.getMappingDir();
        var url = dir + "/" + entityName + ".json";
        oui5lib.logger.info("load mapping: " + url);
        oui5lib.request.loadJson(url, mappingLoaded, { entity: entityName }, false);
    }
    
    /**
     * Called after the mapping file was loaded.
     * @memberof oui5lib.mapping
     * @inner 
     * @param {object} data The data being returned by the request.
     * @param {objects} props The properties linked to the request.
     */
    function mappingLoaded(data, props) {
        if (typeof data === "object") {
            if (props !== undefined && typeof props.entity === "string") {
                mappings[props.entity] = data;
            }
        }
    }

    var mapping = oui5lib.namespace("mapping");
    mapping.getPrimaryKey = getPrimaryKey;
    mapping.getPropertyDefinitions = getPropertyDefinitions;
    mapping.getPropertyDefinition = getPropertyDefinition;
    mapping.getRequestDefinition = getRequestDefinition;
}());

