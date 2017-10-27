describe("Orders collection object", function() {
    beforeAll(function() {
        oum.addresses.setData([]);
        oum.products.setData([]);
        spyOn(oum.addresses, "load").and.callThrough();
        spyOn(oum.products, "load").and.callThrough();

        oui5lib.request.doRequest("order", "getOrders",
                                  { "startDate": "2017-04-01" },
                                  oum.orders.init);
    });

    it ("should return orders", function() {
        var data = oum.orders.getData(); 
        expect(data.length).toBe(2);
    });
    
    it ("should return item count", function() {
        expect(oum.orders.getItemCount()).toBe(2);
    });

    it ("should return order data by id", function() {
        var data = oum.orders.getItem(1); 
        expect(data.id).toBe(1);
    });

    it ("should load related addresses", function() {
        expect(oum.addresses.load.calls.count()).toEqual(1);
        expect(oum.addresses.load).toHaveBeenCalledWith([1,2,3]);
        
        var orderData = oum.orders.getItem(1); 
        var addressId = orderData.customerAddressId;
        var customerAddress = oum.addresses.getItem(addressId);
        expect(customerAddress).not.toBe(null);
        expect(customerAddress.id).toEqual(1);
    });

    it ("should load related products", function() {
        expect(oum.products.load.calls.count()).toEqual(1);
        expect(oum.products.load).toHaveBeenCalledWith(["0313276439", "0889610356", "0813818702"]);
        var order = oum.orders.getItem(1);
        var items = order.items;
        
        var productEntry = items[0];
        var productId = productEntry.productId;

        var productData = oum.products.getItem(productId);
        expect(productData).not.toBe(null);
        expect(productData.isbn).toBe(productId);
    });

    it ("should convert date string to Date object", function() {
        var order = oum.orders.getItem(1);
        expect(order.orderDate instanceof Date).toBe(true);
    });

    it ("should calculate and add the orderTotal ", function() {
        var order = oum.orders.getItem(1);
        expect(typeof order.total).toEqual("number");
        expect(order.total).toEqual(29.5);
    });
});
