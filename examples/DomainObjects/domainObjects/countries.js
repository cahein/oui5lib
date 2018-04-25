/** @namespace oum.do.countries */
(function() {
   const primaryKey = oui5lib.mapping.getPrimaryKey("country");
   const listBase = oui5lib.listBase.getObject(primaryKey);

   let countries = oum.namespace("do.countries");
   countries = oui5lib.util.extend(countries, listBase);

   let _initialized = false;
   function init(data) {
      if (data instanceof Array) {
         countries.addData(data, true);
         _initialized = true;
         
         oui5lib.event.publishReadyEvent("countries");
      }
   }
   countries.init = init;
   
   function isInitialized() {
      return _initialized;
   }
   countries.isInitialized = isInitialized;
}());

oum.do.Loader.loadCountries();
