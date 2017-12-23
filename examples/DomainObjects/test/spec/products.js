describe("Products collection object", function() {
    beforeAll(function() {
        oum.do.products.resetData();
        oum.do.products.addData(oum.fixture.productsData);
    });
    it ("should preserve loading order", function() {
        var data = oum.do.products.getData();
        expect(data[0].isbn).toEqual("0521560241");
        expect(data[1].isbn).toEqual("0394718747");
        expect(data[2].isbn).toEqual("0889610356");
    });

});
