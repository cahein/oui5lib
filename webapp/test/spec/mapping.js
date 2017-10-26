describe("mapping", function() {
    beforeAll(function() {
//        this.xhr = sinon.useFakeXMLHttpRequest();
    });

    afterAll(function() {
//        this.xhr.restore();
    });

    it("should return primary key", function() {
        var primaryKey = oui5lib.mapping.getPrimaryKey("exampleEntity");
        expect(primaryKey).toEqual("id");
    });

    it("should return first level property definition", function() {
        var prop = oui5lib.mapping.getPropertyDefinition("exampleEntity", "id");
        expect(prop.name).toEqual("id");
        expect(prop.type).toEqual("int");
    });

    it("should return second level property definition", function() {
        var prop = oui5lib.mapping.getPropertyDefinition("exampleEntity", "subkeys/a");
        expect(prop.name).toEqual("a");
        expect(prop.type).toEqual("string");
    });

    it("should return collection property definition", function() {
        var prop = oui5lib.mapping.getPropertyDefinition("exampleEntity", "items/quantity");
        expect(prop.name).toEqual("quantity");
        expect(prop.type).toEqual("int");
    });
});
