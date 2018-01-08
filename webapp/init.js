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

var xhr = new XMLHttpRequest();
xhr.open("GET", "oui5lib.json", false);
xhr.onload = function() {
    if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 0) {
            try {
                var configData = JSON.parse(xhr.responseText);
                oui5lib.config = configData;
            } catch (e) {
                throw new Error("Not valid JSON");
            }
        }
    }
};
xhr.send();

jQuery.sap.require("oui5lib.configuration");

jQuery.sap.require("oui5lib.lib.listHelper");
jQuery.sap.require("oui5lib.logger");
jQuery.sap.require("oui5lib.formatter");
jQuery.sap.require("oui5lib.util");
jQuery.sap.require("oui5lib.event");
jQuery.sap.require("oui5lib.request");
jQuery.sap.require("oui5lib.currentuser");
jQuery.sap.require("oui5lib.mapping");

jQuery.sap.require("oui5lib.validation");
jQuery.sap.require("oui5lib.messages");
jQuery.sap.require("oui5lib.ui");

jQuery.sap.require("oui5lib.itemBase");
jQuery.sap.require("oui5lib.listBase");
