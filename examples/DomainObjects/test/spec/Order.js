describe("Order entity object", function() {
    beforeAll(function() {
        oum.products.resetData();
        oum.addresses.resetData();

        spyOn(oum.relationsHandler, "processOrderReferences");
        oum.orders.resetData();
        oum.orders.addData(oum.ordersData);
    });

    it ("should get a new Order", function() {
        var order = new oum.Order();
        expect(order instanceof oum.Order).toBe(true);
        expect(order.getProperty("id")).toEqual(undefined);
        expect(order.isNew()).toBe(true);
    });
    
    it ("should get an existing Order already loaded", function() {
        var order = new oum.Order(2);
        expect(order instanceof oum.Order).toBe(true);
        expect(order.getProperty("id")).toEqual(2);
        expect(order.isNew()).toBe(false);
    });

    it ("should get the Order id directly", function() {
        var order = new oum.Order(2);
        expect(order.id).toEqual(order.getProperty("id"));
    });
    
    it ("should allow modification of Order data", function() {
        var order = new oum.Order(2);
        expect(order.getProperty("status")).toEqual("processing");
        expect(order.wasModified()).toEqual(false);
        order.setProperty("status", "shipped");
        expect(order.getProperty("status")).toEqual("shipped");
        expect(order.wasModified()).toEqual(true);
    });
    
    it ("should have functions to get the billing and shipping addresses", function() {
        var order = new oum.Order();
        expect(typeof order.getBillingAddress).toEqual("function"); 
        expect(typeof order.getShippingAddress).toEqual("function"); 
    });

    it ("should get related address entity objects", function() {
        oum.addresses.resetData();
        oum.addresses.addData(oum.addressesData);

        var order = new oum.Order(2);
        var billingAddress = order.getBillingAddress();
        expect(billingAddress instanceof oum.Address).toBe(true);
        expect(billingAddress.getProperty("id")).toEqual(2);

        var shippingAddress = order.getShippingAddress();
        expect(shippingAddress instanceof oum.Address).toBe(true);
        expect(shippingAddress.getProperty("id")).toEqual(3);
        
    });

    it ("should get the order total", function() {
        var order = oum.Order(2);
        expect(order.getOrderTotal()).toEqual("42.00");
    });
    
    it ("should get the order items", function() {
        var order = oum.Order(2);
        var orderItems = order.getOrderItems();
        expect(orderItems.length).toEqual(2);
    });

    it ("should add an order item and get updated order total", function() {
        var order = oum.Order(2);
        var orderItems = order.getOrderItems();
        expect(orderItems.length).toEqual(2);

        oum.products.addData(oum.productsData);

        order.addOrderEntry("0394718747", 1);
        
        orderItems = order.getOrderItems();
        expect(orderItems.length).toEqual(3);
        expect(order.getOrderTotal()).toEqual("55.09");
    });

    it ("should remove an order item", function() {
        var order = oum.Order(2);
        order.removeOrderItem("0394718747");
        var orderItems = order.getOrderItems();
        expect(orderItems.length).toEqual(2);
    });

    it ("should get an order item by product id", function() {
        var order = oum.Order(2);
        var item = order.getOrderItem("1859847390");
        expect(item.quantity).toEqual(1);
        expect(item.unitPrice).toEqual(2.4);
    });

    it ("should call loader to request an Order", function() {
        spyOn(oum.loader, "requestOrder");
        
        var order = new oum.Order(8);
        expect(oum.loader.requestOrder)
            .toHaveBeenCalledWith(8);
    });
});
