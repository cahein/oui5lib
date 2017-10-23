jQuery.sap.registerModulePath("oui5lib", "webapp"); 

var oui5lib = {};
oui5lib.namespace = function(string) {
    var object = this;
    var levels = string.split(".");
    for (var i = 0, l = levels.length; i < l; i++) {
        if (typeof object[levels[i]] === "undefined") {
            object[levels[i]] = {};
        }
        object = object[levels[i]];
    }
    return object;
};
oui5lib.isTest = true;

jQuery.sap.require("oui5lib.request");
