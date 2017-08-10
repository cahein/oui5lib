jQuery.sap.require("oum.config");
jQuery.sap.declare("oum.lib.configuration");

(function() {
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
      var component = getComponent();
      var appConfig = component.getManifestEntry("sap.app");
      
      var appModel = new sap.ui.model.json.JSONModel({
         appTitle: appConfig.title,
         appVersion: appConfig.applicationVersion.version,
         openui5Version: sap.ui.version
      });

      return appModel;
   }

   var configuration = oum.namespace("lib.configuration");
   configuration.getAppInfoModel = getAppModel;
   configuration.getEntryPoints = getTilesDef;
}());
