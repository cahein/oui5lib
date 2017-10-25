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
        var product = new oum.Product("0394718747");
        expect(product.getProperty("title/a")).toEqual("Propaganda: the formation of men's attitudes.");
        expect(product.wasModified()).toEqual(false);
        product.setProperty("note", "Are we lost?");
        expect(product.getProperty("note")).toEqual("Are we lost?");
        expect(product.wasModified()).toEqual(true);
    });
});
