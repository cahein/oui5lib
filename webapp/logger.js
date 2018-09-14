/*eslint no-console: "off"*/
/*eslint no-fallthrough: "off"*/
(function (configuration) {
    /** @namespace oui5lib.logger */
    const logger = oui5lib.namespace("logger");

    if (!window.console) {
        logger.debug = function(){};
        logger.info = function(){};
        logger.warn = function(){};
        logger.error = function(){};
        return;
    }

    const logPrefix = "oui5lib - ";
    
    logger.debug = function(msg) {
        console.log(logPrefix + "DEBUG " + msg);
    };
    logger.info = function(msg) {
        console.info(logPrefix + "INFO " + msg);
    };
    logger.warn = function(msg) {
        console.warn(logPrefix + "WARN " +  msg);
    };
    logger.error = function(msg) {
        console.error(logPrefix + "ERROR " + msg);
    };
    
    const logLevel =  configuration.getLogLevel();
    switch (logLevel) {
    case "ERROR":
        logger.warn = function(){};
    case "WARN":
        logger.info = function(){};
    case "INFO":
        logger.debug = function(){};
    }
}(oui5lib.configuration));
