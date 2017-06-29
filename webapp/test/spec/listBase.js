describe("ListBase", function() {
   var listBase = null;
   var primaryKey = "id";
   
   var testData = [
      { id: 1, name: "entry 0", description: "first entry of the data array", type: "A"},
      { id: 2, name: "entry 1", description: "second entry of the data array", type: "B"},
      { id: 3, name: "entry 2", description: "third entry of the data array", type: "A"},
      { id: 4, name: "entry 3", description: "forth entry of the data array", type: "C"},
      { id: 5, name: "entry 4", description: "fifth entry of the data array", type: "B"},
   ];
   
   beforeAll(function() {
      // runs before all tests in this block
      listBase = oui5lib.listBase.getObject(primaryKey);
   });
   
   beforeEach(function() {
      // runs before each test in this block
   });
   
   it ("should return an error if no primary key is provided", function() {
      try {
         var listBase = oui5lib.listBase.getObject();
      } catch (e) {
         expect(e.message).toEqual("cannot create listBase object without primary key");
      }
   });
    
   it ("should only allow array data to be set", function() {
       try {
           listBase.setData({});
       } catch (e) {
           expect(e.name).toEqual("TypeError");
       }

       try {
           listBase.setData();
       } catch (e) {
           expect(e.name).toEqual("TypeError");
       }
       var data = listBase.getData();
       expect(data).toEqual(null);
   });
    
   it ("should allow array data to be set", function() {
      listBase.setData(testData);
      var data = listBase.getData();
      expect(data).toEqual(testData);
   });
    
   it ("should hide internal functions", function() {
      expect(listBase.getItemByKey).toBe(undefined);
      expect(typeof listBase.getItem).toBe("function");
   });
    
   it ("should allow to get an item by its primary key", function() {
      var entry = listBase.getItem("1");
      expect(entry.id).toEqual(1);
      expect(entry.name).toEqual("entry 0");
      
      entry = listBase.getItem(1);
      expect(entry.name).toEqual("entry 0");
   });
    
   it ("should update an entry", function() {
      var entryIn = { id: 2, name: "entry 1 updated", description: "updated entry"};
      var updated = listBase.updateItem(entryIn);
      expect(updated).toBe(true);

      var entryOut = listBase.getItem(2);
      expect(entryOut).toBe(entryIn);
   });
    
   it ("should not add an entry with duplicate primary key", function() {
      var data = listBase.getData();
      expect(data.length).toEqual(5);
      
      var entry = { id: 1, name: "entry 5", description: "primary key is not unique"};
      var bool = listBase.addItem(entry);
      expect(bool).toBe(false);
      
      data = listBase.getData();
      expect(data.length).toEqual(5);
   });
    
   it ("should add an entry with unique primary key", function() {
      var entry = { id: 6, name: "entry 5", description: "primary key is unique"};
      var bool = listBase.addItem(entry);
      expect(bool).toBe(true);
      
      data = listBase.getData();
      expect(data.length).toEqual(6);
   });
    
   it ("should remove an entry by id", function() {
      var data = listBase.getData();
      expect(data.length).toEqual(6);
      
      listBase.removeItem(6);         
      data = listBase.getData();
      expect(data.length).toEqual(5);
   });
    
   it ("should sort by key", function() {
      var sortedData = listBase.sortBy("description");
      expect(sortedData[0].id).toEqual(5);
      
      var data = listBase.getData();
      expect(data).toBe(sortedData);
   });
    
   it ("should filter by key", function() {
      var filteredData = listBase.filterBy("type", "A");
      expect(filteredData.length).toEqual(2);
      
      var data = listBase.getData();
      expect(data.length).toEqual(5);
   });
    
   it ("should not reference the same object", function() {
      var otherListBase = oui5lib.listBase.getObject(primaryKey);
      expect(otherListBase).not.toBe(listBase);
      
      var aData = otherListBase.getData();
      expect(aData).toBe(null);
      var bData = listBase.getData();
      expect(bData.length).toEqual(5);
   });
});

