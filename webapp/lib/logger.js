(function () {
    if (!window.console) {
        logger.debug = function(){};
        logger.info = function(){};
        logger.warn = function(){};
        logger.error = function(){};
        return;
    };

    var logLevel = oui5lib.configuration.getLogLevel();
    if (typeof logLevel !== "string") {
        logLevel = "WARN";
    }
    var prefix = "oUI5Lib - ";
   
    switch (logLevel) {
    case "ERROR":
        console.warn = function(){};
    case "WARN":
        console.info = function(){};
    case "INFO":
        console.debug = function(){};
    }
    
    function debug(msg) {
        console.debug(prefix + msg);
    }
    
    function info(msg) {
        console.info(prefix + msg);
    }
    
    function warn(msg) {
        console.warn(prefix + msg);
    }
    
    function error(msg) {
        console.error(prefix + msg);
    }
    
    var logger = oui5lib.namespace("logger");
    logger.debug = debug;
    logger.info = info;
    logger.warn = warn;
    logger.error = error;
}());
