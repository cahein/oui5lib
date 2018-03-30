describe("Orders collection object", function() {
    beforeEach(function() {
        oum.do.addresses.resetData();
        oum.do.products.resetData();
        oum.do.orders.resetData();

        oum.do.orders.addData(oum.fixture.ordersData);
    });

    it ("should return the orders collection", function() {
        var data = oum.do.orders.getData(); 
        expect(data instanceof Array).toBe(true);
        expect(data.length).toBe(2);
    });
    
    it ("should allow us to check if an order is loaded", function() {
        expect(oum.do.orders.isItemLoaded(1) instanceof Date).toBe(true);
        expect(oum.do.orders.isItemLoaded(2) instanceof Date).toBe(true);
        expect(oum.do.orders.isItemLoaded(3)).toBe(false);
    });

    it ("should return item count", function() {
        expect(oum.do.orders.getItemCount()).toBe(2);
    });

    it ("should return order data by id", function() {
        var data = oum.do.orders.getItem(1); 
        expect(data.id).toBe(1);
    });

    it ("should add address names to the order data", function() {
        oum.do.addresses.addData(oum.fixture.addressesData);
        oum.do.orders.resetData();
        oum.do.orders.addData(oum.fixture.ordersData);
        var data = oum.do.orders.getItem(2); 
        expect(typeof data.billingName === "string").toBe(true);
        expect(typeof data.shippingName === "string").toBe(true);
    });
    
    it ("should add product names to the order items data", function() {
        oum.do.products.addData(oum.fixture.productsData);
        oum.do.orders.resetData();
        oum.do.orders.addData(oum.fixture.ordersData);
        var data = oum.do.orders.getItem(2);
        var items = data.items;
        items.forEach(function(item) {
            expect(typeof item.productName === "string").toBe(true);
        });
    });

    
    it ("should convert date string to Date object", function() {
        var order = oum.do.orders.getItem(1);
        expect(order.orderDate instanceof Date).toBe(true);
    });

    it ("should calculate and add the order total ", function() {
        var order = oum.do.orders.getItem(1);
        expect(typeof order.total).toEqual("string");
        expect(order.total).toEqual("29.50");
    });

    it ("should call function to load referenced addresses and products", function() {
        oum.do.orders.resetData();
        spyOn(oum.do.relationsHandler, "processOrderReferences");

        oum.do.orders.addData(oum.fixture.ordersData);
        expect(oum.do.relationsHandler.processOrderReferences.calls.count()).toEqual(1);
    });
});
