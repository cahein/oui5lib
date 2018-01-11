/*eslint no-console: "off"*/
/*eslint no-fallthrough: "off"*/
(function (configuration) {
    let logger = oui5lib.namespace("logger");
    if (!window.console) {
        logger.debug = function(){};
        logger.info = function(){};
        logger.warn = function(){};
        logger.error = function(){};
        return;
    }

    const logLevel =  configuration.getLogLevel();
   
    const logPrefix = "oui5lib - ";

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
    
    logger.debug = debug;
    logger.info = info;
    logger.warn = warn;
    logger.error = error;
}(oui5lib.configuration));
