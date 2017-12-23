jQuery.sap.require("oui5lib.lib.listHelper");
jQuery.sap.require("oui5lib.configuration");
jQuery.sap.require("oui5lib.request");
jQuery.sap.require("oui5lib.logger");

jQuery.sap.declare("oui5lib.mapping");

/** @namespace oui5lib.mapping */
(function () {
    var listHelper = oui5lib.lib.listHelper;

    /**
     * Get the primary key of the specified entity.
     * @memberof oui5lib.mapping
     * @param {string} entityName The name of the entity.
     * @returns {string} The primaryKey property from the mapping.
     */
    function getPrimaryKey(entityName) {
        return getEntityDefinition(entityName).primaryKey;
    }

    function getPropertyDefinitions(entityName) {
        return getEntityDefinition(entityName).entity;
    }
    
    /**
     * Get the definition of a property.
     * @memberof oui5lib.mapping
     * @param {string} entityName The name of the entity.
     * @param {string} propertyPath The path of the property. Separate levels by '/'.
     * @returns {object} The definition of the property from the mapping.
     */
    function getPropertyDefinition(entityName, propertyPath) {
        var props = getPropertyDefinitions(entityName);

        var keys = propertyPath.split("/");
        if (keys.length > 1) {
            var subprops = props;
            for (var i = 0, s = keys.length; i < s - 1; i++) {
                var subkey = keys[i];

                subprops = listHelper.getItemByKey(subprops, "name", subkey);
                if (subprops === null) {
                    return null;
                }
                switch(subprops.type) {
                case "object":
                    subprops = subprops.objectItem;
                    break;
                case "array":
                    subprops = subprops.arrayItem;
                    break;
                }
            }
            props = subprops;
            propertyPath = keys[keys.length - 1];
        }

        return listHelper.getItemByKey(props, "name", propertyPath);
    }
    
    /**
     * Get the definition of a request.
     * @memberof oui5lib.mapping
     * @param {string} entityName The name of the entity.
     * @param {string} requestName The name of the request.
     * @returns {object} The definition of the request from the mapping.
     */
    function getRequestDefinition(entityName, requestName) {
        return getEntityDefinition(entityName).request[requestName];
    }

    var _mappings = {};

    /**
     * Get the mapping for the given entity. Will try to load the mapping if necessary.
     * @memberof oui5lib.mapping
     * @inner 
     * @param {string} entityName The name of the entity.
     * @returns {object} The mapping object.
     */
    function getEntityDefinition(entityName) {
        if (typeof _mappings[entityName] === "undefined") {
            loadMapping(entityName);
        }
        return _mappings[entityName];
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
            if (data.entity !== undefined) {
                procPropertyArray(data.entity, true);
            }
            if (data.request !== undefined) {
                var requestDefaults = data.request.defaults;
                for (var requestName in data.request) {
                    if (requestName === "defaults") {
                        continue;
                    }
                    var requestDef = data.request[requestName];
                    if (requestDefaults !== undefined) {
                        setRequestDefaults(requestDef, requestDefaults);
                    }
                    if (requestDef.params !== undefined) {
                        procPropertyArray(requestDef.params);
                    }
                }
            }
            _mappings[props.entity] = data;
        }
    }

    function setRequestDefaults(requestDef, requestDefaults) {
        var defaultKeys = ["protocol", "host"];
        defaultKeys.forEach(function(key) {
            if (requestDef[key] === undefined) {
                if (requestDefaults[key] !== undefined) {
                    requestDef[key] = requestDefaults[key];
                }
            }
        });
        if (typeof requestDef.method === "string" &&
            ["GET", "POST"].indexOf(requestDef.method) > -1) {
            return;
        }
        requestDef.method = "GET";
    }
    
    function procPropertyArray(propertyDefs, isEntityProp) {
        if (propertyDefs === undefined) {
            return;
        }
        if (typeof isEntityProp !== "boolean") {
            isEntityProp = false;
        }

        propertyDefs.forEach(function(propertyDef) {
            setPropertyDefaults(propertyDef);
            if (isEntityProp) {
                setEntityPropertyDefaults(propertyDef);
            }
            switch(propertyDef.type) {
            case "array":
                procPropertyArray(propertyDef.arrayItem);
                break;
            case "object":
                procPropertyArray(propertyDef.objectItem);
                break;
            }
        });
    }

    function setPropertyDefaults(propertyDef) {
        if (typeof propertyDef.type === "undefined") {
            propertyDef.type = "string";
        }
        if (typeof propertyDef.required !== "boolean") {
            propertyDef.required = false;
        }
    }

    function setEntityPropertyDefaults(propertyDef) {
        var tests = [];
        if (typeof propertyDef.validate !== "undefined" &&
            propertyDef.validate instanceof Array) {
           tests = propertyDef.validate;
        }
        if (propertyDef.required) {
            tests.push("required");
        }
        if (tests.length > 0) {
            propertyDef.validate = tests;
        }
        
        if (typeof propertyDef.i18n === "undefined") {
            propertyDef.i18n = {};
        }
        if (typeof propertyDef.ui5 === "undefined") {
            propertyDef.ui5 = {};
        }
    }
    
    var mapping = oui5lib.namespace("mapping");
    mapping.getPrimaryKey = getPrimaryKey;
    mapping.getPropertyDefinitions = getPropertyDefinitions;
    mapping.getPropertyDefinition = getPropertyDefinition;
    mapping.getRequestDefinition = getRequestDefinition;
}());

