describe("Domain Objects", function() {
    const Loader = oum.do.Loader;
    
    beforeEach(function() {
        oum.do.orders.resetData();
        oum.do.products.resetData();
        oum.do.addresses.resetData();
    });
    it ("should load orders into the orders collection object", function() {
        Loader.queryOrders({ "startDate": oum.fixture.startDate });

        const data = oum.do.orders.getData();
        expect(data instanceof Array).toBe(true);
        expect(data.length).toEqual(2);
    });
    it ("should load an order into the orders collection object", function() {
        Loader.loadOrder(oum.fixture.orderId);

        const data = oum.do.orders.getData();
        expect(data instanceof Array).toBe(true);
        expect(data.length).toEqual(1);
    });
    it ("should load addresses into the addresses collection object", function() {
        Loader.loadAddresses([1,2,3]);

        const data = oum.do.addresses.getData();
        expect(data instanceof Array).toBe(true);
        expect(data.length).toEqual(3);
    });
    it ("should load products into the products collection object", function() {
        Loader.loadProducts(["0521560241", "0394718747",
                             "0889610356", "1859847390"]);

        const data = oum.do.products.getData();
        expect(data instanceof Array).toBe(true);
        expect(data.length).toEqual(4);
    });
});
