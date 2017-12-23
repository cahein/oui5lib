describe("Domain Objects", function() {
    var loader = oum.loader;
    beforeAll(function() {
        oum.orders.resetData();
        oum.products.resetData();
        oum.addresses.resetData();
    });
    it ("should load orders into the orders collection object", function() {
        loader.loadOrders("20171001");

        var data = oum.orders.getData();
        expect(data instanceof Array).toBe(true);
        expect(data.length).toEqual(2);
    });
    it ("should load an order into the orders collection object", function() {
        oum.orders.resetData();
        loader.loadOrder(8);

        var data = oum.orders.getData();
        expect(data instanceof Array).toBe(true);
        expect(data.length).toEqual(1);
    });
    it ("should load addresses into the addresses collection object", function() {
        loader.loadAddresses([1,2,3]);

        var data = oum.addresses.getData();
        expect(data instanceof Array).toBe(true);
        expect(data.length).toEqual(3);
    });
    it ("should load products into the products collection object", function() {
        loader.loadProducts(["0521560241", "0394718747",
                             "0889610356", "1859847390"]);

        var data = oum.products.getData();
        expect(data instanceof Array).toBe(true);
        expect(data.length).toEqual(4);
    });
});
