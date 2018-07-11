jQuery.sap.require("oum.do.RefsHandler");

(function(RefsHandler) {
   /** @namespace oum.do.Loader */
   const loader = oum.namespace("do.Loader");

   function loadOrder(orderId) {
      oui5lib.request.sendMappingRequest(
         "order", "getOrder",
         { "id": orderId },
         handleSuccessfulResponse
      );
   }
   function queryOrders(query) {
      oui5lib.request.sendMappingRequest(
         "order", "getOrders",
         query,
         handleSuccessfulResponse
      );
   }

   function loadAddress(addressId) {
      loadAddresses([addressId]);
   }
   function loadAddresses(addressIds, reset) {
      if (getReset(reset)) {
         oum.do.addresses.resetData();
      }
      oui5lib.request.sendMappingRequest(
         "address", "getAddresses",
         { "ids": addressIds },
         handleSuccessfulResponse
      );
   }

   function loadProduct(productId) {
      loadProducts([productId]);
   }
   function loadProducts(productIds, reset) {
      if (getReset(reset)) {
         oum.do.products.resetData();
      }
      oui5lib.request.sendMappingRequest(
         "product", "getProducts",
         { "isbns": productIds },
         handleSuccessfulResponse
      );
   }
   
   function loadStatuses() {
      oui5lib.request.sendMappingRequest(
         "status", "getStatuses",
         null,
         handleSuccessfulResponse);
   }

   function loadCountries() {
      oui5lib.request.sendMappingRequest(
         "country", "getCountries",
         null,
         handleSuccessfulResponse);
   }

   function getReset(reset) {
      if (typeof reset === "boolean" && reset) {
         return true;
      }
      return false;
   }

   function handleSuccessfulResponse(responseObject, requestInfo) {
      const entity = requestInfo.entity;
      if (responseObject.result) {
         let data = responseObject.value;
         if (!(data instanceof Array) && data instanceof Object) {
            data = [ data ];
         }
         
         if (data.length === 0) {
            oui5lib.logger.info("Empty data for entity: " + entity);
            oui5lib.event.publishReadyEvent(entity);
         }

         switch(entity) {
         case "order":
            oum.do.orders.addData(data);
            break;
         case "product":
            oum.do.products.addData(data);
            break;
         case "address":
            oum.do.addresses.addData(data);
            break;
         case "status":
            oum.do.statuses.init(data);
            break;
         case "country":
            oum.do.countries.init(data);
            break;
         default:
            break;
         }
         RefsHandler.handleDataLoaded(entity, data);
      } else {
         oui5lib.logger.error("Data service error");
         oui5lib.messages.showErrorMessage("No data were returned");
      }
   }
   
   loader.queryOrders = queryOrders;
   loader.loadOrder = loadOrder;
   loader.loadAddress = loadAddress;
   loader.loadAddresses = loadAddresses;
   loader.loadProduct = loadProduct;
   loader.loadProducts = loadProducts;
   loader.loadStatuses = loadStatuses;
   loader.loadCountries = loadCountries;

   // add for testing only
   loader.handleSuccessfulResponse = handleSuccessfulResponse;
}(oum.do.RefsHandler));
