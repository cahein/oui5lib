(function (logger, event, formatter) {
    "use strict";
    
    /** @namespace oui5lib.request */
    const request = oui5lib.namespace("request");

    /**
     * Send XMLHttpRequest expecting JSON.
     * @memberof oui5lib.request
     * @param {string} url The URL of the json to load.
     * @param {function} handleSuccess The function to call if the request
     * is successfully completed. 
     * @param {object} requestProps Properties to be passed with the request.
     * @param {boolean} isAsync Load asynchronously? Defaults to 'true'.
     * @param {string} httpVerb GET or POST.
     * @param {string} encodedParams The url-encoded parameters string.
     */
    function fetchJson(url, handleSuccess, requestProps, isAsync, httpVerb, encodedParams) {
        if (typeof isAsync !== "boolean") {
            isAsync = true;
        }
        if (typeof httpVerb !== "string") {
            httpVerb = "GET";
        }
        if (typeof encodedParams === "string" && httpVerb === "GET") {
            const protocolRegex = /^https?.*/;
            if (protocolRegex.test(url)) {
                url += "?" + encodedParams;
            }
        }

        const xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/json");
        try {
            xhr.open(httpVerb, url, isAsync);
        } catch(e) {
            logger.error(e.message);
        }
        
        addHandlers(xhr, handleSuccess, requestProps, isAsync);        

        if (httpVerb === "POST") {
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
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
     * @param {object} data The data provided for the request.
     * @param {function} handleSuccess The function to call if the request
     * is successfully completed.
     * @param {boolean} isAsync Load asynchronously? Defaults to 'true'.
     */
    function sendMappingRequest(entityName, requestName,
                                data, handleSuccess, isAsync) {
        if (typeof oui5lib.mapping !== "object") {
            throw new Error("oui5lib.mapping namespace not loaded");
        }
        if (typeof isAsync !== "boolean") {
            if (oui5lib.configuration.getEnvironment() === "testing") {
                isAsync = false;
            } else {
                isAsync = true;
            }
        }
        
        const requestConfig = oui5lib.mapping.getRequestConfiguration(entityName,
                                                                      requestName);
        
        const requestParams = procParameters(data, requestConfig);
        const encodedParams = getEncodedParams(requestParams);
        logger.info("request parameter string: " + encodedParams);

        const httpVerb = requestConfig.method;
        const url = procUrl(requestConfig);
        logger.info("request url: " + url);

        fetchJson(url, handleSuccess, { "entity": entityName,
                                        "request": requestName,
                                        "requestParameters": requestParams 
                                      }, isAsync, httpVerb, encodedParams);
    }
    
    function addHandlers(xhr, handleSuccess, requestProps, isAsync) {
        xhr.onload = function() {
            const status = xhr.status + "";
            if (status.match(/^20\d$/) || status === 0) {
                let responseData = null;
                try {
                    responseData = JSON.parse(xhr.responseText);
                } catch(e) {
                    throw new Error("JSON is invalid: " + xhr.responseText);
                }
                if (typeof handleSuccess === "function") {
                    handleSuccess(responseData, requestProps);
                }
            } else {
                event.publishRequestFailureEvent("status",
                                                 xhr, requestProps);
            }
        };
        
        xhr.onerror = function() {
            event.publishRequestFailureEvent("error",
                                             xhr, requestProps);
        };

        if (isAsync) {
            xhr.timeout = 500;
            xhr.ontimeout = function() {
                event.publishRequestFailureEvent("timeout",
                                                 xhr, requestProps);
            };
        }
        return xhr;
    }

    /**
     * Process the URL. Depends upon the environment. For the production environment the URL is generated from the mapping.
     * @memberof oui5lib.request
     * @inner 
     * @param {object} requestConfig
     * @returns {string} The request url.
     */
    function procUrl(requestConfig) {
        const pathname = requestConfig.pathname;

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
        const protocol = requestConfig.protocol;
        const host = requestConfig.host;
        const requestUrl = protocol + "://" + host + "/" + pathname;
        return requestUrl;
    }
    
    /**
     * Process parameters
     * @memberof oui5lib.request
     * @inner 
     * @param {object} params
     * @param {object} requestConfig
     */
    function procParameters(data, requestConfig) {
        const paramsConfig = requestConfig.parameters;
        if (paramsConfig === undefined || paramsConfig.length === 0) {
            return {};
        }
        if (data === undefined || data === null) {
            data = {};
        }
        let requestParams = {};
        let paramName, paramValue;
        paramsConfig.forEach(function(paramSpec) {
            paramName = paramSpec.name;
            paramValue = null;
            if (data[paramName] === undefined) {
                if (typeof paramSpec.default === "string") {
                    paramValue = paramSpec.default;
                }
            } else {
                paramValue = data[paramName];
                if (paramSpec.type !== "string") {
                    paramValue = convertToString(paramValue, paramSpec);
                }
            }

            if (paramSpec.required && paramValue === null) {
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
     * @param {object} paramSpec
     */
    function convertToString(value, paramSpec) {
        let type = paramSpec.type;
        switch (type) {
        case "Date":
            if (value instanceof Date &&
                typeof paramSpec.dateFormat === "string") {
                value = formatter.getDateString(value,
                                                paramSpec.dateFormat);
            }
            break;
        case "Time":
            if (value instanceof Date &&
                typeof paramSpec.timeFormat === "string") {
                value = formatter.getTimeString(value,
                                                paramSpec.timeFormat);
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
        let encodedString = "";
        for (let prop in params) {
            if (params.hasOwnProperty(prop)) {
                if (encodedString.length > 0) {
                    encodedString += "&";
                }
                encodedString += encodeURI(prop + "=" + params[prop]);
            }
        }
        return encodedString;
    }

    request.fetchJson = fetchJson;
    request.sendMappingRequest = sendMappingRequest;
}(oui5lib.logger, oui5lib.event,  oui5lib.formatter));
