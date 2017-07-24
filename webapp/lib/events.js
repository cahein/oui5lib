jQuery.sap.declare("oui5lib.events");

(function () {
    function handleRequestFailure(channel, eventId, requestInfo) {
        // requestInfo.xhrObj);
    }

    var event = oui5lib.namespace("events");
    event.requestFailure = handleRequestFailure;
}());
