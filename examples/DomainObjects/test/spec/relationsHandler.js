describe("RelationsHandler object", function() {
   var loader = oum.loader;
   beforeAll(function() {
      spyOn(oui5lib.request, "sendMappingRequest");
   });
   beforeEach(function() {
      oum.addresses.resetData();
      oum.products.resetData();
      oui5lib.request.sendMappingRequest.calls.reset();
   });

   it ("should request referenced product and address data of orders", function() {
      oum.relationsHandler.processOrderReferences(oum.fixture.ordersData);
      expect(oui5lib.request.sendMappingRequest.calls.count()).toEqual(2);
      expect(oui5lib.request.sendMappingRequest)
         .toHaveBeenCalledWith("address", "getAddresses",
                               {"ids": [ 1, 2, 3] },
                               loader.handleSuccessfulResponse);
      expect(oui5lib.request.sendMappingRequest)
         .toHaveBeenCalledWith("product", "getProducts",
                               {"isbns": [ "0394718747", "0889610356", "1859847390"] },
                               loader.handleSuccessfulResponse);
   });

   it ("should handle incoming data and publish related events", function() {
      oum.relationsHandler.clearMissingData();
      oum.relationsHandler.processOrderReferences(oum.fixture.ordersData);

      spyOn(oui5lib.event, "publishReadyEvent");

      oum.relationsHandler.onDataLoaded("address",
                                        [ { id: 1 }, { id: 2 }, { id: 3 } ]);
      oum.relationsHandler.onDataLoaded("product",
                                        [ { isbn: "0394718747" },
                                          { isbn: "0889610356" } ]);
      expect(oui5lib.event.publishReadyEvent.calls.count()).toEqual(1);
      expect(oui5lib.event.publishReadyEvent)
         .toHaveBeenCalledWith({ entity: "order", id: "1" });

      
      oum.relationsHandler.onDataLoaded("product",
                                        [ { isbn: "1859847390" } ]);
      expect(oui5lib.event.publishReadyEvent.calls.count()).toEqual(3);
      expect(oui5lib.event.publishReadyEvent)
         .toHaveBeenCalledWith({ entity: "order", id: "2" });
      expect(oui5lib.event.publishReadyEvent)
         .toHaveBeenCalledWith( "orders" );
   });
});
