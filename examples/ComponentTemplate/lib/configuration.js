jQuery.sap.require("oum.lib.init");
jQuery.sap.declare("oum.lib.configuration");

(function() {
    const configuration = oum.namespace("lib.configuration");

    function getComponent() {
       return sap.ui.getCore().getComponent("oumComponent");
    }
   
    function getTilesDef() {
        if (oum.config.entryPoints !== "undefined") {
            return oum.config.entryPoints;
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
