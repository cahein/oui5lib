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

jQuery.sap.require("oui5lib.events");

var eventBus = sap.ui.getCore().getEventBus();
eventBus.subscribe("xhr", "status", oui5lib.events.requestFailure);
eventBus.subscribe("xhr", "error", oui5lib.events.requestFailure);
eventBus.subscribe("xhr", "timeout", oui5lib.events.requestFailure);

jQuery.sap.require("oui5lib.request");
jQuery.sap.require("oui5lib.configuration");
jQuery.sap.require("oui5lib.logger");
jQuery.sap.require("oui5lib.util");
