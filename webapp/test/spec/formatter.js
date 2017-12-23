describe("formatter", function() {
   it("should get a Date object from a  date string", function() {
      var dateString = "6.8.1945";
      var dateFormat = "d.M.yyyy";
      var date = oui5lib.formatter.getDateFromString(dateString, dateFormat);
      expect(date instanceof Date).toBe(true);
   });
   it("should format a Date to a date string", function() {
        var date = new Date("2015", "10", "25");
        var dateStr = oui5lib.formatter.getDateString(date);
        expect(dateStr).toEqual("2015-11-25");
        dateStr = oui5lib.formatter.getDateString(date, "YYYYMMdd");
        expect(dateStr).toEqual("20151125");
    });
    
    it("should format a Date to a time string", function() {
        var date = new Date("2015", "10", "25", "9", "46", "10");
        var timeStr = oui5lib.formatter.getTimeString(date);
        expect(timeStr).toEqual("09:46:10");
        timeStr = oui5lib.formatter.getTimeString(date, "HHmmss");
        expect(timeStr).toEqual("094610");

        date = new Date("2015", "10", "25", "11", "8", "2");
        timeStr = oui5lib.formatter.getTimeString(date);
        expect(timeStr).toEqual("11:08:02");
        timeStr = oui5lib.formatter.getTimeString(date, "HHmmss");
        expect(timeStr).toEqual("110802");
    });

    it("should convert date and time strings into a Date object", function() {
        var date = new Date("2014", "4", "5", "1", "00", "10");
        var dateStr = "2014-05-05";
        var timeStr = "01:00:10";
        var dateObj = oui5lib.formatter.getDateFromStrings(dateStr, timeStr);
        expect(dateObj).toEqual(date);

        date = new Date("2014", "9", "11", "23", "59", "9");
        dateStr = "2014-10-11";
        timeStr = "23:59:09";
        dateObj = oui5lib.formatter.getDateFromStrings(dateStr, timeStr);
        expect(dateObj).toEqual(date);
    });

    it("should reformat a date string to a specified pattern", function() {
        var inDateStr = "4.1.2017";
        var outDateStr = oui5lib.formatter.convertDateString(inDateStr, "YYYY-MM-dd", "dd.MM.YYYY");
        expect(outDateStr).toEqual("2017-01-04");
    });

    it("should return an empty string if the date string cannot be parsed", function() {
        var inDateStr = "4.1.2017";
        var outDateStr = oui5lib.formatter.convertDateString(inDateStr, "YYYY-MM-dd");
        expect(outDateStr).toEqual("");
    });

    it("should convert industrial minutes to human readable time", function() {
        var timeStr = oui5lib.formatter.convertIndustrialMinutes("85");
        expect(timeStr).toEqual("01:25");

        timeStr = oui5lib.formatter.convertIndustrialMinutes(85.5);
        expect(timeStr).toEqual("01:25");
        
        timeStr = oui5lib.formatter.convertIndustrialMinutes("713");
        expect(timeStr).toEqual("11:53");
    });

    it("should convert time string to industrial minutes", function() {
        expect(oui5lib.formatter.convertToIndustrialMinutes("10:10")).toEqual(610);
        expect(oui5lib.formatter.convertToIndustrialMinutes("01:10")).toEqual(70);
        expect(oui5lib.formatter.convertToIndustrialMinutes("01:10:30")).toEqual(70);
        expect(oui5lib.formatter.convertToIndustrialMinutes("00:10")).toEqual(10);
        expect(oui5lib.formatter.convertToIndustrialMinutes()).toBe(null);
        expect(oui5lib.formatter.convertToIndustrialMinutes("abc")).toBe(null);
    });
    
    it("should base64 encode a string", function() {
        var str = "abc\ntest#!null";
        var encodedStr = oui5lib.formatter.base64Encode(str);
        expect(encodedStr).toEqual("YWJjCnRlc3QjIW51bGw=");
    });

    it("should base64 decode an encoded string", function() {
        var encodedStr = "YWJjCnRlc3QjIW51bGw=";
        var decodedStr = oui5lib.formatter.base64Decode(encodedStr);
        expect(decodedStr).toEqual("abc\ntest#!null");
    });

    
});
