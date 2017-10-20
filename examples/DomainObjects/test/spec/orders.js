describe("Orders object model", function() {
   beforeAll(function() {
      // async loading problem
      oui5lib.request.doRequest("order", "getOrders",
                                { "startDate": "2017-04-01" },
                                oum.orders.addData,
                                false);
   });
   it ("should return orders", function() {
      var data = oum.orders.getData(); 
      expect(data.length).toBe(2);
   });
});
