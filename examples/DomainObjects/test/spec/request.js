describe("Request object", function() {
   beforeAll(function() {
   });
   it ("should run the getOrders mapping request with startDate parameter", function() {
      var hasEvaluatedExpectations = false;
      oui5lib.request.sendMappingRequest(
         "order", "getOrders",
         { "startDate": oum.fixture.startDate },
         function(responseData, requestProps) {
            expect(requestProps.entity).toEqual("order");
            expect(requestProps.request).toEqual("getOrders");
            expect(responseData.result).toBe(true);
            expect(responseData.value instanceof Array).toBe(true);
            expect(responseData.value.length).toEqual(2);
            hasEvaluatedExpectations = true;
         }
      );
      expect(hasEvaluatedExpectations).toBe(true);
   });
  
   it ("should throw an Error if the required parameter startDate is omitted", function() {
      var errorThrown = false;
      
      try {
         oui5lib.request.sendMappingRequest(
            "order", "getOrders",
            { "startDate": null },
            function() {});
      } catch (e) {
         expect(e.name).toEqual("Error");
         expect(e.message).toEqual("required parameter missing: startDate");
         errorThrown = true;
      }
      expect(errorThrown).toBe(true);
   });
});
