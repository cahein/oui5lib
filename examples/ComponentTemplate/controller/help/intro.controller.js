sap.ui.define([
   "oui5lib/controller/BaseController"
], function(Controller) {
   "use strict";

   var helpIntroController = Controller.extend("oum.controller.help.intro", {
      onInit: function() {
         this.debug("help intro onInit");
      }
   });

   return helpIntroController;
});
