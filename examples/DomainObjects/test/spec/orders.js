describe("Orders collection object", function() {
    beforeAll(function() {
        oum.addresses.resetData();
        oum.products.resetData();

        spyOn(oum.relationsHandler, "processOrderReferences");
        oum.orders.addData(oum.ordersData);
    });

    it ("should return the orders collection", function() {
        var data = oum.orders.getData(); 
        expect(data instanceof Array).toBe(true);
        expect(data.length).toBe(2);
    });
    
    it ("should return item count", function() {
        expect(oum.orders.getItemCount()).toBe(2);
    });

    it ("should return order data by id", function() {
        var data = oum.orders.getItem(1); 
        expect(data.id).toBe(1);
    });

    it ("should convert date string to Date object", function() {
        var order = oum.orders.getItem(1);
        expect(order.orderDate instanceof Date).toBe(true);
    });

    it ("should calculate and add the order total ", function() {
        var order = oum.orders.getItem(1);
        expect(typeof order.total).toEqual("string");
        expect(order.total).toEqual("29.50");
    });

    it ("should call function to load referenced addresses and products", function() {
        expect(oum.relationsHandler.processOrderReferences.calls.count()).toEqual(1);
    });

});
