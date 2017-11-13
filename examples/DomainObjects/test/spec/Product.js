describe("Product object", function() {
    beforeAll(function() {
        oum.products.setData([]);

        oui5lib.request.doRequest("product", "getProducts",
                                  { "isbns": [ "0394718747", "0889610356", "1859847390" ] },
                                  oum.products.addData);

    });

    it ("should get a new Product", function() {
        var product = new oum.Product();
        expect(product instanceof oum.Product).toBe(true);
        expect(product.isNew()).toBe(true);
    });

    it ("should get an existing Product", function() {
        var product = new oum.Product("0889610356");
        expect(product instanceof oum.Product).toBe(true);
        expect(product.isNew()).toBe(false);
        expect(product.id).toEqual("0889610356");
    });
    
    it ("should allow to modify Product data", function() {
        var product = new oum.Product("0394718747");
        expect(product.getProperty("title/a")).toEqual("Propaganda: the formation of men's attitudes.");
        expect(product.wasModified()).toEqual(false);
        product.setProperty("note", "Are we lost?");
        expect(product.getProperty("note")).toEqual("Are we lost?");
        expect(product.wasModified()).toEqual(true);
    });

    it ("should request a product", function() {
        oum.products.setData([]);
        
        spyOn(oui5lib.request, "doRequest").and.callThrough();
        var product = new oum.Product("0521560241");
        expect(oui5lib.request.doRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.doRequest)
            .toHaveBeenCalledWith("product", "getProducts",
                                  { "isbns": ["0521560241"] },
                                  oum.Product.prototype.requestSucceeded);

        expect(product instanceof oum.Product).toBe(true);
        expect(product.isNew()).toBe(false);
        expect(product.id).toEqual("0521560241");
        expect(product.getProperty("isbn")).toEqual("0521560241");
    });
    
});
