describe("Namespace oum.do.Loader", function() {
   const Loader = oum.do.Loader;
   
   beforeAll(function() {
      spyOn(oui5lib.request, "sendMappingRequest");
   });
   afterEach(function() {
      oui5lib.request.sendMappingRequest.calls.reset();
   });

   it ("should call function to request orders data by startDate", function() {
      Loader.queryOrders({ "startDate": oum.fixture.startDate });

      expect(oui5lib.request.sendMappingRequest.calls.count()).toEqual(1);
      expect(oui5lib.request.sendMappingRequest)
         .toHaveBeenCalledWith("order", "getOrders",
                               { "startDate": oum.fixture.startDate },
                               Loader.handleSuccessfulResponse);
   });

   it ("should call function to request orders by startDate and endDate", function() {
      Loader.queryOrders({ "startDate": oum.fixture.startDate,
                          "endDate": oum.fixture.endDate });

      expect(oui5lib.request.sendMappingRequest.calls.count()).toEqual(1);
      expect(oui5lib.request.sendMappingRequest)
         .toHaveBeenCalledWith("order", "getOrders",
                               { "startDate": oum.fixture.startDate,
                                 "endDate": oum.fixture.endDate },
                               Loader.handleSuccessfulResponse);
   });
   
   it ("should call function to request orders by startDate and status", function() {
      Loader.queryOrders({ "startDate": oum.fixture.startDate,
                          "statuses": oum.fixture.statuses });

      expect(oui5lib.request.sendMappingRequest.calls.count()).toEqual(1);
      expect(oui5lib.request.sendMappingRequest)
         .toHaveBeenCalledWith("order", "getOrders",
                               { "startDate": oum.fixture.startDate,
                                 "statuses": oum.fixture.statuses },
                               Loader.handleSuccessfulResponse);
   });
   
   it ("should call function to request orders although a required parameter is omitted", function() {
      Loader.queryOrders({"statuses": oum.fixture.statuses });
       
      expect(oui5lib.request.sendMappingRequest.calls.count()).toEqual(1);
      expect(oui5lib.request.sendMappingRequest)
         .toHaveBeenCalledWith("order", "getOrders",
                               { "statuses": oum.fixture.statuses },
                               Loader.handleSuccessfulResponse);
   });

   
   it ("should notify the RefsHandler of incoming data", function() {
      const responseObject = {
         result: true,
         value: oum.fixture.addressesData
      };
      const requestInfo = {
         entity: "address"
      };
      spyOn(oum.do.RefsHandler, "handleDataLoaded");
      Loader.handleSuccessfulResponse(responseObject, requestInfo);
      expect(oum.do.RefsHandler.handleDataLoaded.calls.count()).toEqual(1);
      expect(oum.do.RefsHandler.handleDataLoaded)
         .toHaveBeenCalledWith("address", oum.fixture.addressesData);
   });


    
    it ("should call the function to request an order by the order id", function() {
        Loader.loadOrder(oum.fixture.orderId);
        expect(oui5lib.request.sendMappingRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.sendMappingRequest)
            .toHaveBeenCalledWith("order", "getOrder",
                                  {"id": oum.fixture.orderId },
                                  Loader.handleSuccessfulResponse);
    });
    
    it ("should request products data by an array of product ids", function() {
        const ids = ["0871132532", "0853455341", "080613125"];
        Loader.loadProducts(ids);
        expect(oui5lib.request.sendMappingRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.sendMappingRequest)
            .toHaveBeenCalledWith("product", "getProducts",
                                  {"isbns": ids },
                                  Loader.handleSuccessfulResponse);
    });

    it ("should request addresses data by an array of address ids", function() {
        const ids = [1, 2];
        Loader.loadAddresses(ids);
        expect(oui5lib.request.sendMappingRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.sendMappingRequest)
            .toHaveBeenCalledWith("address", "getAddresses",
                                  { "ids": ids },
                                  Loader.handleSuccessfulResponse);
    });
});
