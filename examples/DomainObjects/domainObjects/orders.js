jQuery.sap.require("oum.do.addresses");
jQuery.sap.require("oum.do.products");
jQuery.sap.require("oum.do.statuses");
jQuery.sap.require("oum.do.Address");
jQuery.sap.require("oum.do.Product");

(function() {
   const primaryKey = oui5lib.mapping.getPrimaryKey("order");
   const listBase = oui5lib.listBase.getObject(primaryKey);

   /** @namespace oum.do.orders */
   let orders = oum.namespace("do.orders");
   orders = oui5lib.util.extend(orders, listBase);

   function procData(orders) {
      const orderDateSpec = oui5lib.mapping.getEntityAttributeSpec("order",
                                                                   "orderDate");
      orders.forEach(function(order) {
         const orderDateString = order.orderDate;
         if (typeof orderDateSpec.dateFormat === "string") {
            order.orderDate = oui5lib.formatter.getDateFromString(orderDateString,
                                                                  orderDateSpec.dateFormat);
         } else {
            order.orderDate = new Date(orderDateString);
         }

         order.total = calculateOrderTotal(order.items);

         procStatus(order);
      });
   }
   orders.registerProcFunction(procData);
   

   function processReferences() {
      oum.do.RefsHandler.processOrderReferences(this.getData());
   }
   orders.addDataChangedListener(processReferences, orders);
   

   const _addressTypes = ["billing", "shipping"];
   function getAddressTypes() {
      return _addressTypes;
   }
   orders.getAddressTypes = getAddressTypes;

   function procAddresses(order) {
      let address, addressId;
      getAddressTypes().forEach(function(type) {
         addressId = order[type + "AddressId"];
         if (oum.do.addresses.isItemLoaded(addressId)) {
            address = new oum.do.Address(addressId);
            order[type + "Name"] = address.getName();
         }
      });
   }
   orders.procAddresses = procAddresses;


   function calculateOrderTotal(items) {
      let total = 0.00;
      items.forEach(function(item) {
         const quantity = item.quantity;
         const price = item.unitPrice;
         total += quantity * price;
      });
      return total.toFixed(2);
   }
   orders.calculateOrderTotal = calculateOrderTotal;

   
   function procStatus(order) {
      if (oum.do.statuses.isInitialized()) {
         const status = order.status;
         const statusItem = oum.do.statuses.getItem(status);
         order.statusText = statusItem.statusText;
         order.valueState = statusItem.valueState; 
      }
   }
   orders.procStatus = procStatus;
}());
