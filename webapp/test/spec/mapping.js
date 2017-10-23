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

    it("should return property definition", function() {
        var prop = oui5lib.mapping.getPropertyDefinition("exampleEntity", "id");
        expect(prop.name).toEqual("id");
        expect(prop.type).toEqual("int");
    });
});
