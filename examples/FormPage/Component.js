sap.ui.define([
    "sap/ui/core/UIComponent",
    "oum/Router",
    "oui5lib",
    "oum/lib/configuration"
], function (UIComponent) {
    var Component = UIComponent.extend("oum.Component", {
        metadata: { 
            manifest: "json",
            async: true
        }
    });

    oum.Component.prototype.init = function() {
        UIComponent.prototype.init.apply(this, arguments);

        var ui5Configuration = sap.ui.getCore().getConfiguration();
        var languageCode = ui5Configuration.getLanguage();
        if (typeof languageCode === "string" && languageCode.length > 2) {
            languageCode = languageCode.substring(0, 2).toLowerCase();
        }
        oui5lib.configuration.setCurrentLanguage(languageCode);

        // initialize the oum.Router
        this.getRouter().initialize();
    };
    
    oum.Component.prototype.createContent = function() {
        return sap.ui.view({
            viewName : "oum.view.app",
            type : "XML"
        });
    };
    return Component;
});
