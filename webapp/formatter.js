jQuery.sap.require("sap.ui.core.format.DateFormat");

jQuery.sap.declare("oui5lib.formatter");

/** @namespace oui5lib.formatter */
(function() {
    var dateFormat = "YYYY-MM-dd";
    var timeFormat = "HH:mm:ss";
    var dateTimeFormat = "YYYY-MM-dd HH:mm:ss";
    

    /**
     * Converts date and time strings into Javascript Date.
     * @memberof oui5lib.formatter
     * @param {string} dateStr given date value
     * @param {string} timeFormat given date format pattern
     * @returns {Date}
     */
    function getDateFromString(dateStr, dateFormat){
        var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
            pattern: dateFormat
        });
        var date = oDateFormat.parse(dateStr, false, true);
        return date;
    }

    /**
     * Converts date and time strings into Javascript Date.
     * @memberof oui5lib.formatter
     * @param {string} dateStr given date value (format: YYYY-MM-dd)
     * @param {string} timeStr given time value (format: hh:mm:ss)
     * @returns {Date}
     */
    function getDateFromStrings(dateStr, timeStr){
        var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
            pattern: "YYYY-MM-dd HH:mm:ss"
        });
        var date = oDateFormat.parse(dateStr + " " + timeStr, false, true);
        return date;
    }

    
    /**
     * Use to format Date to a string.
     * @memberof oui5lib.formatter
     * @param {Date} date The Javascript Date to be formatted.
     * @param {string} outFormat The output format. Defaults to "YYYY-MM-dd".
     * @returns {string} The formatted date. Returns null if the given date is not a Date object.
     */
    function getDateString(date, outFormat) {
        if (date instanceof Date) {
            if (typeof outFormat === "undefined") {
                outFormat = dateFormat;
            }
            return formatDate(date, outFormat);
        }
        return null;
    }
    
    /**
     * Formats a given Date to an valid time string (default format: HH:mm:ss).
     * @memberof oui5lib.formatter
     * @param {Date} date The given date/time object. 
     * @returns {string} Formatted time as a string.
     */ 
    function getTimeString(date, outFormat) {
        if (date instanceof Date) {
            if (typeof outFormat === "undefined") {
                outFormat = timeFormat;
            }
            return formatDate(date, outFormat);
        }
        return null;
    }
    
    /**
     * Formats a given Date according to the specified date pattern.
     * @memberof oui5lib.formatter
     * @param {Date} date The Javascript Date to be formatted.
     * @param {string} outFormat The date pattern to format to.
     * @returns {string} The formatted date or time.
     */
    function formatDate(date, outFormat) {
        var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
            pattern: outFormat
        });
        var formattedDate = oDateFormat.format(date);
        return formattedDate;
    }

    /**
     * Converts a date string with a specified pattern into another pattern.
     * @memberof oui5lib.formatter
     * @param {string} dateStr The date to be converted.
     * @param {string} outFormat The pattern to convert to.
     * @param {string} inFormat The pattern of the date to be converted. Default: "YYYY-MM-dd".
     * @returns {string} The reformatted date. Returns an empty string if the date cannot be parsed.
     */
    function convertDateString(dateStr, outFormat, inFormat) {
        if (typeof outFormat === "undefined") {
            throw new Error("Function needs a date pattern to convert to");
        }
        if (typeof inFormat !== "string") {
            inFormat = dateFormat;
        }
        var inDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
            pattern: inFormat
        });
        var outDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
            pattern: outFormat
        });

        var inDate = inDateFormat.parse(dateStr, false, true);
        if (inDate instanceof Date) {
            var outDate = outDateFormat.format(inDate);
            return outDate;
        }
        return "";
    }

    /**
     * Process Date from Date objects returned by the DatePicker and TimePicker controls.
     * @memberof oui5lib.formatter
     * @param {Date} date
     * @param {Date} time
     */
    function procDateFromDateAndTimePickers(date, time) {
        if (date instanceof Date && time instanceof Date) {
            var dateStr = this.formatDate(date, dateFormat) + " "
                + this.formatDate(time, timeFormat);
            var inDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                pattern: dateTimeFormat
            });
            return inDateFormat.parse(dateStr, false, true);
        }
        return null;
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

        var timeArray = time.split(".");

        var fullMinutes = timeArray[0];
        var hours = Math.floor(fullMinutes / 60);          
        var minutes = fullMinutes % 60;

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
        
        var industrialMinutes = 0;
        var match = timeString.match(/^(\d+):(\d+):?(\d*)$/);
        if (match === null) {
            return null;
        }
        if (match.length === 4) {
            var hours = parseInt(match[1]);
            var minutes = parseInt(match[2]);
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

    var formatter = oui5lib.namespace("formatter");
    formatter.base64Encode = base64Encode;
    formatter.base64Decode = base64Decode;
    formatter.getDateFromString = getDateFromString;
    formatter.getDateString = getDateString;
    formatter.getTimeString = getTimeString;
    formatter.getDateFromStrings = getDateFromStrings;
    formatter.convertIndustrialMinutes = convertIndustrialMinutes;
    formatter.convertToIndustrialMinutes = convertToIndustrialMinutes;

    formatter.convertDateString = convertDateString;
    formatter.procDateFromDateAndTimePickers = procDateFromDateAndTimePickers;
}());
