jQuery.sap.declare("oui5lib.events");

/** @namespace oui5lib.events */
(function () {
    /**
     * Handler called when request failed.
     * @memberof oui5lib.events
     */
    function handleRequestFailure(channel, eventId, requestInfo) {
        // requestInfo.xhrObj);
    }

    var event = oui5lib.namespace("events");
    event.requestFailure = handleRequestFailure;
}());
