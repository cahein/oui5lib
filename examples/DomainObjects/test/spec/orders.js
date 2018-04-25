describe("Orders collection object", function() {
    const orders = oum.do.orders;
    beforeAll(function() {
        oum.do.addresses.resetData();
        oum.do.products.resetData();
    });
    beforeEach(function() {
        orders.addData(JSON.parse(JSON.stringify(oum.fixture.ordersData)));
    });
    afterEach(function() {
        orders.resetData();
    });

    it ("should return the orders collection", function() {
        const data = orders.getData(); 
        expect(data instanceof Array).toBe(true);
        expect(data.length).toBe(2);
    });
    
    it ("should allow us to check if an order is loaded", function() {
        expect(orders.isItemLoaded(1) instanceof Date).toBe(true);
        expect(orders.isItemLoaded(2) instanceof Date).toBe(true);
        expect(orders.isItemLoaded(3)).toBe(false);
    });

    it ("should return item count", function() {
        expect(orders.getItemCount()).toBe(2);
    });

    it ("should return order data by id", function() {
        const data = orders.getItem(1); 
        expect(data.id).toBe(1);
    });

    it ("should add address names to the order data", function() {
        oum.do.addresses.addData(oum.fixture.addressesData);

        const data = oum.do.orders.getItem(2); 
        expect(typeof data.billingName === "string").toBe(true);
        expect(typeof data.shippingName === "string").toBe(true);
    });
    

    it ("should calculate and add the order total ", function() {
        var order = oum.do.orders.getItem(1);
        expect(typeof order.total).toEqual("string");
        expect(order.total).toEqual("29.50");
    });

    it ("should call function to load referenced addresses and products", function() {
        orders.resetData();
        spyOn(oum.do.RefsHandler, "processOrderReferences");
        oum.do.orders.addData(oum.fixture.ordersData);
        expect(oum.do.RefsHandler.processOrderReferences.calls.count()).toEqual(1);
    });
});
