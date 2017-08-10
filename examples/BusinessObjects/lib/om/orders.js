/** @namespace oum.orders */
(function() {
   var addressesLoading = [];
   
   /**
    * Initialize the orders object.
    * @function oum.orders.init
    * @param {Array} data The orders array.
    */
   function init(data) {
      if (data.results) {
         var ordersData = data.results;
         if (ordersData instanceof Array) {
            orders.setData(ordersData);
            procData(ordersData);
         }
      }
   }

   function procData(ordersData) {
      var addressIds = [];
      for (var i = 0, s = ordersData.length; i < s; i++) {
         var order = ordersData[i];
         // convert date

         var addressId = order.customerAddressId;
         if (oum.addresses.getItem(addressId) === null) {
            addressIds.push(addressId);
         }
         if (addressId !== order.billingAddressId) {
            addressId = order.billingAddressId;
            if (oum.addresses.getItem(addressId) === null) {
               addressIds.push(addressId);
            }
         }
      }
      if (addressIds.length > 0) {
         addressesLoading = addressIds;
         oum.addresses.load(addressIds);
      }
      try {
         orders.publishReadyEvent("orders");
      } catch(e) {
         oui5lib.logger.info(e.message);
      }
   }

   function setAddressLoaded(addressId) {
      var pos = addressesLoading.indexOf(addressId);
      if (pos > -1) {
         addressesLoading.splice(pos, 1);
      }
      if (addressesLoading.length === 0) {
         try {
            orders.publishReadyEvent("orderAddresses");
         } catch(e) {
            oui5lib.logger.info(e.message);
         }
      }
   }
   
   var primaryKey = oui5lib.mapping.getPrimaryKey("order");
   var listBase = oui5lib.listBase.getObject(primaryKey);
   listBase.registerProcFunction(procData);
   
   var orders = oum.namespace("orders");
   orders = jQuery.extend(orders, listBase);
   
   orders.init = init;
   orders.setAddressLoaded = setAddressLoaded;
   
}());
