describe("Products object model", function() {
   beforeAll(function() {
      // async loading problem
      oui5lib.request.doRequest("product", "getProducts",
                                { "ids": ["1", "2", "3"] },
                                oum.products.init,
                                false);
   });
   it ("should return products", function() {
      var data = oum.products.getData(); 
      expect(data.length).toBe(3);
   });
});
