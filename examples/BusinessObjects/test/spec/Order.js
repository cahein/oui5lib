describe("Order object", function() {
   beforeAll(function() {
   });
   it ("should get a new Order", function() {
      var order = new oum.Order();
      expect(order instanceof oum.Order).toBe(true);
      expect(order.isNew()).toBe(true);
   });
   it ("should get an existing Order", function() {
      var order = new oum.Order(1);
      expect(order instanceof oum.Order).toBe(true);
      expect(order.isNew()).toBe(false);
      expect(order.id).toEqual(1);
   });
   it ("should allow to modify Order data", function() {
      var order = new oum.Order(1);
      expect(order.getProperty("status")).toEqual("shipped");
      expect(order.wasModified()).toEqual(false);
      order.setProperty("status", "closed");
      expect(order.getProperty("status")).toEqual("closed");
      expect(order.wasModified()).toEqual(true);
   });

});
