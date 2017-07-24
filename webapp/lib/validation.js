jQuery.sap.declare("oui5lib..validation");

(function() {
    function validateData(data, paramDefs) {
        var msgs = [];
        for (var i = 0, s = paramDefs.length; i < s; i++) {
            var paramDef = paramDefs[i];

            var paramName = paramDef.name;
            var paramValue = data[paramName];

            // required
            var isRequired = false;
            if (typeof paramDef.required === "boolean") {
                isRequired = paramDef.required;
            }
            if (isRequired &&
                (typeof paramValue === "undefined" || paramValue === null)) {
                msgs.push("missing:" + paramName);
                continue;
            }

            // default type is 'string'
            var type = "string";
            if (typeof paramDef.type !== "undefined") {
                type = paramDef.type;
            }

            if (isRequired) {
                switch(type) {
                case "string":
                case "Date":
                case "Time":
                    if (!(paramValue instanceof Date)) {
                        msgs.push("wrongType:" + paramName);
                        continue;
                    }
                    break;
                }
            }
            
            // run validation tests
            var tests = null;
            if (typeof paramDef.validate !== "undefined" &&
                paramDef.validate instanceof Array) {
                tests = paramDef.validate;
            }
            if (tests !== null) {
                if (typeof paramValue !== type) {
                    if (type !== "email" && type !== "phone") { 
                        msgs.push("wrongType: " + paramName);
                    }
                    continue;
                }
                if (!this.isValid(paramValue, tests)) {
                    msgs.push("invalid:" + paramName);
                    continue;
                }
            }
            // allowedValues
            if (typeof paramDef.allowedValues !== "undefined") {
                var allowedValues = paramDef.allowedValues;
                if (allowedValues.indexOf(paramValue) === -1) {
                    msgs.push("notAllowed:" + paramName);
                    continue;
                }
            }
        }
        return msgs;
    }
    
    /**
     * Test validity of value against a list of tests.
     * @function baselib.validation.isValid
     * @param vlue The value to be tested.
     * @param {array} tests The tests to be run.
     * @returns {boolean} valid or not
     */
    function isValid(vlue, tests) {
        var valid = true;
        if (tests) {
            for (var i = 0, s = tests.length; i < s; i++) {
                var test = tests[i];

                var match = test.match(/([a-z]+)_(\d+)/);
                var number = null;
                if (match !== null && match.length === 3) {
                    test = match[1];
                    number = parseInt(match[2]);
                }
                
                switch (test) {
                case "required":
                    if (typeof vlue === "undefined" || isBlank(vlue)) {
                        valid = false;
                    }
                    break;
                case "numbersOnly":
                    if (!numbersOnly(vlue)) {
                        valid = false;
                    }
                    break;
                case "hasLetters":
                    if (!hasLetters(vlue)) {
                        valid = false;
                    }
                    break;
                case "length":
                    if (!verifyLength(vlue, number)) {
                        valid = false;
                    }
                    break;
                case "isValidEmail":
                    if (!isBlank(vlue)) {
                        if (!custom("email", vlue)) {
                            valid = false;
                        }
                    }
                    break;
                case "isValidSms":
                    if (!(isBlank(vlue))) {
                        if (!custom("sms", vlue)) {
                            valid = false;
                        }
                    }
                    break;
                case "isValidTimeString":
                    vlue = vlue.trim();
                    if (!(isBlank(vlue))) {
                        match = vlue.match(/(\d+) (\d+)/);
                        if (match === null || match.length !== 3) {
                            valid = false;
                        }
                    }
                    break;
                }
            }
        }
        return valid;
    }
    
    /**
     * Custom validations. Currently validates email, sms.
     * @param {string} fnme Available: 'email', 'sms'
     * @param {string} vlue The value to be tested.
     * @returns {boolean}
     */
    function custom(fnme, vlue) {
        var regex;

        switch(fnme) {
        case "email":
            regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            break;
        case "sms":
            regex = /^0{2}[1-9][\d]*$/;
            break;
        }
        return regex.test(vlue);
    }

    /**
     * Tests if value is a valid date. Format: YYYY:MM:DD
     * @param vlue The value to be validated.
     * @returns {boolean}
     */
    function isValidDate(vlue) {
        var regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(vlue);
    }

    /**
     * Tests if value is a valid time. Format: HH:mm:ss
     * @param vlue The value to be validated.
     * @returns {boolean}
     */
    function isValidTime(vlue) {
        var regex = /^\d{2}:\d{2}:\d{2}$/;
        return regex.test(vlue);
    }
    
    /**
     * Tests if value contains only digits.
     * @param vlue The value to be tested.
     * @returns {boolean}
     */
    function numbersOnly(vlue) {
        if (!isBlank(vlue)) {
            var regex = /^[\d]+$/;
            return regex.test(vlue);
        }
        return true;
    }

    /**
     * Tests if value contains any letters.
     * @param vlue The value to be tested.
     * @returns {boolean}
     */
    function hasLetters(vlue) {
        if (!isBlank(vlue)) {
            var regex = /[A-Za-z]+/;
            return regex.test(vlue);
        }
        return true;
    }

    /**
     * Tests if a string has a certain length.
     * @param {string} vlue The string to be tested.
     * @param {int} number The length.
     * @returns {boolean}
     */
    function verifyLength(vlue, number) {
        if (vlue.length !== number) {
            return false;
        }
        return true;
    }
    
    /**
     * Tests if value is null or empty.
     * @param vlue The value to be tested.
     * @returns {boolean}
     */
    function isBlank(vlue) {
        if (vlue === null || typeof vlue === "undefined") {
            return true;
        }      
        for (var i = 0; i < vlue.length; i++) {
            var c = vlue.charAt(i);
            if (c != ' ' && c != '\n' && c != '\t') {
                return false;
            }
        }
        return true;
    }

    var validation = oum.namespace("lib.validation");
    validation.validateData = validateData;
    validation.isValid = isValid;

    // only for testing
    validation.numbersOnly = numbersOnly;
    validation.hasLetters = hasLetters;
    validation.isValidDate = isValidDate;
    validation.isValidTime = isValidTime;
    validation.verifyLength = verifyLength;
    validation.isBlank = isBlank;
    validation.custom = custom;
}());
