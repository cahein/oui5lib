sap.ui.define([
    "sap/ui/core/UIComponent",
    "ooooo/Router",
    "oui5lib",
    "ooooo/lib/configuration"
], function (UIComponent) {
    const Component = UIComponent.extend("ooooo.Component", {
        metadata: { 
            manifest: "json"
        }
    });

    ooooo.Component.prototype.init = function() {
        UIComponent.prototype.init.apply(this, arguments);

        const ui5Configuration = sap.ui.getCore().getConfiguration();
        var languageCode = ui5Configuration.getLanguage();
        if (typeof languageCode === "string" && languageCode.length > 2) {
            languageCode = languageCode.substring(0, 2).toLowerCase();
        }
        oui5lib.configuration.setCurrentLanguage(languageCode);

        this.getRouter().initialize();
    };
    
    ooooo.Component.prototype.createContent = function() {
        return sap.ui.view({
            viewName : "ooooo.view.app",
            type : "XML"
        });
    };
    return Component;
});
