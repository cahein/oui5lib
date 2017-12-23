jQuery.sap.require("oui5lib.configuration");

jQuery.sap.declare("oui5lib.logger");

/*eslint no-console: "off"*/
/*eslint no-fallthrough: "off"*/
(function () {
    if (!window.console) {
        logger.debug = function(){};
        logger.info = function(){};
        logger.warn = function(){};
        logger.error = function(){};
        return;
    }

    var logLevel =  oui5lib.configuration.getLogLevel();
   
    var logPrefix = "oui5lib - ";

    switch (logLevel) {
    case "ERROR":
        console.warn = function(){};
    case "WARN":
        console.info = function(){};
    case "INFO":
        console.log = function(){};
    }
    
    function debug(msg) {
        console.log(logPrefix + "DEBUG " + msg);
    }
    
    function info(msg) {
        console.info(logPrefix + "INFO " + msg);
    }
    
    function warn(msg) {
        console.warn(logPrefix + "WARN " +  msg);
    }
    
    function error(msg) {
        console.error(logPrefix + "ERROR " + msg);
    }
    
    var logger = oui5lib.namespace("logger");
    logger.debug = debug;
    logger.info = info;
    logger.warn = warn;
    logger.error = error;
}());
