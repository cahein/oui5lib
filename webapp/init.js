const oui5lib = {};
oui5lib.namespace = function(string) {
    let object = this;
    const levels = string.split(".");
    for (let i = 0, l = levels.length; i < l; i++) {
        if (typeof object[levels[i]] === "undefined") {
            object[levels[i]] = {};
        }
        object = object[levels[i]];
    }
    return object;
};

const xhr = new XMLHttpRequest();
xhr.open("GET", "oui5lib.json", false);
xhr.onload = function() {
    if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 0) {
            try {
                const configData = JSON.parse(xhr.responseText);
                oui5lib.config = configData;
            } catch (e) {
                throw new Error("Not valid JSON: oui5lib.json");
            }
        }
    }
};
xhr.send();

jQuery.sap.require("oui5lib.configuration",
                   "oui5lib.lib.listHelper",
                   "oui5lib.logger",
                   "oui5lib.formatter",
                   "oui5lib.util",
                   "oui5lib.event",
                   "oui5lib.request",
                   "oui5lib.currentuser",
                   "oui5lib.mapping",
                   "oui5lib.validation",
                   "oui5lib.messages",
                   "oui5lib.ui",
                   "oui5lib.itemBase",
                   "oui5lib.listBase");
