sap.ui.define([
    "sap/m/routing/Router"
], function (mRouter) {
    mRouter.extend("oum.Router", {
        constructor: function() {
            mRouter.apply(this, arguments);
        },

        vNavTo: function(sName, routeParameters, bReplace) {
            const route = this.getRoute(sName);
            if (typeof route === "undefined") {
                this.navTo("noRoute");
            } else {
                if (routeParameters === undefined || routeParameters === null) {
                    routeParameters = {};
                }
                if (typeof bReplace !== "boolean") {
                    bReplace = false;
                }
                this.navTo(sName, routeParameters, bReplace);
            }
        },
        
        navBack: function() {
            const oHistory = sap.ui.core.routing.History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();

            if (typeof sPreviousHash === "undefined") {
                this.navTo("home", {}, true);
            } else {
                window.history.go(-1);
            }
        },

        destroy: function() {
            mRouter.prototype.destroy.apply(this, arguments);
        }
    });
});
