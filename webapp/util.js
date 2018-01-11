/** @namespace oui5lib.util */
(function (configuration) {
    function isUI5Loaded() {
        if (typeof sap === "object" && typeof sap.ui === "object") {
            return true;
        }
        return false;
    }
    
    /**
     * Get the Router for the configured Component {@link oui5lib.configuration.getComponent}.
     * @memberof oui5lib.util
     */
    function getComponentRouter() {
        let component = configuration.getComponent();
        if (component !== null) {
            return component.getRouter();
        }
        return null;
    }
    
    /**
     * Get the EventBus for the configured Component {@link oui5lib.configuration.getComponent}.
     * @memberof oui5lib.util
     */
    function getComponentEventBus() {
        let component = configuration.getComponent();
        if (component !== null) {
            return component.getEventBus();
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
        let component = configuration.getComponent();
        let i18nModel = component.getModel("i18n");
        return i18nModel.getProperty(path);
    }
    
    /**
     * Get a JSONModel for the given data.
     * @memberof oui5lib.util
     * @param {object} data The data to set to the model.
     * @returns {sap.ui.model.json.JSONModel} The JSONModel.
     */
    function getJsonModelForData(data) {
        let model = new sap.ui.model.json.JSONModel();
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
        let filters = [];
        if (isBlank(search)) {
            return filters;
        }
        if (typeof operator === "undefined") {
            operator = "Contains";
        }
        const allowedOperators = [ "Contains", "EndsWith", "EQ", "NE", "StartsWith" ];
        if (allowedOperators.indexOf(operator) === -1) {
            return filters;
        }
        let subFilters = [];
        for (let i = 0, s = fields.length; i < s; i++) {
            let field = fields[i];
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
        let prop, propKey;
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
        for (let i = 1; i < arguments.length; i++) {
            for (let key in arguments[i]) {
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

    /**
     * Tests if value is null or empty.
     * @memberof oui5lib.util
     * @param value The value to be tested.
     * @returns {boolean}
     */
    function isBlank(value) {
        if (typeof value === "undefined" || value === null) {
            return true;
        }
        if (typeof value === "object") {
            throw new TypeError("The given value is not a string");
        }
        if (typeof value === "string") {
            for (let i = 0; i < value.length; i++) {
                let c = value.charAt(i);
                if (c != " " && c != "\n" && c != "\t") {
                    return false;
                }
            }
        }
        return true;
    }

    let util = oui5lib.namespace("util");
    util.isUI5Loaded = isUI5Loaded;
    util.getComponentRouter = getComponentRouter;
    util.getComponentEventBus = getComponentEventBus;
    util.getI18nText = getI18nText;
    util.getJsonModelForData = getJsonModelForData;
    util.getFilterArray = getFilterArray;

    util.isBlank = isBlank;
    util.deepFreeze = deepFreeze;
    util.extend = extend;
}(oui5lib.configuration));
