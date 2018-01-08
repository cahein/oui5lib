describe("Namespace oui5lib.util", function() {
    it("should test if value is null or empty", function() {
        expect(oui5lib.util.isBlank(null)).toBe(true);
        expect(oui5lib.util.isBlank()).toBe(true);
        expect(oui5lib.util.isBlank("  ")).toBe(true);
        expect(oui5lib.util.isBlank("  a")).toBe(false);
    });
});

