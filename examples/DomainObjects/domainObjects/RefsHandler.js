jQuery.sap.require("oum.do.addresses");
jQuery.sap.require("oum.do.products");

(function() {
   /** @namespace oum.do.RefsHandler */
   const refsHandler = oum.namespace("do.RefsHandler");

   let _missingData = {};

   function procOrders(orders) {
      const addressTypes = oum.do.orders.getAddressTypes();

      const addressesToLoad = [];
      const productsToLoad = [];

      let isOrderComplete, addressId;
      orders.forEach(function(order) {
         isOrderComplete = true;
         
         addressTypes.forEach(function(addressType) {
            addressId = order[addressType + "AddressId"];
            if (addressId !== null &&
                !oum.do.addresses.isItemLoaded(addressId)) {
               isOrderComplete = false;
               if (addressesToLoad.indexOf(addressId) === -1) {
                  addressesToLoad.push(addressId);
                  addToMissing(order.id, "address", addressId);
               }
            }
         });
         const items = order.items;
         items.forEach(function(item) {
            const productId = item.productId;
            if (!oum.do.products.isItemLoaded(productId)) {
               isOrderComplete = false;
               if (productsToLoad.indexOf(productId) === -1) {
                  productsToLoad.push(productId);
                  addToMissing(order.id, "product", productId);
               }
            }
         });
         if (isOrderComplete) {
            completeOrder(order.id);
         }
      });

      if (addressesToLoad.length > 0) {
         oum.do.Loader.loadAddresses(addressesToLoad);
      }
      if (productsToLoad.length > 0) {
         oum.do.Loader.loadProducts(productsToLoad);
      }
      if (addressesToLoad.length === 0 && productsToLoad.length === 0) {
         oui5lib.event.publishReadyEvent("orders");
      }
   }
   refsHandler.processOrderReferences = procOrders;

   function handleDataLoaded(entityName, data) {
      data.forEach(function(item) {
         switch(entityName) {
         case "address":
            resolveMissing(entityName, item.id);
            break;
         case "product":
            resolveMissing(entityName, item.isbn);
            break;
         case "status":
            updateOrderStatuses();
            break;
         }
      });
   }
   refsHandler.handleDataLoaded = handleDataLoaded;



   function addToMissing(orderId, entityName, id) {
      const idString = "order" + orderId;
      if (_missingData[idString] === undefined) {
         _missingData[idString] = {};
      }
      const orderEntry = _missingData[idString];
      if (orderEntry[entityName] === undefined) {
         orderEntry[entityName] = [ id ]; 
      } else {
         const ids = orderEntry[entityName];
         if (ids.indexOf(id) == "-1") {
            ids.push(id);
         }
      }
   }
   
   function resolveMissing(entity, id) {
      let idString, orderId,  orderMissing, ids, pos;
      let count = 0;
      for (idString in _missingData) {
         count++;
         orderMissing = _missingData[idString];
         if (typeof orderMissing[entity] !== "undefined") {
            ids = orderMissing[entity] ;
            pos = ids.indexOf(id);
            if (pos > -1) {
               ids.splice(pos, 1);

               if (ids.length === 0) {
                  delete orderMissing[entity];
                  if (!orderMissing.hasOwnProperty("address") &&
                      !orderMissing.hasOwnProperty("product")) {
                     orderId = parseInt(idString.substring(5));
                     completeOrder(orderId);
                     delete _missingData[idString];
                     count--;
                  }
               }
            }
         }
      }
      if (count === 0) {
         oui5lib.event.publishReadyEvent("orders");
      }
   }
   
   function updateOrderStatuses() {
      const orders = oum.do.orders.getData();
      if (orders === null) {
         return;
      }
      orders.forEach(function(order) {
         oum.do.orders.procStatus(order);
      });
   }
   
   function completeOrder(orderId) {
      const order = oum.do.orders.getItem(orderId);
      if (order !== null) {
         oum.do.orders.procAddresses(order);
         oui5lib.event.publishReadyEvent({
            entity: "order",
            id: orderId
         });
      }
   }

   function clearMissingData() {
      _missingData = {};
   }
   refsHandler.clearMissingData = clearMissingData;
}());
