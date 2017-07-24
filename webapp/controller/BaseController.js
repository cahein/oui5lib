sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "oui5lib/logger"
], function (Controller, logger) {
    "use strict";

    /**
     * Extends the default Controller with some basic functions. 
     * @mixin oui5lib.controller.BaseController
     */
    var BaseController = Controller.extend("oui5lib.controller.BaseController", {
        /**
         * Verifies permissions of the current user to the view.
         * @function verifyPermissions
         * @memberof oui5lib.controller.BaseController
         * @public
         * @example In the controller init, use: this.verifyPermissions()
         */
        verifyPermissions : function() {
            var view = this.getView();
            var viewName = view.sViewName;
            var permissions = oui5lib.configuration.getViewPermissions(viewName);
            if (typeof permissions !== "undefined") {
                if (oui5lib.currentuser.hasPermissions(permissions.profileRoles,
                                                       permissions.userRoles)) {
                    return true;
                }
            }
            oui5lib.logger.warn("user is not authorized to access view: " + viewName);
            this.getRouter().navTo("notAuthorized");
            return false;
        },
        
        /**
         * Convenience method for accessing the router.
         * @function getRouter
         * @memberof oui5lib.controller.BaseController
         * @public
         * @returns {sap.ui.core.routing.Router} The router for this component.
         */
        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },
        
        /**
         * Convenience method for accessing the event bus.
         * @function getEventBus
         * @memberof oui5lib.controller.BaseController
         * @public
         * @returns {sap.ui.core.EventBus} the event bus for this component.
         */
        getEventBus: function () {
            return this.getOwnerComponent().getEventBus();
        },
        
        getResourceBundle : function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        
        debug: function (msg) {
            logger.debug(this.addControllerName(msg));
        },
        
        info: function (msg) {
            logger.info(this.addControllerName(msg));
        },

        warn: function (msg) {
            logger.warn(this.addControllerName(msg));
        },

        error: function (msg) {
            logger.error(this.addControllerName(msg));
        },

        addControllerName: function(msg) {
            var metadata = this.getMetadata();
            return metadata.getName() + " > " + msg;
        }
    });
    return BaseController;
});
