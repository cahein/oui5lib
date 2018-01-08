/** @namespace oui5lib.event */
(function (logger, util) {
    /**
     * Handler called when request failed.
     * @memberof oui5lib.event
     */
    function handleRequestFailure(channel, eventId, requestInfo) {
        logger.error(eventId + " " + requestInfo.xhrObj);
    }

    /**
     * Publish event in case of an error.
     * @memberof oui5lib.event
     * @param {string} eventId One of 'status', 'error', 'timeout'.
     * @param {object} props
     */
    function publishRequestFailureEvent(eventId, xhr, props) {
        if (typeof props === "undefined" || props === null) {
            props = {};
        }
        props.xhrObj = xhr;
        publishEvent("xhr", eventId, props);
    }
    
    function publishReadyEvent(eventData) {
        publishEvent("loading", "ready", eventData);
    }

    function publishEvent(channelId, eventId, eventData) {
        if (!util.isUI5Loaded()) {
            logger.warn("Couldn't publish event: no UI5 loaded");
            return;
        }
        var eventBus = sap.ui.getCore().getEventBus();
        eventBus.publish(channelId, eventId, eventData);
    }
    
    var event = oui5lib.namespace("event");
    event.onRequestFailure = handleRequestFailure;
    
    event.publishRequestFailureEvent = publishRequestFailureEvent;
    event.publishReadyEvent = publishReadyEvent;
}(oui5lib.logger, oui5lib.util));
