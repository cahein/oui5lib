sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    /**
     * Extends the default Controller with some basic functions. 
     * @interface oui5lib.controller.BaseController
     */
    const BaseController = Controller.extend("oui5lib.controller.BaseController", {
        /**
         * Verifies permissions of the current user to the view.
         * @function verifyPermissions
         * @memberof oui5lib.controller.BaseController
         * @public
         * @example In the controller init, use: this.verifyPermissions()
         */
        verifyPermissions : function() {
            const view = this.getView();
            const viewName = view.sViewName;
            if (!oui5lib.currentuser.hasPermissionForView(viewName)) {
                oui5lib.logger.warn("user is not authorized to access view: " + viewName);
                this.getRouter().navTo("notAuthorized");
                return false;
            }
            return true;
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
            oui5lib.logger.debug(this.addControllerName(msg));
        },
        
        info: function (msg) {
            oui5lib.logger.info(this.addControllerName(msg));
        },

        warn: function (msg) {
            oui5lib.logger.warn(this.addControllerName(msg));
        },

        error: function (msg) {
            oui5lib.logger.error(this.addControllerName(msg));
        },

        addControllerName: function(msg) {
            const metadata = this.getMetadata();
            return metadata.getName() + " > " + msg;
        }
    });
    return BaseController;
});
