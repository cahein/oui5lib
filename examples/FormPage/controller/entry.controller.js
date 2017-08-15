sap.ui.define([
   "oui5lib/controller/BaseController"
], function(Controller) {
   "use strict";

   var entryController = Controller.extend("oum.controller.entry", {
      onInit: function () {
         this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: function(oEvent) {
         var params = oEvent.getParameters();
         var routeName = params.name;
         if (routeName === "home") {
            this.debug("coming home");
         }
      },
      routeTo : function(oEvent) {
         var tile = oEvent.getSource();
         var routeName = tile.data("routeName");
         
         this.info("navTo: " + routeName);
         this.getRouter().vNavTo(routeName);
      },
      onExit: function() {
         this.info("destroying entry view");
      },
      onBeforeRendering: function() {
         this.info("going to render entry view");
      },
      onAfterRendering: function() {
         this.info(" rendering of entry view is complete");
      }
   });

   return entryController;
});
