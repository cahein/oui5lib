describe("ListBase", function() {
    let listBase = null;
    const primaryKey = "id";
    
    const testData = [
        { id: 1, name: "entry 0", description: "first entry of the data array", type: "A"},
        { id: 2, name: "entry 1", description: "second entry of the data array", type: "B"},
        { id: 3, name: "entry 2", description: "third entry of the data array", type: "A"},
        { id: 4, name: "entry 3", description: "forth entry of the data array", type: "C"},
        { id: 5, name: "entry 4", description: "fifth entry of the data array", type: "B"},
    ];
    const itemToAdd = { id: 6, type: "D"};
    
    beforeAll(function() {
        // runs before all tests in this block
    });
    
    beforeEach(function() {
        // runs before each test in this block
        listBase = oui5lib.listBase.getObject(primaryKey);
        listBase.addData(testData, true);
    });
    
    it ("should return an error if no primary key is provided", function() {
        try {
            listBase = oui5lib.listBase.getObject();
        } catch (e) {
            expect(e.message).toEqual("cannot create listBase object without primary key");
        }
    });
    
    it ("should throw a TypeError unless adding an object or array to the collection", function() {
        try {
            listBase.addData();
        } catch (e) {
            expect(e.name).toEqual("TypeError");
        }

        try {
            listBase.addData(null);
        } catch (e) {
            expect(e.name).toEqual("TypeError");
        }
        
        const data = listBase.getData();
        expect(data instanceof Array).toBe(true);
        expect(data.length).toEqual(5);
    });
    
    it ("should empty the collection", function() {
        let data = listBase.getData();
        expect(data.length).toEqual(5);
        listBase.resetData();

        data = listBase.getData();
        expect(data).toBe(null);
    });

    it ("should add an object to the collection", function() {
        listBase.addData(itemToAdd, true);
        const data = listBase.getData();
        expect(data).toEqual([itemToAdd]);
    });
    
    it ("should add an array of objects to the collection", function() {
        const data = listBase.getData();
        expect(data.length).toEqual(5);
        expect(data).toEqual(testData);
    });
    
    it ("should hide internal functions", function() {
        expect(listBase.getItemByKey).toBe(undefined);
        expect(typeof listBase.getItem).toBe("function");
    });
    
    it ("should allow to get an item by its primary key", function() {
        let entry = listBase.getItem("1");
        expect(entry.id).toEqual(1);
        expect(entry.name).toEqual("entry 0");
        
        entry = listBase.getItem(2);
        expect(entry.name).toEqual("entry 1");
    });

    it ("should update an entry", function() {
        const entryIn = { id: 2, name: "entry 1 updated", description: "updated entry"};
        const updated = listBase.updateItem(entryIn);
        expect(updated).toBe(true);

        const entryOut = listBase.getItem(2);
        expect(entryOut).toBe(entryIn);
    });
    
    it ("should not add an entry with duplicate primary key", function() {
        const data = listBase.getData();
        expect(data.length).toEqual(5);
        
        const entry = { id: 1, name: "entry exists", description: "primary key is not unique"};
        const bool = listBase.addItem(entry);
        expect(bool).toBe(false);
        expect(data.length).toEqual(5);
    });
    
    it ("should add an entry with unique primary key", function() {
        const entry = { id: 6, name: "entry 5", description: "primary key is unique"};
        const bool = listBase.addItem(entry);
        expect(bool).toBe(true);
        
        const data = listBase.getData();
        expect(data.length).toEqual(6);
    });
    
    it ("should remove an entry by id", function() {
        const data = listBase.getData();
        expect(data.length).toEqual(5);
        
        listBase.removeItem(5);         
        expect(data.length).toEqual(4);
    });
    
    it ("should sort by key", function() {
        const sortedData = listBase.sortBy("description");
        expect(sortedData[0].id).toEqual(5);
        
        const data = listBase.getData();
        expect(data).toBe(sortedData);
    });
    
    it ("should filter by key", function() {
        const filteredData = listBase.filterBy("type", "A");
        expect(filteredData.length).toEqual(2);
        
        const data = listBase.getData();
        expect(data.length).toEqual(5);
    });
    
    it ("should not reference the same object", function() {
        const otherListBase = oui5lib.listBase.getObject(primaryKey);
        expect(otherListBase).not.toBe(listBase);
        
        const aData = otherListBase.getData();
        expect(aData instanceof Array).toBe(true);
        expect(aData.length).toEqual(0);

        const bData = listBase.getData();
        expect(bData.length).toEqual(5);
    });
});

