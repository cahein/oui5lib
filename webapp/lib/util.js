jQuery.sap.require("oui5lib.configuration");

jQuery.sap.declare("oui5lib.util");

(function () {
    function getComponentRouter() {
        var component = oui5lib.configuration.getComponent();
        if (component !== null) {
            return component.getRouter();
        }
        return null;
    }
    
    function getI18nText(key) {
        var component = oui5lib.configuration.getComponent();
        var i18nModel = component.getModel("i18n");
        return i18nModel.getProperty(key);
    }
    
    var util = oui5lib.namespace("util");
    util.getComponentRouter = getComponentRouter;
    util.getI18nText = getI18nText;
}());
