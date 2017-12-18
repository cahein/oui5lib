describe("Loader object", function() {
    beforeAll(function() {
        oum.orders.resetData();
        oum.addresses.resetData();
        oum.products.resetData();

        spyOn(oui5lib.request, "doRequest");
    });

    it ("should request orders data by startDate", function() {
        oui5lib.request.doRequest.calls.reset();

        var startDate = "2017-09-11";
        oum.loader.requestOrders(startDate);
        expect(oui5lib.request.doRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.doRequest)
            .toHaveBeenCalledWith("order", "getOrders",
                                  {"startDate": startDate },
                                  oum.loader.dataRequestSucceeded);
    });

    it ("should request products data by an array of product ids", function() {
        oui5lib.request.doRequest.calls.reset();
        
        var ids = ["0871132532", "0853455341", "080613125"];
        oum.loader.requestProducts(ids);
        expect(oui5lib.request.doRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.doRequest)
            .toHaveBeenCalledWith("product", "getProducts",
                                  {"isbns": ids },
                                  oum.loader.dataRequestSucceeded);
    });

    it ("should request addresses data by an array of address ids", function() {
        oui5lib.request.doRequest.calls.reset();

        var ids = [1, 2];
        oum.loader.requestAddresses(ids);
        expect(oui5lib.request.doRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.doRequest)
            .toHaveBeenCalledWith("address", "getAddresses",
                                  { "ids": ids },
                                  oum.loader.dataRequestSucceeded);
    });
});
