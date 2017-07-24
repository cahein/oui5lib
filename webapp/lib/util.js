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
    var util = oui5lib.namespace("util");
    util.getComponentRouter = getComponentRouter;
}());
