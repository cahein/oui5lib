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
