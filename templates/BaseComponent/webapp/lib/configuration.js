jQuery.sap.require("ooooo.lib.init");
jQuery.sap.declare("ooooo.lib.configuration");

(function() {
    const configuration = ooooo.namespace("lib.configuration");

    function getComponent() {
        return sap.ui.getCore().getComponent("oooooComponent");
    }
    
    function getTilesDef() {
        if (ooooo.config.entryPoints !== "undefined") {
            return ooooo.config.entryPoints;
        }
        return false;
    }
    
    function getAppModel() {
        const component = getComponent();
        const appConfig = component.getManifestEntry("sap.app");
        
        const appModel = new sap.ui.model.json.JSONModel({
            appTitle: appConfig.title,
            appVersion: appConfig.applicationVersion.version,
            openui5Version: sap.ui.version
        });

        return appModel;
    }
    
    configuration.getEntryPoints = getTilesDef;
    configuration.getAppInfoModel = getAppModel;
}());
