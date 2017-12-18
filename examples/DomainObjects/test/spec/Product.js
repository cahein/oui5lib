describe("Product object", function() {
    beforeAll(function() {
        oum.products.resetData();
        oum.products.addData(oum.productsData);
    });

    it ("should get a new Product", function() {
        var product = new oum.Product();
        expect(product instanceof oum.Product).toBe(true);
        expect(product.isNew()).toBe(true);
    });

    it ("should get a loaded Product", function() {
        var product = new oum.Product("0889610356");
        expect(product instanceof oum.Product).toBe(true);
        expect(product.isNew()).toBe(false);
        expect(product.id).toEqual("0889610356");
    });
    
    it ("should allow to modify Product data", function() {
        var product = new oum.Product("0394718747");
        expect(product.getProperty("title/a"))
            .toEqual("Propaganda: the formation of men's attitudes.");
        expect(product.wasModified()).toEqual(false);
        product.setProperty("note", "Are we lost?");
        expect(product.getProperty("note")).toEqual("Are we lost?");
        expect(product.wasModified()).toEqual(true);
    });

    it ("should call loader to request a Product", function() {
        oum.products.resetData();
        
        spyOn(oum.loader, "requestProduct");

        var product = new oum.Product("0521560241");
        expect(product instanceof oum.Product).toBe(true);
        expect(product.isNew()).toBe(false);

        expect(oum.loader.requestProduct.calls.count()).toEqual(1);
        expect(oum.loader.requestProduct)
            .toHaveBeenCalledWith("0521560241");

    });
    
});
