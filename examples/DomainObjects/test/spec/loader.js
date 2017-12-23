describe("Loader object", function() {
    beforeAll(function() {
        spyOn(oui5lib.request, "sendMappingRequest");
    });

    it ("should request orders data by startDate", function() {
        oui5lib.request.sendMappingRequest.calls.reset();

        var startDate = "2017-09-11";
        oum.loader.requestOrders(startDate);
        expect(oui5lib.request.sendMappingRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.sendMappingRequest)
            .toHaveBeenCalledWith("order", "getOrders",
                                  {"startDate": startDate },
                                  oum.loader.handleSuccessfulResponse);
    });

    it ("should request products data by an array of product ids", function() {
        oui5lib.request.sendMappingRequest.calls.reset();
        
        var ids = ["0871132532", "0853455341", "080613125"];
        oum.loader.requestProducts(ids);
        expect(oui5lib.request.sendMappingRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.sendMappingRequest)
            .toHaveBeenCalledWith("product", "getProducts",
                                  {"isbns": ids },
                                  oum.loader.handleSuccessfulResponse);
    });

    it ("should request addresses data by an array of address ids", function() {
        oui5lib.request.sendMappingRequest.calls.reset();

        var ids = [1, 2];
        oum.loader.requestAddresses(ids);
        expect(oui5lib.request.sendMappingRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.sendMappingRequest)
            .toHaveBeenCalledWith("address", "getAddresses",
                                  { "ids": ids },
                                  oum.loader.handleSuccessfulResponse);
    });
});
