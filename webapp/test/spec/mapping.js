describe("mapping", function() {
    beforeAll(function() {
    });

    afterAll(function() {
    });

    it("should return primary key", function() {
        var primaryKey = oui5lib.mapping.getPrimaryKey("exampleEntity");
        expect(primaryKey).toEqual("id");
    });

    it("should return first level attribute specification", function() {
        var propConf = oui5lib.mapping.getEntityAttributeSpec("exampleEntity",
                                                              "id");
        expect(propConf.name).toEqual("id");
        expect(propConf.type).toEqual("int");
    });

    it("should return second level object attribute specification", function() {
        var propConf = oui5lib.mapping.getEntityAttributeSpec("exampleEntity",
                                                              "subkeys/a");
        expect(propConf.name).toEqual("a");
        expect(propConf.type).toEqual("string");
    });

    it("should return array attribute specification", function() {
        var propConf = oui5lib.mapping.getEntityAttributeSpec("exampleEntity",
                                                              "items/quantity");
        expect(propConf.name).toEqual("quantity");
        expect(propConf.type).toEqual("int");
    });
});
