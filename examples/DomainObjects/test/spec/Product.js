describe("Product object", function() {
    beforeAll(function() {
        oui5lib.request.doRequest("order", "getOrders",
                                  { "startDate": "2017-04-01" },
                                  oum.orders.addData);
    });

    it ("should get a new Product", function() {
        var product = new oum.Product();
        expect(product instanceof oum.Product).toBe(true);
        expect(product.isNew()).toBe(true);
    });
    it ("should get an existing Product", function() {
        var product = new oum.Product(1);
        expect(product instanceof oum.Product).toBe(true);
        expect(product.isNew()).toBe(false);
        expect(product.id).toEqual(1);
    });
    it ("should allow to modify Product data", function() {
        var product = new oum.Product(1);
        expect(product.getProperty("name")).toEqual("Sauzahn");
        expect(product.wasModified()).toEqual(false);
        product.setProperty("name", "Sauzahn geschmiedet");
        expect(product.getProperty("name")).toEqual("Sauzahn geschmiedet");
        expect(product.wasModified()).toEqual(true);
    });

});
