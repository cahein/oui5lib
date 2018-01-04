describe("Loader object", function() {
    var loader = oum.do.loader;
    beforeAll(function() {
        spyOn(oui5lib.request, "sendMappingRequest");
    });

    beforeEach(function() {
        oui5lib.request.sendMappingRequest.calls.reset();
    });
    
    it ("should call the function to request orders data by startDate", function() {
        var query = { "startDate": oum.fixture.startDate };
        loader.queryOrders(query);
        expect(oui5lib.request.sendMappingRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.sendMappingRequest)
            .toHaveBeenCalledWith("order", "getOrders",
                                  query,
                                  loader.handleSuccessfulResponse);
    });

    it ("should call the function to request orders by startDate and endDate", function() {
        var query = { "startDate": oum.fixture.startDate,
                      "endDate": oum.fixture.endDate };
        loader.queryOrders(query);
        expect(oui5lib.request.sendMappingRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.sendMappingRequest)
            .toHaveBeenCalledWith("order", "getOrders",
                                  query,
                                  loader.handleSuccessfulResponse);
    });
    
    it ("should call the function to request orders by startDate and status", function() {
        var query = { "startDate": oum.fixture.startDate,
                      "status": oum.fixture.status };
        loader.queryOrders(query);
        expect(oui5lib.request.sendMappingRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.sendMappingRequest)
            .toHaveBeenCalledWith("order", "getOrders",
                                  query,
                                  loader.handleSuccessfulResponse);
    });
    
    it ("should call the function to request orders even if the required parameter startDate is omitted", function() {
        var query = { "status": oum.fixture.status };
        loader.queryOrders(query);
        expect(oui5lib.request.sendMappingRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.sendMappingRequest)
            .toHaveBeenCalledWith("order", "getOrders",
                                  query,
                                  loader.handleSuccessfulResponse);
    });

    it ("should call the function to request an order by the order id", function() {
        oum.do.loader.loadOrder(oum.fixture.orderId);
        expect(oui5lib.request.sendMappingRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.sendMappingRequest)
            .toHaveBeenCalledWith("order", "getOrder",
                                  {"id": oum.fixture.orderId },
                                  loader.handleSuccessfulResponse);
    });
    
    it ("should request products data by an array of product ids", function() {
        var ids = ["0871132532", "0853455341", "080613125"];
        oum.do.loader.loadProducts(ids);
        expect(oui5lib.request.sendMappingRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.sendMappingRequest)
            .toHaveBeenCalledWith("product", "getProducts",
                                  {"isbns": ids },
                                  loader.handleSuccessfulResponse);
    });

    it ("should request addresses data by an array of address ids", function() {
        var ids = [1, 2];
        oum.do.loader.loadAddresses(ids);
        expect(oui5lib.request.sendMappingRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.sendMappingRequest)
            .toHaveBeenCalledWith("address", "getAddresses",
                                  { "ids": ids },
                                  loader.handleSuccessfulResponse);
    });
});
