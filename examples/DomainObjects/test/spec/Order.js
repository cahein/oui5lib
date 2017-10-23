describe("Order object", function() {
    beforeAll(function() {
        oui5lib.request.doRequest("order", "getOrders",
                                  { "startDate": "2017-04-01" },
                                  oum.orders.addData);
    });
    it ("should get a new Order", function() {
        var order = new oum.Order();
        expect(order instanceof oum.Order).toBe(true);
        expect(order.isNew()).toBe(true);
    });
    it ("should get an existing Order already loaded", function() {
        var order = new oum.Order(2);
        expect(order instanceof oum.Order).toBe(true);
        expect(order.isNew()).toBe(false);
        expect(order.id).toEqual(2);
    });
    it ("should add an existing Order not yet loaded", function() {
        var ordersArray = oum.orders.getData();
        expect(ordersArray.length).toBe(2);

        var orderData = oum.orders.getItem(8);
        expect(orderData).toBe(null);

        var order = new oum.Order(8);
        expect(order instanceof oum.Order).toBe(true);
        expect(order.isNew()).toBe(false);
        
        ordersArray = oum.orders.getData();
        expect(ordersArray.length).toBe(3);
        
        orderData = oum.orders.getItem(8);
        expect(orderData.id).toBe(8);

    });
    it ("should allow modification of Order data", function() {
        var order = new oum.Order(1);
        expect(order.getProperty("status")).toEqual("shipped");
        expect(order.wasModified()).toEqual(false);
        order.setProperty("status", "closed");
        expect(order.getProperty("status")).toEqual("closed");
        expect(order.wasModified()).toEqual(true);
    });

});
