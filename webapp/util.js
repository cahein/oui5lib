jQuery.sap.require("oui5lib.configuration");

jQuery.sap.declare("oui5lib.util");

/** @namespace oui5lib.util */
(function () {

    /**
     * Get the Router for the configured Component.
     * @memberof oui5lib.utii
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
     * @memberof oui5lib.utii
     */
    function getI18nText(key) {
        var component = oui5lib.configuration.getComponent();
        var i18nModel = component.getModel("i18n");
        return i18nModel.getProperty(key);
    }
    function getJsonModelForData(data) {
        var model = new sap.ui.model.json.JSONModel();
        if (data.length > 100) {
            model.setSizeLimit(data.length);
        }
        model.setData(data);
        return model;
    }
    
    /**
     * Use if an object needs to be immutable.
     * @param {object} o The object to be frozen.
     */
    function deepFreeze(o) {
        var prop, propKey;
        Object.freeze(o);
        for (propKey in o) {
            prop = o[propKey];
            if (!(o.hasOwnProperty(propKey) && (typeof prop === 'object')) ||
                Object.isFrozen(prop)) {
                continue;
            }
            this.deepFreeze(prop);
        }
    }
    
    var util = oui5lib.namespace("util");
    util.getComponentRouter = getComponentRouter;
    util.getI18nText = getI18nText;
    util.getJsonModelForData = getJsonModelForData;
    util.deepFreeze = deepFreeze;
}());
