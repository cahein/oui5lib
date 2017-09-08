jQuery.sap.require("oui5lib.configuration");

jQuery.sap.declare("oui5lib.validation");

/** @namespace oui5lib.validation */
(function() {
    var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

    var dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    var timeRegex = /^\d{2}:\d{2}:\d{2}$/;
    var phoneRegex = /^0{2}[1-9][\d]*$/;
    
    /**
     * Validate data against entity definition provided by the mapping.
     * @memberof oui5lib.validation
     * @param {object} data The data to be validated.
     * @param {object} paramDefinitions The definition of parameters.
     * @returns {array} The list of error messages. May be empty.
     */
    function validateData(data, paramDefinitions) {
        var msgs = [];
        for (var i = 0, s = paramDefinitions.length; i < s; i++) {
            var paramDef = paramDefinitions[i];
            var paramName = paramDef.name;

            var paramValue = null;
            if (typeof data[paramName] !== "undefined") {
                paramValue = data[paramName];
            } else if (typeof paramDef.default !== "undefined") {
                paramValue = paramDef.default;
            }
            
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
                    if (typeof paramValue !== "string") {
                        msgs.push("wrongType:" + paramName);
                    }
                    break;
                case "Date":
                case "Time":
                    if (!(paramValue instanceof Date)) {
                        msgs.push("wrongType:" + paramName);
                        continue;
                    }
                    break;
                case "email":
                case "phone":
                    
                }
            }
            
            // run validation tests
            var tests = null;
            if (typeof paramDef.validate !== "undefined" &&
                paramDef.validate instanceof Array) {
                tests = paramDef.validate;
            }
            if (tests !== null) {
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
     * @memberof oui5lib.validation
     * @param vlue The value to be tested.
     * @param {array} tests The tests to be run.
     * @returns {boolean} valid or not
     */
    function isValid(vlue, tests) {
        oui5lib.logger.debug("testing value: " + vlue);
        var valid = true;
        if (tests && tests.length > 0) {
            for (var i = 0, s = tests.length; i < s; i++) {
                var test = tests[i];

                var match = test.match(/([a-zA-Z]+)_(\d+)/);
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
                case "min":
                    if (!min(vlue, number)) {
                        valid = false;
                    }
                    break;
                case "max":
                    if (!max(vlue, number)) {
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
                case "minLength":
                    if (!minLength(vlue, number)) {
                        valid = false;
                    }
                    break;
                case "maxLength":
                    if (!maxLength(vlue, number)) {
                        valid = false;
                    }
                    break;
                case "validEmail":
                    if (!isBlank(vlue)) {
                        if (!custom("email", vlue)) {
                            valid = false;
                        }
                    }
                    break;
                case "validPhone":
                    if (!(isBlank(vlue))) {
                        if (!custom("phone", vlue)) {
                            valid = false;
                        }
                    }
                    break;
                }
            }
        }
        oui5lib.logger.debug("valid: " + valid);
        return valid;
    }
    
    /**
     * Custom validations. Currently validates email, phone.
     * @param {string} fnme Available: 'email', 'phone'
     * @param {string} vlue The value to be tested.
     * @returns {boolean}
     */
    function custom(fnme, vlue) {
        var regex;

        switch(fnme) {
        case "email":
            regex = emailRegex;
            break;
        case "phone":
            regex = getPhoneRegex();
            break;
        }
        return regex.test(vlue);
    }

    /**
     * Tests if value is a valid date. Default pattern: YYYY-MM-DD
     * @memberof oui5lib.validation
     * @param vlue The value to be validated.
     * @param {string} regex The regular expression to validate against.
     * @returns {boolean}
     */
    function isValidDateString(vlue, regex) {
        if (!(regex instanceof RegExp)) {
            regex = getDateRegex();
        }
        return regex.test(vlue);
    }

    /**
     * Tests if value is a valid time string. Default pattern: HH:mm:ss
     * @memberof oui5lib.validation
     * @param {string} vlue The value to be validated.
     * @param {string} regex The regular expression to validate against.
     * @returns {boolean}
     */
    function isValidTimeString(vlue, regex) {
        if (!(regex instanceof RegExp)) {
            regex = getTimeRegex();
        }
        return regex.test(vlue);
    }
    
    /**
     * Tests if value contains only digits.
     * @memberof oui5lib.validation
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
     * Tests if an integer or float has a certain minimum value.
     * @memberof oui5lib.validation
     * @param {string|number} vlue The number to be tested.
     * @param {int} number The minimum.
     * @returns {boolean}
     */
    function min(vlue, number) {
        if (isNaN(vlue)) {
            return false;
        }

        if (typeof vlue === "string") {
            vlue = parseFloat(vlue);
        }
        if (vlue < number) {
            return false;
        }
        return true;
    }

    /**
     * Tests if an integer or float has a certain maximum value.
     * @memberof oui5lib.validation
     * @param {string|number} vlue The number to be tested.
     * @param {int} number The minimum.
     * @returns {boolean}
     */
    function max(vlue, number) {
        if (isNaN(vlue)) {
            return false;
        }
        
        if (typeof vlue === "string") {
            vlue = parseFloat(vlue);
        }
        if (vlue > number) {
            return false;
        }
        return true;
    }

    /**
     * Tests if value contains any letters.
     * @memberof oui5lib.validation
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
     * @memberof oui5lib.validation
     * @param {string|array} vlue The string or array to be tested.
     * @param {int} number The required length.
     * @returns {boolean}
     */
    function verifyLength(vlue, number) {
        if (vlue.length !== number) {
            return false;
        }
        return true;
    }
    
    /**
     * Tests if a string has a certain minimum length.
     * @memberof oui5lib.validation
     * @param {string|array} vlue The string or array to be tested.
     * @param {int} number The length minimum.
     * @returns {boolean}
     */
    function minLength(vlue, number) {
        if (vlue.length < number) {
            return false;
        }
        return true;
    }

    /**
     * Tests if a string is not longer than a certain maximum length.
     * @memberof oui5lib.validation
     * @param {string|array} vlue The string or array to be tested.
     * @param {int} number The length maximum.
     * @returns {boolean}
     */
    function maxLength(vlue, number) {
        if (vlue.length > number) {
            return false;
        }
        return true;
    }

    /**
     * Tests if value is null or empty.
     * @memberof oui5lib.validation
     * @param vlue The value to be tested.
     * @returns {boolean}
     */
    function isBlank(vlue) {
        if (vlue === null || typeof vlue === "undefined") {
            return true;
        }      
        for (var i = 0; i < vlue.length; i++) {
            var c = vlue.charAt(i);
            if (c != " " && c != "\n" && c != "\t") {
                return false;
            }
        }
        return true;
    }

    function getDateRegex() {
        var customRegex = oui5lib.configuration.getRegex("date");
        if (customRegex !== null &&
            customRegex instanceof RegExp) {
            return customRegex;
        }
        return dateRegex;
    }

    function getTimeRegex() {
        var customRegex = oui5lib.configuration.getRegex("time");
        if (customRegex !== null &&
            customRegex instanceof RegExp) {
            return customRegex;
        }
        return timeRegex;
    }

    function getPhoneRegex() {
        var customRegex = oui5lib.configuration.getRegex("phone");
        if (customRegex !== null &&
            customRegex instanceof RegExp) {
            return customRegex;
        }
        return phoneRegex;
    }


    var validation = oui5lib.namespace("validation");
    validation.validateData = validateData;
    validation.isValid = isValid;
    validation.isBlank = isBlank;

    // only for testing
    validation.numbersOnly = numbersOnly;
    validation.hasLetters = hasLetters;
    validation.isValidDate = isValidDateString;
    validation.isValidTime = isValidTimeString;
    validation.verifyLength = verifyLength;
    validation.minLength = minLength;
    validation.maxLength = maxLength;
    validation.custom = custom;
}());
