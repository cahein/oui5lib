describe("Order entity object", function() {
    beforeEach(function() {
        oum.do.products.resetData();
        oum.do.addresses.resetData();
        oum.do.orders.resetData();

        oum.do.orders.addData(JSON.parse(JSON.stringify(oum.fixture.ordersData)));
    });

    it ("should get a new Order", function() {
        const order = new oum.do.Order();
        expect(order instanceof oum.do.Order).toBe(true);
        expect(order.getProperty("id")).toEqual(undefined);
        expect(order.isNew()).toBe(true);
    });
    
    it ("should get an existing Order already loaded", function() {
        const order = new oum.do.Order(2);
        expect(order instanceof oum.do.Order).toBe(true);
        expect(order.getProperty("id")).toEqual(2);
        expect(order.isNew()).toBe(false);
    });

    it ("should get the Order id as property", function() {
        const order = new oum.do.Order(1);
        expect(order.getProperty("id")).toEqual(1);
    });

    it ("should get the Order id directly", function() {
        const order = new oum.do.Order(1);
        expect(order.id).toEqual(1);
    });
    
    it ("should allow modification of Order data", function() {
        const order = new oum.do.Order(2);
        expect(order.getProperty("status")).toEqual("processing");
        expect(order.wasModified()).toEqual(false);
        order.setProperty("status", "shipped");
        expect(order.getProperty("status")).toEqual("shipped");
        expect(order.wasModified()).toEqual(true);
    });
    
    it ("should call loader to request an Order", function() {
        spyOn(oum.do.loader, "loadOrder");
        
        expect(oum.do.orders.isItemLoaded(8)).toBe(false);
        const order = new oum.do.Order(8);
        expect(oum.do.loader.loadOrder)
            .toHaveBeenCalledWith(8);
    });



    it ("should have functions to get the billing and shipping addresses", function() {
        const order = new oum.do.Order();
        expect(typeof order.getBillingAddress).toEqual("function"); 
        expect(typeof order.getShippingAddress).toEqual("function"); 
    });

    it ("should get related address entity objects", function() {
        oum.do.addresses.addData(oum.fixture.addressesData);

        const order = new oum.do.Order(2);
        const billingAddress = order.getBillingAddress();
        expect(billingAddress instanceof oum.do.Address).toBe(true);
        expect(billingAddress.getProperty("id")).toEqual(2);

        const shippingAddress = order.getShippingAddress();
        expect(shippingAddress instanceof oum.do.Address).toBe(true);
        expect(shippingAddress.getProperty("id")).toEqual(3);
        
    });



    it ("should get the order total", function() {
        oum.do.orders.addData(oum.fixture.ordersData);
        const order = new oum.do.Order(2);
        expect(order.getOrderTotal()).toEqual("42.00");
    });
    
    it ("should get the order items", function() {
        const order = new oum.do.Order(2);
        const orderItems = order.getOrderItems();
        expect(orderItems.length).toEqual(2);
    });

    it ("should add an order item and get updated order total", function() {
        const order = oum.do.Order(2);
        let orderItems = order.getOrderItems();
        expect(orderItems.length).toEqual(2);

        oum.do.products.addData(oum.fixture.productsData);

        order.addOrderEntry("0394718747", 1);
        
        orderItems = order.getOrderItems();
        expect(orderItems.length).toEqual(3);
        expect(order.getOrderTotal()).toEqual("55.09");
    });

    it ("should remove an order item", function() {
        const order = new oum.do.Order(2);
        const removedItem = order.removeOrderItem("0889610356");
        expect(typeof removedItem === "object").toBe(true);
        const orderItems = order.getOrderItems();
        expect(orderItems.length).toEqual(1);
    });

    it ("should get an order item by product id", function() {
        const order = oum.do.Order(2);
        const item = order.getOrderItem("1859847390");
        expect(item.quantity).toEqual(1);
        expect(item.unitPrice).toEqual(2.4);
    });
});
