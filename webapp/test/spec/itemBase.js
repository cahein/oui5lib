describe("itemBase", function() {
   var itemBase = null;
   beforeAll(function() {
      itemBase = oui5lib.itemBase;
   });
    
   it("should not have any data", function() {
      expect(itemBase.getData()).toBe(null);
   });
    
   it("should not have been modified", function() {
      expect(itemBase.wasModified()).toBe(false);
   });
    
   it("should not be set as a new record", function() {
      expect(itemBase.isNew()).toBe(false);
   });
});






