/** @namespace oui5lib.event */
(function (logger, util) {
    const event = oui5lib.namespace("event");

    /**
     * Publish event in case of an error.
     * @memberof oui5lib.event
     * @param {string} eventId One of 'status', 'error', 'timeout'.
     * @param {object} props
     */
    function publishRequestFailureEvent(eventId, xhr, props, isComponentEvent) {
        if (typeof props === "undefined" || props === null) {
            props = {};
        }
        props.xhrObj = xhr;
        publishEvent("xhr", eventId, props, isComponentEvent);
    }
    event.publishRequestFailureEvent = publishRequestFailureEvent;
    
    function publishReadyEvent(eventData, isComponentEvent) {
        publishEvent("loading", "ready", eventData, isComponentEvent);
    }
    event.publishReadyEvent = publishReadyEvent;


    function publishEvent(channelId, eventId, eventData, isComponentEvent) {
        if (!util.isUI5Loaded()) {
            logger.warn("Couldn't publish event: no UI5 loaded");
            return;
        }
        if (typeof isComponentEvent !== "boolean") {
            isComponentEvent = false;
        }
        let eventBus;
        if (isComponentEvent) {
            eventBus = util.getComponentEventBus();
        } else {
            eventBus = sap.ui.getCore().getEventBus();
        }
        eventBus.publish(channelId, eventId, eventData);
    }
    
}(oui5lib.logger, oui5lib.util));
