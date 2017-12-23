describe("Loader object", function() {
    var loader = oum.loader;
    beforeAll(function() {
        spyOn(oui5lib.request, "sendMappingRequest");
    });

    beforeEach(function() {
        oui5lib.request.sendMappingRequest.calls.reset();
    });
    
    it ("should call the function to request orders data by startDate", function() {
        loader.loadOrders(oum.fixture.startDate);
        expect(oui5lib.request.sendMappingRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.sendMappingRequest)
            .toHaveBeenCalledWith("order", "getOrders",
                                  { "startDate": oum.fixture.startDate },
                                  loader.handleSuccessfulResponse);
    });

    it ("should call the function to request orders by startDate and endDate", function() {
        loader.loadOrders(oum.fixture.startDate,
                          oum.fixture.endDate);
        expect(oui5lib.request.sendMappingRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.sendMappingRequest)
            .toHaveBeenCalledWith("order", "getOrders",
                                  { "startDate": oum.fixture.startDate,
                                    "endDate": oum.fixture.endDate },
                                  loader.handleSuccessfulResponse);
    });
    
    it ("should call the function to request orders by startDate and status", function() {
        loader.loadOrders(oum.fixture.startDate,
                          null,
                          oum.fixture.status);
        expect(oui5lib.request.sendMappingRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.sendMappingRequest)
            .toHaveBeenCalledWith("order", "getOrders",
                                  { "startDate": oum.fixture.startDate,
                                    "status": oum.fixture.status },
                                  loader.handleSuccessfulResponse);
    });
    
    it ("should call the function to request orders even if the required parameter startDate is omitted", function() {
        loader.loadOrders(null);
        expect(oui5lib.request.sendMappingRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.sendMappingRequest)
            .toHaveBeenCalledWith("order", "getOrders",
                                  { "startDate": null },
                                  loader.handleSuccessfulResponse);
    });

    it ("should request products data by an array of product ids", function() {
        oui5lib.request.sendMappingRequest.calls.reset();
        
        var ids = ["0871132532", "0853455341", "080613125"];
        oum.loader.loadProducts(ids);
        expect(oui5lib.request.sendMappingRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.sendMappingRequest)
            .toHaveBeenCalledWith("product", "getProducts",
                                  {"isbns": ids },
                                  loader.handleSuccessfulResponse);
    });

    it ("should request addresses data by an array of address ids", function() {
        oui5lib.request.sendMappingRequest.calls.reset();

        var ids = [1, 2];
        oum.loader.loadAddresses(ids);
        expect(oui5lib.request.sendMappingRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.sendMappingRequest)
            .toHaveBeenCalledWith("address", "getAddresses",
                                  { "ids": ids },
                                  loader.handleSuccessfulResponse);
    });
});
