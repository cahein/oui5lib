describe("configuration", function() {
    beforeAll(function() {
    });

    it("should return array of available languages", function() {
        var availableLanguages = oui5lib.configuration.getAvailableLanguages();
        expect(availableLanguages instanceof Array).toBe(true);
        expect(availableLanguages.length).toEqual(2);
    });
    
    it("should return log level", function() {
        var logLevel = oui5lib.configuration.getLogLevel();
        expect(typeof logLevel).toEqual("string");
        expect(logLevel).toEqual("DEBUG");
    });
    
    it("should return default language", function() {
        var defaultLanguage = oui5lib.configuration.getDefaultLanguage();
        expect(defaultLanguage).toEqual("en");
    });

    it("should return current language as default language", function() {
        var currentLanguage = oui5lib.configuration.getCurrentLanguage();
        expect(currentLanguage).toEqual("en");
    });

    it("should return mapping directory", function() {
        var mappingDir = oui5lib.configuration.getMappingDir();
        expect(mappingDir).toEqual("mapping");
    });
});
