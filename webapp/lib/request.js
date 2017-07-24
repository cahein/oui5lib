jQuery.sap.declare("oui5lib.request");

(function () {
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

    function publishFailureEvent(eventId, props) {
        var eventBus = sap.ui.getCore().getEventBus();
        eventBus.publish("xhr", "timeout", props);
    }
    
    var request = oui5lib.namespace("request");
    request.loadJson = loadJson;
}());
