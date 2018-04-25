describe("Product object", function() {
    beforeEach(function() {
        oum.do.products.addData(JSON.parse(JSON.stringify(oum.fixture.productsData)), true);
    });

    it ("should get a new Product", function() {
        const product = new oum.do.Product();
        expect(product instanceof oum.do.Product).toBe(true);
        expect(product.isNew()).toBe(true);
    });

    it ("should get a loaded Product", function() {
        const product = new oum.do.Product("0889610356");
        expect(product instanceof oum.do.Product).toBe(true);
        expect(product.isNew()).toBe(false);
        expect(product.id).toEqual("0889610356");
    });
    
    it ("should allow to modify Product data", function() {
        const product = new oum.do.Product("0394718747");
        expect(product.getProperty("title/a"))
            .toEqual("Propaganda: the formation of men's attitudes.");
        expect(product.wasModified()).toEqual(false);
        product.setProperty("note", "Are we lost?");
        expect(product.getProperty("note")).toEqual("Are we lost?");
        expect(product.wasModified()).toEqual(true);
    });

    it ("should call loader to request a Product", function() {
        oum.do.products.resetData();
        
        spyOn(oum.do.Loader, "loadProduct");

        const product = new oum.do.Product("0521560241");
        expect(product instanceof oum.do.Product).toBe(true);
        expect(product.isNew()).toBe(false);

        expect(oum.do.Loader.loadProduct.calls.count()).toEqual(1);
        expect(oum.do.Loader.loadProduct)
            .toHaveBeenCalledWith("0521560241");

    });
    
});
