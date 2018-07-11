describe("Namespace oum.do.RefsHandler", function() {
   beforeAll(function() {
      oum.do.orders.addData(oum.fixture.ordersData);

      spyOn(oui5lib.event, "publishReadyEvent");
      spyOn(oum.do.Loader, "loadAddresses");
      spyOn(oum.do.Loader, "loadProducts");
   });
   beforeEach(function() {
      oum.do.addresses.resetData();
      oum.do.products.resetData();
      oui5lib.event.publishReadyEvent.calls.reset();
      oum.do.Loader.loadAddresses.calls.reset();
      oum.do.Loader.loadProducts.calls.reset();
      oum.do.RefsHandler.clearMissingData();
   });

   it ("should call the Loader to fetch referenced product and address data of orders", function() {
      oum.do.RefsHandler.processOrderReferences(oum.fixture.ordersData);

      expect(oum.do.Loader.loadAddresses.calls.count()).toEqual(1);
      expect(oum.do.Loader.loadAddresses)
         .toHaveBeenCalledWith([ 1, 2, 3]);
      
      expect(oum.do.Loader.loadProducts.calls.count()).toEqual(1);
      expect(oum.do.Loader.loadProducts)
         .toHaveBeenCalledWith([ "0394718747", "0889610356", "1859847390"]);
   });

   it ("should add address names to orders and publish events", function() {
      oum.do.addresses.addData(oum.fixture.addressesData);
      oum.do.products.addData(oum.fixture.productsData);

      spyOn(oum.do.orders, "procAddresses");
      
      oum.do.RefsHandler.processOrderReferences(oum.fixture.ordersData);

      expect(oui5lib.event.publishReadyEvent.calls.count()).toEqual(3);
      expect(oui5lib.event.publishReadyEvent)
         .toHaveBeenCalledWith({ entity: "order", id: 1 });
      expect(oui5lib.event.publishReadyEvent)
         .toHaveBeenCalledWith({ entity: "order", id: 2 });
      expect(oui5lib.event.publishReadyEvent)
         .toHaveBeenCalledWith("orders");

      expect(oum.do.orders.procAddresses.calls.count()).toEqual(2);
   });


   
   it ("should publish events when order references are resolved", function() {
      oum.do.RefsHandler.processOrderReferences(oum.fixture.ordersData);

      oum.do.RefsHandler.handleDataLoaded("address",
                                      [ { id: 1 }, { id: 2 }, { id: 3 } ]);
      oum.do.RefsHandler.handleDataLoaded("product",
                                      [ { isbn: "0394718747" },
                                        { isbn: "0889610356" } ]);

      expect(oui5lib.event.publishReadyEvent.calls.count()).toEqual(1);
      expect(oui5lib.event.publishReadyEvent)
         .toHaveBeenCalledWith({ entity: "order", id: 1 });

      
      oum.do.RefsHandler.handleDataLoaded("product",
                                      [ { isbn: "1859847390" } ]);
      expect(oui5lib.event.publishReadyEvent.calls.count()).toEqual(3);
      expect(oui5lib.event.publishReadyEvent)
         .toHaveBeenCalledWith({ entity: "order", id: 2 });
      expect(oui5lib.event.publishReadyEvent)
         .toHaveBeenCalledWith( "orders" );
   });
});
