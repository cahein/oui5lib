(function (logger, util) {
    "use strict";

    /** @namespace oui5lib.event */
    const event = oui5lib.namespace("event");

    /**
     * Publish event in case of an error. By default, a Component event is being published.
     * @memberof oui5lib.event
     * @param {string} eventId One of 'status', 'error', 'timeout'.
     * @param {object} props Request properties.
     * @param {boolean} isComponentEvent Default is true.
     */
    function publishRequestFailureEvent(eventId, xhr, props) {
        if (typeof props === "undefined" || props === null) {
            props = {};
        }
        props.xhrObj = xhr;
        publishEvent("xhr", eventId, props, true);
    }
    event.publishRequestFailureEvent = publishRequestFailureEvent;
    
    function publishReadyEvent(eventData, isComponentEvent) {
        publishEvent("loading", "ready", eventData, isComponentEvent);
    }
    event.publishReadyEvent = publishReadyEvent;


    function publishEvent(channelId, eventId, eventData, isComponentEvent) {
        if (!util.isUI5Env()) {
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
