describe("Products object model", function() {
   beforeAll(function() {
      oui5lib.request.doRequest("product", "getProducts",
                                { "isbns": ["0871132532", "0853455341", "080613125"] },
                                oum.products.addData);
   });
   it ("should return products", function() {
      var data = oum.products.getData(); 
      expect(data.length).toBe(54);
   });
});
