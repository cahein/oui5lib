jQuery.sap.require("oui5lib.init");

jQuery.sap.require("oum.lib.configuration");
jQuery.sap.require("oum.Router");

sap.ui.define([
    "sap/ui/core/UIComponent"
], function (UIComponent) {
    var Component = UIComponent.extend("oum.Component", {
        metadata: { 
            manifest: "json",
            async: true
        }
    });

    oum.Component.prototype.init = function() {
        UIComponent.prototype.init.apply(this, arguments);

        var oConfiguration = sap.ui.getCore().getConfiguration();
        var sLanguage = oConfiguration.getLanguage();
        if (typeof sLanguage === "string" &&
            sLanguage.length > 2) {
            sLanguage = sLanguage.substring(0, 2).toLowerCase();
        }
        oui5lib.configuration.setCurrentLanguage(sLanguage);

        // model for Footer
        this.setModel(oum.lib.configuration.getAppInfoModel(),
                      "appInfo");

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
