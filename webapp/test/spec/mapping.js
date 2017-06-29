describe("mapping", function() {
    beforeAll(function() {
    });

    it("should return primary key", function() {
        var primaryKey = oui5lib.mapping.getPrimaryKey("exampleEntity");
        expect(primaryKey).toEqual("id");
    });
});
