jQuery.sap.require("oui5lib.logger");
jQuery.sap.require("oui5lib.formatter");
jQuery.sap.require("oui5lib.util");
jQuery.sap.require("oui5lib.event");

jQuery.sap.declare("oui5lib.request");

/** @namespace oui5lib.request */
(function () {

    /**
     * Load JSON file.
     * @memberof oui5lib.request
     * @param {string} url The URL of the json to load.
     * @param {function} resolve The function to call if the request
     * is successfully completed. 
     * @param {object} props Properties to be passed with the request.
     * @param {boolean} isAsync Load asynchronously? Defaults to 'true'.
     */
    function loadJson(url, resolve, props, isAsync) {
        if (typeof isAsync !== "boolean") {
            isAsync = true;
        }

        var xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/json");
        xhr.open("GET", url, isAsync);
        
        addHandlers(xhr, resolve, props, isAsync);        

        xhr.send();
    }

    
    /**
     * Run XMLHttpRequest.
     * @memberof oui5lib.request
     * @param {string} entityName The name of the entity.
     * @param {string} requestName The name of the request.
     * @param {object} params The request parameters.
     * @param {function} resolve The function to call if the request
     * is successfully completed.
     * @param {boolean} isAsync Load asynchronously? Defaults to 'true'.
     */
    function doRequest(entityName, requestName, params,
                       resolve, isAsync) {
        if (typeof oui5lib.mapping !== "object") {
            throw Error("oui5lib.mapping namespace not loaded");
        }
        
        if (params === undefined || params === null) {
            params = {};
        }
        if (typeof isAsync !== "boolean") {
            if (oui5lib.isTest) {
                isAsync = false;
            } else {
                isAsync = true;
            }
        }
        
        var requestDef = oui5lib.mapping.getRequestDefinition(entityName,
                                                              requestName);
        
        var requestParams = procParams(params, requestDef);
        if (!requestParams) {
            throw Error("required parameters missing");
        }
        oui5lib.logger.debug("processed requestParams: "
                             + JSON.stringify(requestParams));
        var encodedParams = getEncodedParams(params);
        
        var method = requestDef.method;
        var url = procUrl(requestDef);
        if (!oui5lib.isTest && method === "GET") {
            url += "?" + encodedParams;
        }
        
        var xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/json");
        xhr.open(method, url, isAsync);
        
        addHandlers(xhr, resolve, { "entity": entityName,
                                    "request": requestName
                                  }, isAsync);

        if (method === "POST") {
            // xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(encodedParams);
        } else {
            xhr.send();
        }
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
     * Process the url from the mapping. If 'oui5lib.isTest' is set 'true', the url is expected to be returned by the oui5lib.request.getTestUrl function.
     * @memberof oui5lib.request
     * @inner 
     * @param {object} requestDefinition
     * @returns {string} The request url.
     */
    function procUrl(requestDefinition) {
        var requestUrl = requestDefinition.url;
        oui5lib.logger.debug("requestUrl: " + requestUrl);
        if (oui5lib.isTest) {
            return oui5lib.request.getTestUrl(requestUrl);
        }
        return requestUrl;
    }
    
    /**
     * Process parameters
     * @memberof oui5lib.request
     * @inner 
     * @param {object} params
     * @param {object} requestDefinition
     */
    function procParams(params, requestDefinition) {
        var paramsDefinition = requestDefinition.params;
        if (paramsDefinition === undefined || paramsDefinition.length === 0) {
            return {};
        }
        var requestParams = {};

        var isRequired, paramName, paramValue;
        paramsDefinition.forEach(function(paramDef) {
            paramName = paramDef.name;
            paramValue = null;
            if (params[paramName] === undefined) {
                if (typeof paramDef.default === "string") {
                    paramValue = paramDef.default;
                }
            } else {
                paramValue = params[paramName];
                if (paramDef.type !== undefined) {
                    paramValue = convertToString(paramValue, paramDef);
                }
            }

            isRequired = false;
            if (typeof paramDef.required === "boolean") {
                isRequired = paramDef.required;
            }
            if (isRequired && paramValue === null) {
                return false;
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
                value = oui5lib.formatter.getDateString(value, paramDefinition.dateFormat);
            }
            break;
        case "Time":
            if (value instanceof Date &&
                typeof paramDefinition.timeFormat === "string") {
                value = oui5lib.formatter.getTimeString(value, paramDefinition.timeFormat);
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
    request.doRequest = doRequest;
}());
