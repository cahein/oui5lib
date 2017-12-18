describe("RelationsHandler object", function() {
    beforeAll(function() {
        oum.orders.resetData();
        oum.addresses.resetData();
        oum.products.resetData();

        spyOn(oui5lib.request, "doRequest");
    });

    it ("should request referenced product and address data of orders", function() {
        oui5lib.request.doRequest.calls.reset();

        oum.relationsHandler.processOrderReferences(oum.ordersData);
        expect(oui5lib.request.doRequest.calls.count()).toEqual(2);
        expect(oui5lib.request.doRequest)
            .toHaveBeenCalledWith("address", "getAddresses",
                                  {"ids": [ 1, 2, 3] },
                                  oum.loader.dataRequestSucceeded);
        expect(oui5lib.request.doRequest)
            .toHaveBeenCalledWith("product", "getProducts",
                                  {"isbns": [ "0394718747", "0889610356", "1859847390"] },
                                  oum.loader.dataRequestSucceeded);
    });

    it ("should handle the relations of incoming data", function() {
        oum.orders.addData(oum.ordersData);
        spyOn(oui5lib.event, "publishReadyEvent");
        oum.relationsHandler.onDataLoaded("address",
                                          [ { id: 1 }, { id: 2 }, { id: 3 } ]);
        oum.relationsHandler.onDataLoaded("product",
                                          [ { isbn: "0394718747" }, { isbn: "0889610356" } ]);
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
