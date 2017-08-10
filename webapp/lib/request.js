jQuery.sap.declare("oui5lib.request");

/** @namespace oui5lib.request */
(function () {

    /**
     * Load JSON file.
     * @memberof oui5lib.request
     * @param {string} uri
     * @param {function} resolve
     * @param {object} props
     * @param {boolean} isAsync
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
        xhr.onprogress = function(event) {
            // event.loaded event.total
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
     * Run request.
     * @memberof oui5lib.request
     * @param {string} entityName
     * @param {string} requestName
     * @param {object} params
     * @param {function} resolve
     * @param {boolean} isAsync
     */
    function doRequest(entityName, requestName, params, resolve, isAsync) {
        if (params === undefined || params === null) {
            params = {};
        }
        if (typeof isAsync !== "boolean") {
            isAsync = true;
        }
        
        var requestDef = oui5lib.mapping.getRequestDef(entityName, requestName);
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
            if (typeof resolve === "function") {
                resolve(xhrData, requestName);
            }
        });
        jqXHR.fail(function (jqXHR, textStatus, errorThrown) {
            // error event
        });
    }
    
    function procUrl(requestDef) {
        var requestUri = requestDef.uri;
        oui5lib.logger.debug("requestUri: " + requestUri);
        if (oui5lib.isTest) {
            return oui5lib.request.getTestUri(requestUri);
        }
        return requestUri;
    }
    
    /**
     * Process parameters
     * @memberof oui5lib.request
     * @param {object} params
     * @param {object} requestDef
     */
    function procParams(params, requestDef) {
        var paramsDef = requestDef.params;
        if (paramsDef === undefined || paramsDef.length === 0) {
            return null;
        }
        var requestParams = {};

        var l = paramsDef.length, paramDef;
        while (l--) {
            paramDef = paramsDef[l];
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
    
    function convertValue(value, paramDef) {
        var type = paramDef.type;
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
                typeof paramDef.dateFormat === "string") {
                // convert
            }
            break;
        case "Time":
            if (value instanceof Date &&
                typeof paramDef.timeFormat === "string") {
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

    function publishFailureEvent(eventId, props) {
        if (typeof sap !== "undefined" &&
            typeof sap.ui !== "undefined") {
            var eventBus = sap.ui.getCore().getEventBus();
            eventBus.publish("xhr", eventId, props);
        }
    }

    var request = oui5lib.namespace("request");
    request.loadJson = loadJson;
    request.doRequest = doRequest;
}());
