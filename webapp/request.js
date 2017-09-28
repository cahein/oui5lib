jQuery.sap.declare("oui5lib.request");

/** @namespace oui5lib.request */
(function () {

    /**
     * Load JSON file.
     * @memberof oui5lib.request
     * @param {string} uri The uri of the json to load.
     * @param {function} resolve The function to call if the request is successfully completed. 
     * @param {object} props Properties to be passed with the request.
     * @param {boolean} isAsync Load asynchronously? Defaults to 'true'.
     */
    function loadJson(uri, resolve, props, isAsync) {
        if (typeof props === "undefined") {
            props = {};
        }
        if (typeof isAsync !== "boolean") {
            isAsync = true;
        }
        
        var data = null;
        
        var xhr = new XMLHttpRequest();
        xhr.open("GET", uri, isAsync);
        
        xhr.onload = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        data = JSON.parse(xhr.responseText);
                        if (typeof resolve === "function") {
                            resolve(data, props);
                        }
                    } catch (e) {
                        throw new Error("Not valid JSON");
                    }
                } else {
                    props.xhrObj = xhr; 
                    publishFailureEvent("status", props);
                }
            }
        };
        xhr.onerror = function() {
            props.xhrObj = xhr; 
            publishFailureEvent("error", props);
        };

        if (isAsync) {
            xhr.timeout = 1000;
            xhr.ontimeout = function() {
                props.xhrObj = xhr; 
                publishFailureEvent("timeout", props);
            };
        }
        
        xhr.send();
    }

    /**
     * Run request with jQuery.
     * @memberof oui5lib.request
     * @param {string} entityName The name of the entity.
     * @param {string} requestName The name of the request.
     * @param {object} params The request parameters.
     * @param {function} resolve The function to call if the request is successfully completed.
     * @param {boolean} isAsync Load asynchronously? Defaults to 'true'.
     */
    function doRequest(entityName, requestName, params, resolve, isAsync) {
        if (params === undefined || params === null) {
            params = {};
        }
        if (typeof isAsync !== "boolean") {
            isAsync = true;
        }
        
        var requestDef = oui5lib.mapping.getRequestDefinition(entityName, requestName);
        var requestParams = procParams(params, requestDef);
        oui5lib.logger.debug("processed requestParams: " + JSON.stringify(requestParams));
        if (!requestParams) {
            throw Error("required parameters missing");
        }
        var jqXHR = $.ajax({
            type: requestDef.method,
            url: procUrl(requestDef),
            data: requestParams,
            async: isAsync,
            dataType: "json"
        });
        jqXHR.done(function (xhrData, textStatus, jqXHR) {
            oui5lib.logger.info("request status: " + jqXHR.status);
            if (typeof resolve === "function") {
                resolve(xhrData, requestName);
            }
        });
        jqXHR.fail(function (jqXHR, textStatus, errorThrown) {
            // error event
            oui5lib.logger.error("error: " + errorThrown);
        });
    }
    
    /**
     * Process the url from the mapping. If 'oui5lib.isTest' is set 'true', the url is expected to be returned by the oui5lib.request.getTestUri function.
     * @memberof oui5lib.request
     * @inner 
     * @param {object} requestDefinition
     * @returns {string} The request url.
     */
    function procUrl(requestDefinition) {
        var requestUri = requestDefinition.uri;
        oui5lib.logger.debug("requestUri: " + requestUri);
        if (oui5lib.isTest) {
            return oui5lib.request.getTestUri(requestUri);
        }
        return requestUri;
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
            return null;
        }
        var requestParams = {};

        var l = paramsDefinition.length, paramDef;
        while (l--) {
            paramDef = paramsDefinition[l];
            var paramName = paramDef.name;
            var paramValue = null;
            if (params[paramName] === undefined) {
                if (typeof paramDef.default === "string") {
                    paramValue = paramDef.default;
                }
            } else {
                paramValue = params[paramName];
                if (paramDef.type !== undefined) {
                    paramValue = convertValue(paramValue, paramDef);
                }
            }

            var isRequired = false;
            if (typeof paramDef.required === "boolean") {
                isRequired = paramDef.required;
            }
            if (isRequired && paramValue === null) {
                return false;
            }
            if (paramValue !== null) {
                requestParams[paramName] = paramValue;
            }
        }
        return requestParams;
    }
    
    /**
     * Convert value according to parameter definition.
     * @memberof oui5lib.request
     * @inner 
     * @param {boolean|number|Date|Array} value
     * @param {object} paramDefinition
     */
    function convertValue(value, paramDefinition) {
        var type = paramDefinition.type;
        switch (type) {
        case "boolean":
            if (typeof value === "boolean") {
                if (value) {
                    return "t";
                } else {
                    return "f";
                }
            }
            break;
        case "Date":
            if (value instanceof Date &&
                typeof paramDefinition.dateFormat === "string") {
                // convert
            }
            break;
        case "Time":
            if (value instanceof Date &&
                typeof paramDefinition.timeFormat === "string") {
                // convert
            }
            break;
        case "Array":
            if (value instanceof Array) {
                value = value.toString();
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

    /**
     * Publish event in case of an error.
     * @memberof oui5lib.request
     * @inner 
     * @param {string} eventId One of 'status', 'error', 'timeout'.
     * @param {object} props
     */
    function publishFailureEvent(eventId, props) {
        if (typeof sap !== "undefined" &&
            typeof sap.ui !== "undefined") {
            var eventBus = new sap.ui.getCore().getEventBus();
            eventBus.publish("xhr", eventId, props);
        }
    }

    var request = oui5lib.namespace("request");
    request.loadJson = loadJson;
    request.doRequest = doRequest;
}());
