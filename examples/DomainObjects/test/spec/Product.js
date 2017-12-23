describe("Product object", function() {
    beforeAll(function() {
        oum.do.products.resetData();
        oum.do.products.addData(oum.fixture.productsData);
    });

    it ("should get a new Product", function() {
        var product = new oum.do.Product();
        expect(product instanceof oum.do.Product).toBe(true);
        expect(product.isNew()).toBe(true);
    });

    it ("should get a loaded Product", function() {
        var product = new oum.do.Product("0889610356");
        expect(product instanceof oum.do.Product).toBe(true);
        expect(product.isNew()).toBe(false);
        expect(product.id).toEqual("0889610356");
    });
    
    it ("should allow to modify Product data", function() {
        var product = new oum.do.Product("0394718747");
        expect(product.getProperty("title/a"))
            .toEqual("Propaganda: the formation of men's attitudes.");
        expect(product.wasModified()).toEqual(false);
        product.setProperty("note", "Are we lost?");
        expect(product.getProperty("note")).toEqual("Are we lost?");
        expect(product.wasModified()).toEqual(true);
    });

    it ("should call loader to request a Product", function() {
        oum.do.products.resetData();
        
        spyOn(oum.do.loader, "loadProduct");

        var product = new oum.do.Product("0521560241");
        expect(product instanceof oum.do.Product).toBe(true);
        expect(product.isNew()).toBe(false);

        expect(oum.do.loader.loadProduct.calls.count()).toEqual(1);
        expect(oum.do.loader.loadProduct)
            .toHaveBeenCalledWith("0521560241");

    });
    
});
