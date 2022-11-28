describe("FormController", function() {
    var fc = oui5lib.controller.FormController;

    beforeAll(function() {
        var mockView = {};
        mockView.createId = function(name) { return "some_id" + name; };
        spyOn(fc.prototype, "getView").and.returnValue(mockView);
    });
    it("should construct an Input control", function() {
        spyOn(oui5lib.util, "getI18nText").and.returnValue("i18nKey");
        const input = fc.prototype.getInput("exampleEntity", "email");
        expect(input instanceof sap.m.Input).toBe(true);
    });

    it("should construct an Select control", function() {
        const select = fc.prototype.getSelect("exampleEntity", "location");
        expect(select instanceof sap.m.Select).toBe(true);
    });
});










