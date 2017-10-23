jQuery.sap.require("oui5lib.configuration");

jQuery.sap.declare("oui5lib.util");

/** @namespace oui5lib.util */
(function () {

    /**
     * Get the Router for the configured Component {@link oui5lib.configuration.getComponent}.
     * @memberof oui5lib.util
     */
    function getComponentRouter() {
        var component = oui5lib.configuration.getComponent();
        if (component !== null) {
            return component.getRouter();
        }
        return null;
    }
    
    /**
     * Get i18n text.
     * @memberof oui5lib.util
     * @param {string} path The property path.
     * @returns {string} The value of the property.
     */
    function getI18nText(path) {
        var component = oui5lib.configuration.getComponent();
        var i18nModel = component.getModel("i18n");
        return i18nModel.getProperty(path);
    }
    
    /**
     * Get a JSONModel for the given data.
     * @memberof oui5lib.util
     * @param {object} data The data to set to the model.
     * @returns {sap.ui.model.json.JSONModel} The JSONModel.
     */
    function getJsonModelForData(data) {
        var model = new sap.ui.model.json.JSONModel();
        if (data.length > 100) {
            model.setSizeLimit(data.length);
        }
        model.setData(data);
        return model;
    }
   
    /**
     * Get a filter array to search a string in various fields.
     * @memberof oui5lib.util
     * @param {string} search The search string.
     * @param {string|array} fields Array of fieldnames to add to search.
     * @param {string} operator The sap.ui.model.FilterOperator.
     */
    function getFilterArray(search, fields, operator) {
        var filters = [];
        if (oui5lib.validation.isBlank(search)) {
            return filters;
        }
        if (typeof operator === "undefined") {
            operator = "Contains";
        }
        var allowedOperators = [ "Contains", "EndsWith", "EQ", "NE", "StartsWith" ];
        if (allowedOperators.indexOf(operator) === -1) {
            return filters;
        }
        var subFilters = [];
        for (var i = 0, s = fields.length; i < s; i++) {
            var field = fields[i];
            subFilters.push(
                new sap.ui.model.Filter(field, operator, search)
            );
        }
        if (subFilters.length > 0) {
            filters = new sap.ui.model.Filter({
                filters: subFilters,
                and: false
            });
        }  
        return filters;
    }

    /**
     * Use if an object needs to be immutable.
     * @memberof oui5lib.util
     * @param {object} o The object to be frozen.
     */
    function deepFreeze(o) {
        var prop, propKey;
        Object.freeze(o);
        for (propKey in o) {
            prop = o[propKey];
            if (!(o.hasOwnProperty(propKey) && (typeof prop === "object")) ||
                Object.isFrozen(prop)) {
                continue;
            }
            this.deepFreeze(prop);
        }
    }

    function extend(){
        for (var i = 1; i < arguments.length; i++) {
            for (var key in arguments[i]) {
                if(arguments[i].hasOwnProperty(key)) { 
                    if (typeof arguments[0][key] === "object"
                        && typeof arguments[i][key] === "object") {
                        extend(arguments[0][key], arguments[i][key]);
                    } else {
                        arguments[0][key] = arguments[i][key];
                    }
                }
            }
        }
        return arguments[0];
    }
    var util = oui5lib.namespace("util");
    util.getComponentRouter = getComponentRouter;
    util.getI18nText = getI18nText;
    util.getJsonModelForData = getJsonModelForData;
    util.getFilterArray = getFilterArray;
    util.deepFreeze = deepFreeze;
    util.extend = extend;
}());
