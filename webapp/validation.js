(function(configuration, util) {
    "use strict";
    
    /** @namespace oui5lib.validation */
    const validation = oui5lib.namespace("validation");

    let _msgs;    

    /**
     * Validate data against entity definition provided by the mapping.
     * @memberof oui5lib.validation
     * @param {object} data The data to be validated.
     * @param {object} propertyDefinitions The definition of properties from the mapping.
     * @returns {array} The list of error messages. May be empty.
     */
    function validateData(data, attributeSpecs, newValidation) {
        if (typeof newValidation !== "boolean") {
            newValidation = true;
        }
        if (newValidation) {
            _msgs = [];
        }
        for (let i = 0, s = attributeSpecs.length; i < s; i++) {
            const attributeSpec = attributeSpecs[i];
            const attributeName = attributeSpec.name;

            switch (attributeSpec.type) {
            case "array":
                handleArray(data[attributeName], attributeSpec, _msgs);
                continue;
            case "object":
                if (typeof data[attributeName] === "object") {
                    validateData(data[attributeName], attributeSpec.objectItem, false);
                } else {
                    if (attributeSpec.required) {
                        _msgs.push("missing:" + attributeName);
                    }
                }
                continue;
            }
            
            const attributeValue = getAttributeValue(data, attributeSpec);

            // required
            if (attributeSpec.required) {
                if (attributeValue === null ||
                    (typeof attributeValue === "string" && util.isBlank(attributeValue))) {
                    _msgs.push("missing:" + attributeName);
                    continue;
                }
            }
            // wrong type
            if (attributeSpec.required || attributeValue !== null) {
                if (hasWrongType(attributeSpec.type, attributeValue)) {
                    _msgs.push("wrongType:" + attributeName);
                    continue;
                }
            }
            // run validation tests
            if (attributeSpec.validate !== undefined &&
                attributeSpec.validate instanceof Array) {
                if (!isValid(attributeValue, attributeSpec.validate)) {
                    _msgs.push("invalid:" + attributeName);
                    continue;
                }
            }
            // allowedValues
            if (typeof attributeSpec.allowedValues !== "undefined") {
                let allowedValues = attributeSpec.allowedValues;
                if (!isValueAllowed(allowedValues, attributeValue)) {
                    _msgs.push("notAllowed:" + attributeName);
                    continue;
                }
            }
        }
        return _msgs;
    }

    function getAttributeValue(data, attributeSpec) {
        const attributeName = attributeSpec.name;
        let attributeValue = null;
        if (typeof data[attributeName] !== "undefined") {
            attributeValue = data[attributeName];
        } else if (typeof attributeSpec.default !== "undefined") {
            attributeValue = attributeSpec.default;
        }
        return attributeValue;
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
        case "email":
        case "phone":
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
        }
        return false;
    }

    function handleArray(data, attributeSpec, _msgs) {
        if (data instanceof Array && data.length > 0) {
            if (typeof attributeSpec.arrayItem !== "undefined") {
                const arrayDefs = attributeSpec.arrayItem;
                // an array of objects
                data.forEach(function(item) {
                    validateData(item, arrayDefs, false);
                });
            } else {
                // an array of strings
                if (typeof attributeSpec.allowedValues !== "undefined") {
                    const allowedValues = attributeSpec.allowedValues;
                    data.forEach(function(value) {
                        if (!isValueAllowed(allowedValues, value)) {
                            _msgs.push("notAllowed:" + attributeSpec.name + ":" + value);
                        }
                    });
                }
            }
        } else {
            if (attributeSpec.required) {
                _msgs.push("missing:" + attributeSpec.name);
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
        if (tests.indexOf("required") > -1) {
            if ((typeof value === "string") && util.isBlank(value)) {
                return false;
            }
        }

        let valid = true;
        if (tests instanceof Array && tests.length > 0) {
            tests.forEach(function(test) {
                const match = test.match(/([a-zA-Z]+)_(\d+)/);
                let number = null;
                if (match !== null && match.length === 3) {
                    test = match[1];
                    number = parseInt(match[2]);
                }

                if (value instanceof Date) {
                    switch (test) {
                    case "future":
                        if (!isFuture(value)) {
                            valid = false;
                        }
                        break;
                    case "past":                        
                        if (!isPast(value)) {
                            valid = false;
                        }
                        break;
                    }
                    return valid;
                }
                
                switch (test) {
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
                    if (!util.isBlank(value)) {
                        if (!numbersOnly(value)) {
                            valid = false;
                        }
                    }
                    break;
                case "noNumbers":
                    if (!util.isBlank(value)) {
                        if (!noNumbers(value)) {
                            valid = false;
                        }
                    }
                    break;
                case "containsLetters":
                    if (!(util.isBlank(value))) {
                        if (!hasLetters(value)) {
                            valid = false;
                        }
                    }
                    break;
                case "email":
                case "phone":
                    if (!(util.isBlank(value))) {
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
        let regex;

        switch(fnme) {
        case "email":
            regex = configuration.getEmailRegex();
            break;
        case "phone":
            regex = configuration.getPhoneRegex();
            break;
        }
        return regex.test(value);
    }
    function isFuture(value) {
        const now = new Date();
        if (now.getTime() < value.getTime()) {
            return true;
        }
        return false;
    }
    function isPast(value) {
        const now = new Date();
        if (now.getTime() > value.getTime()) {
            return true;
        }
        return false;
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
        const regex = /^[\d]+$/;
        return regex.test(value);
    }

    /**
     * Tests if value contains no digits.
     * @memberof oui5lib.validation
     * @param value The value to be tested.
     * @returns {boolean}
     */
    function noNumbers(value) {
        const regex = /^[^\d]+$/;
        return regex.test(value);
    }

    /**
     * Tests if value contains any letters.
     * @memberof oui5lib.validation
     * @param value The value to be tested.
     * @returns {boolean}
     */
    function hasLetters(value) {
        const regex = /[A-Za-z]+/;
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
     * Tests if value is a valid date. Default pattern: YYYY-MM-DD
     * @memberof oui5lib.validation
     * @param value The value to be validated.
     * @param {string} regex The regular expression to validate against.
     * @returns {boolean}
     */
    function isValidDateString(value, regex) {
        if (!(regex instanceof RegExp)) {
            regex = configuration.getDateRegex();
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
            regex = configuration.getTimeRegex();
        }
        return regex.test(value);
    }

    
    validation.validateData = validateData;
    validation.isValid = isValid;
    validation.isValidDate = isValidDateString;
    validation.isValidTime = isValidTimeString;

    // only for testing
    validation.numbersOnly = numbersOnly;
    validation.hasLetters = hasLetters;
    validation.verifyLength = verifyLength;
    validation.minLength = minLength;
    validation.maxLength = maxLength;
    validation.min = min;
    validation.max = max;
    validation.custom = custom;

}(oui5lib.configuration, oui5lib.util));
