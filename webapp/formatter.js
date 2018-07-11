jQuery.sap.require("sap.ui.core.format.DateFormat");

(function(configuration) {
    "use strict";

    /** @namespace oui5lib.formatter */
    const formatter = oui5lib.namespace("formatter");

    let dateFormat = null;
    if (oui5lib.util.isUI5Env()) {
        dateFormat = sap.ui.core.format.DateFormat;
    }
    
    /**
     * Converts date and time strings into Javascript Date.
     * @memberof oui5lib.formatter
     * @param {string} dateStr Given date value
     * @param {string} datePattern The date pattern. If undefined, the date pattern from the configuration is used.
     * @returns {Date}
     */
    function getDateFromString(dateStr, datePattern){
        if (dateFormat === null) {
            return dateStr;
        }
        if (datePattern === undefined) {
            datePattern = configuration.getDateTimeValuePattern("date");
        }
        const oDateFormat = dateFormat.getDateTimeInstance({
            pattern: datePattern,
            UTC: true
        });
        return oDateFormat.parse(dateStr, false, true);
    }

    /**
     * Converts date and time strings into Date.
     * @memberof oui5lib.formatter
     * @param {string} dateStr Given date value
     * @param {string} timeStr Given time value
     * @param {string} dateTimePattern The dateTime pattern. If undefined, the dateTime pattern from the configuration is used.
     * @returns {Date}
     */
    function getDateFromStrings(dateStr, timeStr, dateTimePattern){
        if (dateTimePattern === undefined) {
            dateTimePattern = configuration.getDateTimeValuePattern("dateTime");
        }
        const oDateFormat = dateFormat.getDateTimeInstance({
            pattern: dateTimePattern
        });
        return oDateFormat.parse(dateStr + " " + timeStr, false, true);
    }

    
    /**
     * Use to format a Date to a date string.
     * @memberof oui5lib.formatter
     * @param {Date} date The Date to be formatted.
     * @param {string} outFormat The output pattern. If undefined, the medium style date pattern from the locale is used.
     * @returns {string} The formatted date. Returns null if the given date is not a Date object.
     */
    function getDateString(date, outFormat) {
        if (date instanceof Date) {
            if (typeof outFormat === "undefined") {
                outFormat = configuration.getDateTimeDisplayPattern("date",
                                                                    "medium");
            }
            return formatDate(date, outFormat);
        }
        return null;
    }
    
    function getDateTimeString(date, outFormat) {
        if (date instanceof Date) {
            if (typeof outFormat === "undefined") {
                outFormat = configuration.getDateTimeDisplayPattern("dateTime",
                                                                    "medium");
            }
            return formatDate(date, outFormat);
        }
        return null;
    }
    
    /**
     * Use to format a Date to a time string.
     * @memberof oui5lib.formatter
     * @param {Date} date The Date to be formatted. 
     * @param {string} outFormat The output pattern. If undefined, the medium style time pattern from the locale is used.
     * @returns {string} Formatted time as a string.
     */ 
    function getTimeString(date, outFormat) {
        if (date instanceof Date) {
            if (typeof outFormat === "undefined") {
                outFormat = configuration.getDateTimeDisplayPattern("time", "medium");
            }
            return formatDate(date, outFormat);
        }
        return null;
    }
    
    /**
     * Use to formats a Date according to the specified date pattern.
     * @memberof oui5lib.formatter
     * @param {Date} date The Date to be formatted.
     * @param {string} outFormat The date pattern to format to. If undefined, an Error is thrown.
     * @returns {string} The formatted date or time.
     */
    function formatDate(date, outFormat) {
        if (outFormat === undefined) {
            throw new Error("required date pattern is undefined");
        }
        const oDateFormat = dateFormat.getDateTimeInstance({
            pattern: outFormat
        });
        return oDateFormat.format(date);
    }

    /**
     * Converts a date string with a specified pattern into another pattern.
     * @memberof oui5lib.formatter
     * @param {string} dateStr The date to be converted.
     * @param {string} outFormat The pattern to convert to. If undefined, the medium style date pattern from the locale is used.
     * @param {string} inFormat The pattern of the date to be converted. If undefined, the default date pattern from the configuration is used".
     * @returns {string} The reformatted date. Returns an empty string if the date cannot be parsed.
     */
    function convertDateString(dateStr, outFormat, inFormat) {
        if (typeof outFormat !== "string") {
            outFormat = configuration.getDateTimeValuePattern("medium", "date");
        }
        if (typeof inFormat !== "string") {
            inFormat = configuration.getDateTimeValuePattern("date");
        }
        const inDateFormat = dateFormat.getDateTimeInstance({
            pattern: inFormat
        });
        const outDateFormat = dateFormat.getDateTimeInstance({
            pattern: outFormat
        });

        const inDate = inDateFormat.parse(dateStr, false, true);
        if (inDate instanceof Date) {
            return outDateFormat.format(inDate);
        }
        return "";
    }
    
    /**
     * Converts industrial minutes to human readable time string.
     * @memberof oui5lib.formatter
     * @param {string|number} time Industrial minutes. 
     * @returns {string} Pattern "HH:mm"
     */
    function convertIndustrialMinutes(time){
        if(typeof time === "undefined" || time === "") {
            return "00:00";
        }
        if (typeof time === "number") {
            time = "" + time;
        }

        const timeArray = time.split(".");

        const fullMinutes = timeArray[0];
        let hours = Math.floor(fullMinutes / 60);          
        let minutes = fullMinutes % 60;

        if (hours <= 9) {
            hours = "0" + hours;
        }
        if (minutes <= 9) {
            minutes = "0" + minutes;
        }
        return hours + ":" + minutes;
    }

    /**
     * Converts human readable time string to industrial minutes.
     * @memberof oui5lib.formatter
     * @param {string} timeString The time string matching pattern HH:mm. 
     * @returns {number} The minutes.
     */
    function convertToIndustrialMinutes(timeString) {
        if (typeof timeString === "undefined") {
            return null;
        }
        
        let industrialMinutes = 0;
        const match = timeString.match(/^(\d+):(\d+):?(\d*)$/);
        if (match === null) {
            return null;
        }
        if (match.length === 4) {
            const hours = parseInt(match[1]);
            const minutes = parseInt(match[2]);
            industrialMinutes = (hours * 60) + minutes;
        }
        return industrialMinutes;
    }
    
    /**
     * base64 encode
     * @memberof oui5lib.formatter
     * @param {string} content The string to be encoded
     * @returns {string} The base64 encoded string
     */
    function base64Encode(content) {
        if (content === null) {
            return null;
        }
        return btoa(content);
    }
    
    /**
     * base64 decode
     * @memberof oui5lib.formatter
     * @param {string} content The base64 encoded string
     * @returns {string} The decoded string
     */
    function base64Decode(content) {
        if (content === null) {
            return null;
        }
        return atob(content);
    }

    formatter.base64Encode = base64Encode;
    formatter.base64Decode = base64Decode;
    formatter.getDateFromStrings = getDateFromStrings;
    formatter.getDateFromString = getDateFromString;
    formatter.getDateString = getDateString;
    formatter.getDateTimeString = getDateTimeString;
    formatter.getTimeString = getTimeString;
    formatter.convertIndustrialMinutes = convertIndustrialMinutes;
    formatter.convertToIndustrialMinutes = convertToIndustrialMinutes;

    formatter.convertDateString = convertDateString;
}(oui5lib.configuration));
