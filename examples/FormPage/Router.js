sap.ui.define([
   "sap/m/routing/Router"
], function (mRouter) {
   mRouter.extend("oum.Router", {
      constructor: function() {
         mRouter.apply(this, arguments);
      },

      vNavTo : function(sName, oParameters={}, bReplace=false) {
         var route = this.getRoute(sName);
         if (typeof route === "undefined") {
            this.navTo("noRoute");
         } else {
            if (oParameters === undefined) {
               oParameters = {};
            }
            this.navTo(sName, oParameters, bReplace);
         }
      },
      
      navBack : function() {
         var oHistory = sap.ui.core.routing.History.getInstance();
         var sPreviousHash = oHistory.getPreviousHash();

         if (typeof sPreviousHash === "undefined") {
            this.navTo("home", {}, true);
         } else {
            window.history.go(-1);
         }
      },

      destroy: function() {
         mRouter.prototype.destroy.apply(this, arguments);
      }
   });
});
