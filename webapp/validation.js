jQuery.sap.require("oui5lib.configuration");

jQuery.sap.declare("oui5lib.validation");

/** @namespace oui5lib.validation */
(function() {
    var msgs;    

    /**
     * Validate data against entity definition provided by the mapping.
     * @memberof oui5lib.validation
     * @param {object} data The data to be validated.
     * @param {object} propertyDefinitions The definition of properties from the mapping.
     * @returns {array} The list of error messages. May be empty.
     */
    function validateData(data, propertyDefinitions, newValidation) {
        if (typeof newValidation !== "boolean") {
            newValidation = true;
        }
        if (newValidation) {
            msgs = [];
        }
        
        for (var i = 0, s = propertyDefinitions.length; i < s; i++) {
            var propDef = propertyDefinitions[i];
            var propName = propDef.name;

            switch (propDef.type) {
            case "collection":
                handleCollection(data[propName], propDef, msgs);
                continue;
            case "object":
                if (typeof data[propName] === "object") {
                    validateData(data[propName], propDef.objectItem, false);
                } else {
                    if (propDef.required) {
                        msgs.push("missing:" + propName);
                    }
                }
                continue;
            }
            
            var propValue = null;
            if (typeof data[propName] !== "undefined") {
                propValue = data[propName];
            } else if (typeof propDef.default !== "undefined") {
                propValue = propDef.default;
            }

            // required
            if (propDef.required) {
                if (propValue === null ||
                    (typeof propValue === "string" && isBlank(propValue))) {
                    msgs.push("missing:" + propName);
                    continue;
                }
            }
            // wrong type
            if (propDef.required || propValue !== null) {
                if (hasWrongType(propDef.type, propValue)) {
                    msgs.push("wrongType:" + propName);
                    continue;
                }
            }
            // run validation tests
            if (propDef.validate !== undefined &&
                propDef.validate instanceof Array) {
                if (!isValid(propValue, propDef.validate)) {
                    msgs.push("invalid:" + propName);
                    continue;
                }
            }
            // allowedValues
            if (typeof propDef.allowedValues !== "undefined") {
                var allowedValues = propDef.allowedValues;
                if (!isValueAllowed(allowedValues, propValue)) {
                    msgs.push("notAllowed:" + propName);
                    continue;
                }
            }
        }
        return msgs;
    }

    function isValueAllowed(allowedValues, value) {
        if (allowedValues.indexOf(value) === -1) {
            return false;
        }
        return true;
    }

    function hasWrongType(type, value) {
        switch(type) {
        case "string":
            if (typeof value !== "string") {
                return true;
            }
            break;
        case "int":
            if (typeof value === "string") {
                if (parseInt(value)) {
                    value = parseInt(value);
                }
            }
            if (typeof value !== "number") {
                return true;
            }
            break;
        case "boolean":
            if (typeof value !== "boolean") {
                if (!(value instanceof Boolean)) {
                    return true;
                }
            }
            break;
        case "Date":
            if (!(value instanceof Date)) {
                return true;
            }
            break;
        case "email":
        case "phone":
            break;
        }
        return false;
    }

    function handleCollection(data, propDef, msgs) {
        if (data instanceof Array && data.length > 0) {
            if (typeof propDef.collectionItem !== "undefined") {
                var collectionDefs = propDef.collectionItem;
                // an array of objects
                data.forEach(function(item) {
                    validateData(item, collectionDefs, false);
                });
            } else {
                // an array of strings
                if (typeof propDef.allowedValues !== "undefined") {
                    var allowedValues = propDef.allowedValues;
                    data.forEach(function(value) {
                        if (!isValueAllowed(allowedValues, value)) {
                            msgs.push("notAllowed:" + propDef.name + ":" + value);
                        }
                    });
                }
            }
        } else {
            if (propDef.required) {
                msgs.push("missing:" + propDef.name);
            }
        }
    }
    
    
    /**
     * Test validity of value against a list of constraints.
     * @memberof oui5lib.validation
     * @param value The value to be validated.
     * @param {array} tests The list of contraints.
     * @returns {boolean} valid or not
     */
    function isValid(value, tests) {
        var valid = true;
        if (tests instanceof Array && tests.length > 0) {
            tests.forEach(function(test) {
                var match = test.match(/([a-zA-Z]+)_(\d+)/);
                var number = null;
                if (match !== null && match.length === 3) {
                    test = match[1];
                    number = parseInt(match[2]);
                }
                switch (test) {
                case "required":
                    if (typeof value === "undefined" || isBlank(value)) {
                        valid = false;
                    }
                    break;
                case "minimum":
                    if (!min(value, number)) {
                        valid = false;
                    }
                    break;
                case "maximum":
                    if (!max(value, number)) {
                        valid = false;
                    }
                    break;
                case "length":
                    if (!verifyLength(value, number)) {
                        valid = false;
                    }
                    break;
                case "minLength":
                    if (!minLength(value, number)) {
                        valid = false;
                    }
                    break;
                case "maxLength":
                    if (!maxLength(value, number)) {
                        valid = false;
                    }
                    break;
                case "numbersOnly":
                    if (!isBlank(value)) {
                        if (!numbersOnly(value)) {
                            valid = false;
                        }
                    }
                    break;
                case "noNumbers":
                    if (!isBlank(value)) {
                        if (!noNumbers(value)) {
                            valid = false;
                        }
                    }
                    break;
                case "containsLetters":
                    if (!(isBlank(value))) {
                        if (!hasLetters(value)) {
                            valid = false;
                        }
                    }
                    break;
                case "email":
                case "phone":
                    if (!(isBlank(value))) {
                        if (!custom(test, value)) {
                            valid = false;
                        }
                    }
                    break;
                }
            });
        }
        return valid;
    }
    
    /**
     * Custom regular expression validations. Currently validates email, phone.
     * @param {string} fnme Available: 'email', 'phone'
     * @param {string} value The value to be tested.
     * @returns {boolean}
     */
    function custom(fnme, value) {
        var regex;

        switch(fnme) {
        case "email":
            regex = oui5lib.configuration.getEmailRegex();
            break;
        case "phone":
            regex = oui5lib.configuration.getPhoneRegex();
            break;
        }
        return regex.test(value);
    }

    /**
     * Tests if value is a valid date. Default pattern: YYYY-MM-DD
     * @memberof oui5lib.validation
     * @param value The value to be validated.
     * @param {string} regex The regular expression to validate against.
     * @returns {boolean}
     */
    function isValidDateString(value, regex) {
        if (!(regex instanceof RegExp)) {
            regex = oui5lib.configuration.getDateRegex();
        }
        return regex.test(value);
    }

    /**
     * Tests if value is a valid time string. Default pattern: HH:mm:ss
     * @memberof oui5lib.validation
     * @param {string} value The value to be validated.
     * @param {string} regex The regular expression to validate against.
     * @returns {boolean}
     */
    function isValidTimeString(value, regex) {
        if (!(regex instanceof RegExp)) {
            regex = oui5lib.configuration.getTimeRegex();
        }
        return regex.test(value);
    }
    
    /**
     * Tests if an integer or float has a certain minimum value.
     * @memberof oui5lib.validation
     * @param {string|number} value The number to be tested.
     * @param {int} number The minimum.
     * @returns {boolean}
     */
    function min(value, number) {
        value = getFloatValue(value);
        if (value) {
            if (value >= number) {
                return true;
            }
        }
        return false;
    }

    /**
     * Tests if an integer or float has a certain maximum value.
     * @memberof oui5lib.validation
     * @param {string|number} value The number to be tested.
     * @param {int} number The minimum.
     * @returns {boolean}
     */
    function max(value, number) {
        value = getFloatValue(value);
        if (value) {
            if (value <= number) {
                return true;
            }
        }
        return false;
    }

    function getFloatValue(value) {
        if (isNaN(value)) {
            return false;
        }
        
        if (typeof value === "string") {
            value = parseFloat(value);
        }
        return value;
    }
    
    /**
     * Tests if value contains only digits.
     * @memberof oui5lib.validation
     * @param value The value to be tested.
     * @returns {boolean}
     */
    function numbersOnly(value) {
        var regex = /^[\d]+$/;
        return regex.test(value);
    }

    /**
     * Tests if value contains no digits.
     * @memberof oui5lib.validation
     * @param value The value to be tested.
     * @returns {boolean}
     */
    function noNumbers(value) {
        var regex = /^[^\d]+$/;
        return regex.test(value);
    }

/**
     * Tests if value contains any letters.
     * @memberof oui5lib.validation
     * @param value The value to be tested.
     * @returns {boolean}
     */
    function hasLetters(value) {
        var regex = /[A-Za-z]+/;
        return regex.test(value);
    }

    /**
     * Tests if a string has a certain length.
     * @memberof oui5lib.validation
     * @param {string|array} value The string or array to be tested.
     * @param {int} number The required length.
     * @returns {boolean}
     */
    function verifyLength(value, number) {
        if (value.length !== number) {
            return false;
        }
        return true;
    }
    
    /**
     * Tests if a string has a certain minimum length.
     * @memberof oui5lib.validation
     * @param {string|array} value The string or array to be tested.
     * @param {int} number The length minimum.
     * @returns {boolean}
     */
    function minLength(value, number) {
        if (value.length < number) {
            return false;
        }
        return true;
    }

    /**
     * Tests if a string is not longer than a certain maximum length.
     * @memberof oui5lib.validation
     * @param {string|array} value The string or array to be tested.
     * @param {int} number The length maximum.
     * @returns {boolean}
     */
    function maxLength(value, number) {
        if (value.length > number) {
            return false;
        }
        return true;
    }

    /**
     * Tests if value is null or empty.
     * @memberof oui5lib.validation
     * @param value The value to be tested.
     * @returns {boolean}
     */
    function isBlank(value) {
        if (value === null || typeof value === "undefined") {
            return true;
        }
        for (var i = 0; i < value.length; i++) {
            var c = value.charAt(i);
            if (c != " " && c != "\n" && c != "\t") {
                return false;
            }
        }
        return true;
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
    validation.min = min;
    validation.max = max;
    validation.custom = custom;
}());

