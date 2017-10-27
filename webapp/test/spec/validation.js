describe("validation", function() {
    it("should test for numbers only", function() {
        expect(oui5lib.validation.numbersOnly("1234e")).toBe(false);
        expect(oui5lib.validation.numbersOnly("1234")).toBe(true);
    });

    it("should test for letters", function() {
        expect(oui5lib.validation.hasLetters("1234e")).toBe(true);
        expect(oui5lib.validation.hasLetters("1234")).toBe(false);
    });

    it("should validate email", function() {
        expect(oui5lib.validation.custom("email", "<some@email.com>")).toBe(true);
        expect(oui5lib.validation.custom("email", "John Somebody <some@email.com>")).toBe(true);
        expect(oui5lib.validation.custom("email", "some@email.com")).toBe(true);
        expect(oui5lib.validation.custom("email", "some-email.com")).toBe(false);
    });

    it("should validate phone", function() {
        expect(oui5lib.validation.custom("phone", "0049421345678")).toBe(true);
        expect(oui5lib.validation.custom("phone", "0004942134567")).toBe(false);
        expect(oui5lib.validation.custom("phone", "49421345678")).toBe(false);
        expect(oui5lib.validation.custom("phone", "049421345678")).toBe(false);
        expect(oui5lib.validation.custom("phone", "+0049421345678")).toBe(false);
        expect(oui5lib.validation.custom("phone", "+49421345678")).toBe(false);
    });

    it("should validate date format", function() {
        expect(oui5lib.validation.isValidDate("2000-02-10")).toBe(true);
        expect(oui5lib.validation.isValidDate("2000-2-10")).toBe(false);
        expect(oui5lib.validation.isValidDate("2000-02-1")).toBe(false);
        expect(oui5lib.validation.isValidDate("200-02-10")).toBe(false);
    });

    it("should validate time format", function() {
        expect(oui5lib.validation.isValidTime("20:01:05")).toBe(true);
        expect(oui5lib.validation.isValidTime("1:15")).toBe(false);
        expect(oui5lib.validation.isValidTime("12:10")).toBe(false);
        expect(oui5lib.validation.isValidTime("12:10", /^\d{2}:\d{2}$/)).toBe(true);
        expect(oui5lib.validation.isValidTime("02:10:00")).toBe(true);
        expect(oui5lib.validation.isValidTime("2:10:00")).toBe(false);
    });

    it("should test if value is null or empty", function() {
        expect(oui5lib.validation.isBlank(null)).toBe(true);
        expect(oui5lib.validation.isBlank()).toBe(true);
        expect(oui5lib.validation.isBlank("  ")).toBe(true);
        expect(oui5lib.validation.isBlank("  a")).toBe(false);
    });

    it("should test the length of a string", function() {
        expect(oui5lib.validation.verifyLength("abcde", 4)).toBe(false);
        expect(oui5lib.validation.verifyLength("abcde", 5)).toBe(true);
        expect(oui5lib.validation.verifyLength("abcde", 6)).toBe(false);
    });

    it("should test the minimum length of a string", function() {
        expect(oui5lib.validation.minLength("abcde", 4)).toBe(true);
        expect(oui5lib.validation.minLength("abcde", 5)).toBe(true);
        expect(oui5lib.validation.minLength("abcde", 6)).toBe(false);
    });
    
    it("should test the maximum length of a string", function() {
        expect(oui5lib.validation.maxLength("abcde", 4)).toBe(false);
        expect(oui5lib.validation.maxLength("abcde", 5)).toBe(true);
        expect(oui5lib.validation.maxLength("abcde", 6)).toBe(true);
    });

    it("should validate an object depending on the parameter definitions of the mapping", function() {
        var paramDefs = [
            {
                "name": "userId",
                "required": true
            },
            {
                "name": "persNr",
                "required": true,
                "validate": [
                    "numbersOnly",
                    "length_8"
                ]
            },
            {
                "name": "name",
                "required": true,
                "validate": [
                    "hasLetters"
                ]
            },
            {
                "name": "email",
                "type": "email",
                "validate": [
                    "validEmail"
                ]
            },
            {
                "name": "emailActive",
                "type": "boolean",
                "default": false
            },
            {
                "name": "sms",
                "type": "phone",
                "validate": [
                    "validPhone"
                ]
            },
            {
                "name": "smsActive",
                "type": "boolean",
                "default": false
            },
            {
                "name": "role",
                "required": true,
                "default": "user",
                "allowedValues": ["user", "administrator"]
            },
            {
                "name": "roles",
                "required": true,
                "type": "collection",
                "allowedValues": ["user", "administrator"]
            },
            {
                "name": "other",
                "required": true,
                "type": "collection",
                "collectionItem": [
                    {
                        "name": "a",
                        "required": true
                    },
                    {
                        "name": "b"
                    }
                ]
            },
            {
                "name": "permissions",
                "required": true,
                "type": "object",
                "objectItem": [
                    {
                        "name": "saveUser",
                        "type": "boolean",
                        "default": false
                    }
                ]
            }
        ];

        var userData = {
            "persNr": "12345",
            "name": "Ca Hein",
            "email": "<any@host.name>",
            "emailActive": true,
            "sms": "124567890",
            "smsActive": false,
            "role": "administrator"
        };
        var msgs = oui5lib.validation.validateData(userData, paramDefs);
        expect(msgs.length).toEqual(6);
        expect(msgs[0]).toEqual("missing:userId");
        expect(msgs[1]).toEqual("invalid:persNr");
        expect(msgs[2]).toEqual("invalid:sms");
        expect(msgs[3]).toEqual("missing:roles");
        expect(msgs[4]).toEqual("missing:other");
        expect(msgs[5]).toEqual("missing:permissions");

        userData.persNr = "12345678";
        userData.roles = [];
        userData.other = [];
        userData.permissions = { };
        msgs = oui5lib.validation.validateData(userData, paramDefs);
        expect(msgs.length).toEqual(4);
        expect(msgs[0]).toEqual("missing:userId");
        expect(msgs[1]).toEqual("invalid:sms");
        expect(msgs[2]).toEqual("missing:roles");
        expect(msgs[3]).toEqual("missing:other");

        userData.sms = "00492345124581";
        userData.roles = ["maintainer"];
        userData.other = [{ "b": "not required" }];
        msgs = oui5lib.validation.validateData(userData, paramDefs);
        expect(msgs.length).toEqual(3);
        expect(msgs[0]).toEqual("missing:userId");
        expect(msgs[1]).toEqual("notAllowed:roles");
        expect(msgs[2]).toEqual("missing:a");

        userData.userId = "ab34uni";
        userData.other = [{ "a": "ok", "b": false }];
        userData.roles = ["user"];
        msgs = oui5lib.validation.validateData(userData, paramDefs);
        expect(msgs.length).toEqual(1);
        expect(msgs[0]).toEqual("wrongType:b");

        userData.role = "oUser";
        userData.other = [{ "a": "ok", "b": "is string" }];
        msgs = oui5lib.validation.validateData(userData, paramDefs);
        expect(msgs.length).toEqual(1);
        expect(msgs[0]).toEqual("notAllowed:role");
    });
});
