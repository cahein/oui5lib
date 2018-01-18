describe("Namespace oui5lib.configuration", function() {
    beforeAll(function() {
    });
    
    afterAll(function() {
    });

    describe("Language handling", function() {
        it("should return array of available languages", function() {
            var availableLanguages = oui5lib.configuration.getAvailableLanguages();
            expect(availableLanguages instanceof Array).toBe(true);
            expect(availableLanguages.length).toEqual(2);
        });
    
        it("should return default language", function() {
            var defaultLanguage = oui5lib.configuration.getDefaultLanguage();
            expect(defaultLanguage).toEqual("en");
        });

        it("should return current language as default language", function() {
            var currentLanguage = oui5lib.configuration.getCurrentLanguage();
            expect(currentLanguage).toEqual("en");
        });
    });
    
    it("should return log level", function() {
        var logLevel = oui5lib.configuration.getLogLevel();
        expect(typeof logLevel).toEqual("string");
        expect(logLevel).toEqual("ERROR");
    });

    it("should return date and time value pattern defined in the configuration", function() {
        let format = oui5lib.configuration.getDateTimeValuePattern("dateTime");
        expect(format).toEqual("YYYY-MM-dd HH:mm:ss");
        format = oui5lib.configuration.getDateTimeValuePattern("date");
        expect(format).toEqual("YYYY-MM-dd");
    });
    it("should return date and time display pattern from the locale", function() {
        let format = oui5lib.configuration.getDateTimeDisplayPattern("dateTime", "short");
        expect(format).toEqual("M/d/yy, h:mm a");
        format = oui5lib.configuration.getDateTimeDisplayPattern("date", "medium");
        expect(format).toEqual("MMM d, y");
    });

    it("should return regexes defined in the configuration", function() {
        var dateRegex = oui5lib.configuration.getDateRegex();
        expect(dateRegex instanceof RegExp).toBe(true);

        var timeRegex = oui5lib.configuration.getTimeRegex();
        expect(timeRegex instanceof RegExp).toBe(true);

        var phoneRegex = oui5lib.configuration.getPhoneRegex();
        expect(phoneRegex instanceof RegExp).toBe(true);

        var emailRegex = oui5lib.configuration.getEmailRegex();
        expect(emailRegex instanceof RegExp).toBe(true);
    });
});
