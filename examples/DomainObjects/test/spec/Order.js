describe("Order entity object", function() {
    beforeAll(function() {
        oum.do.products.resetData();
        oum.do.addresses.resetData();

        spyOn(oum.do.relationsHandler, "processOrderReferences");
        oum.do.orders.resetData();
        oum.do.orders.addData(oum.fixture.ordersData);
    });

    it ("should get a new Order", function() {
        var order = new oum.do.Order();
        expect(order instanceof oum.do.Order).toBe(true);
        expect(order.getProperty("id")).toEqual(undefined);
        expect(order.isNew()).toBe(true);
    });
    
    it ("should get an existing Order already loaded", function() {
        var order = new oum.do.Order(2);
        expect(order instanceof oum.do.Order).toBe(true);
        expect(order.getProperty("id")).toEqual(2);
        expect(order.isNew()).toBe(false);
    });

    it ("should get the Order id as property", function() {
        var order = new oum.do.Order(1);
        expect(order.getProperty("id")).toEqual(1);
    });

    it ("should get the Order id directly", function() {
        var order = new oum.do.Order(1);
        expect(order.id).toEqual(1);
    });
    
    it ("should allow modification of Order data", function() {
        var order = new oum.do.Order(2);
        expect(order.getProperty("status")).toEqual("processing");
        expect(order.wasModified()).toEqual(false);
        order.setProperty("status", "shipped");
        expect(order.getProperty("status")).toEqual("shipped");
        expect(order.wasModified()).toEqual(true);
    });
    
    it ("should call loader to request an Order", function() {
        spyOn(oum.do.loader, "loadOrder");
        
        expect(oum.do.orders.isItemLoaded(8)).toBe(false);
        var order = new oum.do.Order(8);
        expect(oum.do.loader.loadOrder)
            .toHaveBeenCalledWith(8);
    });



    it ("should have functions to get the billing and shipping addresses", function() {
        var order = new oum.do.Order();
        expect(typeof order.getBillingAddress).toEqual("function"); 
        expect(typeof order.getShippingAddress).toEqual("function"); 
    });

    it ("should get related address entity objects", function() {
        oum.do.addresses.addData(oum.fixture.addressesData, true);

        var order = new oum.do.Order(2);
        var billingAddress = order.getBillingAddress();
        expect(billingAddress instanceof oum.do.Address).toBe(true);
        expect(billingAddress.getProperty("id")).toEqual(2);

        var shippingAddress = order.getShippingAddress();
        expect(shippingAddress instanceof oum.do.Address).toBe(true);
        expect(shippingAddress.getProperty("id")).toEqual(3);
        
    });



    it ("should get the order total", function() {
        var order = oum.do.Order(2);
        expect(order.getOrderTotal()).toEqual("42.00");
    });
    
    it ("should get the order items", function() {
        var order = oum.do.Order(2);
        var orderItems = order.getOrderItems();
        expect(orderItems.length).toEqual(2);
    });

    it ("should add an order item and get updated order total", function() {
        var order = oum.do.Order(2);
        var orderItems = order.getOrderItems();
        expect(orderItems.length).toEqual(2);

        oum.do.products.addData(oum.fixture.productsData);

        order.addOrderEntry("0394718747", 1);
        
        orderItems = order.getOrderItems();
        expect(orderItems.length).toEqual(3);
        expect(order.getOrderTotal()).toEqual("55.09");
    });

    it ("should remove an order item", function() {
        var order = oum.do.Order(2);
        order.removeOrderItem("0394718747");
        var orderItems = order.getOrderItems();
        expect(orderItems.length).toEqual(2);
    });

    it ("should get an order item by product id", function() {
        var order = oum.do.Order(2);
        var item = order.getOrderItem("1859847390");
        expect(item.quantity).toEqual(1);
        expect(item.unitPrice).toEqual(2.4);
    });
});
