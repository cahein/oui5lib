describe("configuration", function() {
    beforeAll(function() {
    });
    
    afterAll(function() {
    });

    it("should return array of available languages", function() {
        var availableLanguages = oui5lib.configuration.getAvailableLanguages();
        expect(availableLanguages instanceof Array).toBe(true);
        expect(availableLanguages.length).toEqual(2);
    });
    
    it("should return log level", function() {
        var logLevel = oui5lib.configuration.getLogLevel();
        expect(typeof logLevel).toEqual("string");
        expect(logLevel).toEqual("ERROR");
    });
    
    it("should return default language", function() {
        var defaultLanguage = oui5lib.configuration.getDefaultLanguage();
        expect(defaultLanguage).toEqual("en");
    });

    it("should return current language as default language", function() {
        var currentLanguage = oui5lib.configuration.getCurrentLanguage();
        expect(currentLanguage).toEqual("en");
    });

    it("should return regexes defined in the configuration", function() {
        var dateRegex = oui5lib.configuration.getRegex("date");
        expect(dateRegex instanceof RegExp).toBe(true);

        var timeRegex = oui5lib.configuration.getRegex("time");
        expect(timeRegex instanceof RegExp).toBe(true);

        var phoneRegex = oui5lib.configuration.getRegex("phone");
        expect(phoneRegex instanceof RegExp).toBe(true);

        var emailRegex = oui5lib.configuration.getRegex("email");
        expect(emailRegex).toBe(null);
    });
});
