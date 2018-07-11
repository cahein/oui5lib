/** @namespace oum.do.statuses */
(function() {
   const primaryKey = oui5lib.mapping.getPrimaryKey("status");
   const listBase = oui5lib.listBase.getObject(primaryKey);

   let statuses = oum.namespace("do.statuses");
   statuses = oui5lib.util.extend(statuses, listBase);

   let _initialized = false;
   
   function init(data) {
      if (data instanceof Array) {
         statuses.addData(data, true);

         if (oui5lib.util.isUI5Env()) {
            addStatusTexts();
            sap.ui.getCore().attachLocalizationChanged(addStatusTexts);
         }

         _initialized = true;
         oui5lib.event.publishReadyEvent("statuses");
      }
   }
   statuses.init = init;
   
   function isInitialized() {
      return _initialized;
   }
   statuses.isInitialized = isInitialized;

   function addStatusTexts() {
      const statusList = statuses.getData();
      statusList.forEach(function(statusItem) {
         statusItem.statusText = oui5lib.util.getI18nText(
            "orderStatus." + statusItem.status);
      });
   }
}());

oum.do.Loader.loadStatuses();
