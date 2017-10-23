describe("Orders object model", function() {
    beforeAll(function() {
        oui5lib.request.doRequest("order", "getOrders",
                                  { "startDate": "2017-04-01" },
                                  oum.orders.init);
    });
    it ("should return orders", function() {
        var data = oum.orders.getData(); 
        expect(data.length).toBe(2);
    });

    it ("should return order data by id", function() {
        var data = oum.orders.getItem(1); 
        expect(data.id).toBe(1);
    });

});
