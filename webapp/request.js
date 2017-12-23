jQuery.sap.require("oui5lib.logger");
jQuery.sap.require("oui5lib.formatter");
jQuery.sap.require("oui5lib.event");

jQuery.sap.declare("oui5lib.request");

/** @namespace oui5lib.request */
(function () {

    /**
     * Send XMLHttpRequest expecting JSON.
     * @memberof oui5lib.request
     * @param {string} url The URL of the json to load.
     * @param {function} resolve The function to call if the request
     * is successfully completed. 
     * @param {object} props Properties to be passed with the request.
     * @param {boolean} isAsync Load asynchronously? Defaults to 'true'.
     * @param {string} httpVerb GET or POST.
     * @param {string} encodedParams The url-encoded parameters string.
     */
    function loadJson(url, resolve, props, isAsync, httpVerb, encodedParams) {
        if (typeof isAsync !== "boolean") {
            isAsync = true;
        }
        if (typeof httpVerb === "undefined") {
            httpVerb = "GET";
        }
        if (typeof encodedParams !== "undefined" && httpVerb === "GET") {
            var protocolRegex = /^https?.*/;
            if (protocolRegex.test(url)) {
                url += "?" + encodedParams;
            }
        }

        var xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/json");
        xhr.open(httpVerb, url, isAsync);
        
        addHandlers(xhr, resolve, props, isAsync);        

        if (httpVerb === "POST") {
            xhr.send(encodedParams);
        } else {
            xhr.send();
        }
    }

    
    /**
     * Run XMLHttpRequest defined in the mapping.
     * @memberof oui5lib.request
     * @param {string} entityName The name of the entity.
     * @param {string} requestName The name of the request.
     * @param {object} params The data provided for the request.
     * @param {function} resolve The function to call if the request
     * is successfully completed.
     * @param {boolean} isAsync Load asynchronously? Defaults to 'true'.
     */
    function sendMappingRequest(entityName, requestName, params,
                                resolve, isAsync) {
        if (typeof oui5lib.mapping !== "object") {
            throw new Error("oui5lib.mapping namespace not loaded");
        }
        
        if (params === undefined || params === null) {
            params = {};
        }
        if (typeof isAsync !== "boolean") {
            if (oui5lib.configuration.getEnvironment() === "testing") {
                isAsync = false;
            } else {
                isAsync = true;
            }
        }
        
        var requestDef = oui5lib.mapping.getRequestDefinition(entityName,
                                                              requestName);
        
        var requestParams = procParameters(params, requestDef);
        var encodedParams = getEncodedParams(requestParams);
        oui5lib.logger.info("request parameter string: " + encodedParams);

        var httpVerb = requestDef.method;
        var url = procUrl(requestDef);
        oui5lib.logger.info("request url: " + url);

        loadJson(url, resolve, { "entity": entityName,
                                 "request": requestName
                               }, isAsync, httpVerb, encodedParams);
    }
    
    function addHandlers(xhr, resolve, props, isAsync) {
        xhr.onload = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 0) {
                    var data = null;
                    try {
                        data = JSON.parse(xhr.responseText);
                    } catch(e) {
                        throw new Error("JSON is invalid");
                    }
                    if (typeof resolve === "function") {
                        resolve(data, props);
                    }
                } else {
                    oui5lib.event.publishRequestFailureEvent("status",
                                                             xhr, props);
                }
            }
        };
        
        xhr.onerror = function() {
            oui5lib.event.publishRequestFailureEvent("error",
                                                     xhr, props);
        };

        if (isAsync) {
            xhr.timeout = 500;
            xhr.ontimeout = function() {
                oui5lib.event.publishRequestFailureEvent("timeout",
                                                         xhr, props);
            };
        }
        return xhr;
    }

    /**
     * Process the URL. Depends upon the environment. For the production environment the URL is generated from the mapping.
     * @memberof oui5lib.request
     * @inner 
     * @param {object} requestDefinition
     * @returns {string} The request url.
     */
    function procUrl(requestDefinition) {
        var pathname = requestDefinition.pathname;

        switch (oui5lib.configuration.getEnvironment()) {
        case "development":
            if (typeof oui5lib.request.getDevelopmentUrl === "function") {
                return oui5lib.request.getDevelopmentUrl(pathname);
            }
            break;
        case "testing":
            if (typeof oui5lib.request.getTestingUrl === "function") {
                return oui5lib.request.getTestingUrl(pathname);
            }
            break;
        case "staging":
            if (typeof oui5lib.request.getStagingUrl === "function") {
                return oui5lib.request.getStagingUrl(pathname);
            }
            break;
        }
        var protocol = requestDefinition.protocol;
        var host = requestDefinition.host;
        var requestUrl = protocol + "://" + host + "/" + pathname;
        return requestUrl;
    }
    
    /**
     * Process parameters
     * @memberof oui5lib.request
     * @inner 
     * @param {object} params
     * @param {object} requestDefinition
     */
    function procParameters(params, requestDefinition) {
        var paramsDefinition = requestDefinition.params;
        if (paramsDefinition === undefined || paramsDefinition.length === 0) {
            return {};
        }
        var requestParams = {};

        var paramName, paramValue;
        paramsDefinition.forEach(function(paramDef) {
            paramName = paramDef.name;
            paramValue = null;
            if (params[paramName] === undefined) {
                if (typeof paramDef.default === "string") {
                    paramValue = paramDef.default;
                }
            } else {
                paramValue = params[paramName];
                if (paramDef.type !== "string") {
                    paramValue = convertToString(paramValue, paramDef);
                }
            }

            if (paramDef.required && paramValue === null) {
               throw new Error("required parameter missing: " + paramName);
            }
            if (paramValue !== null) {
                requestParams[paramName] = paramValue;
            }
        });
        return requestParams;
    }
    
    /**
     * Convert value according to parameter definition.
     * @memberof oui5lib.request
     * @inner 
     * @param {boolean|number|Date|Array} value
     * @param {object} paramDefinition
     */
    function convertToString(value, paramDefinition) {
        var type = paramDefinition.type;
        switch (type) {
        case "Date":
            if (value instanceof Date &&
                typeof paramDefinition.dateFormat === "string") {
                value = oui5lib.formatter.getDateString(value,
                                                        paramDefinition.dateFormat);
            }
            break;
        case "Time":
            if (value instanceof Date &&
                typeof paramDefinition.timeFormat === "string") {
                value = oui5lib.formatter.getTimeString(value,
                                                        paramDefinition.timeFormat);
            }
            break;
        case "Array":
            if (value instanceof Array) {
                value = value.toString();
            }
            break;
        case "boolean":
            if (typeof value === "boolean") {
                if (value) {
                    return "t";
                } else {
                    return "f";
                }
            }
            break;
        case "int":
        case "float":
            if (typeof value === "number") {
                value = value + "";
            }
            break;
        }
        return value;
    }

    function getEncodedParams(params) {
        var encodedString = "";
        for (var prop in params) {
            if (params.hasOwnProperty(prop)) {
                if (encodedString.length > 0) {
                    encodedString += "&";
                }
                encodedString += encodeURI(prop + "=" + params[prop]);
            }
        }
        return encodedString;
    }

    var request = oui5lib.namespace("request");
    request.loadJson = loadJson;
    request.sendMappingRequest = sendMappingRequest;
}());
