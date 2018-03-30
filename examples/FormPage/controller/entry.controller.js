sap.ui.define([
    "oui5lib/controller/BaseController"
], function(Controller) {
    "use strict";

    const entryController = Controller.extend("oum.controller.entry", {
        onInit: function () {
            const page = this.getView().getContent()[0];
            page.getFooter().setModel(oum.lib.configuration.getAppInfoModel());

            this.getRouter().getRoute("home").attachMatched(this._onRouteMatched,
                                                            this);
        },
        _onRouteMatched: function(oEvent) {
            this.debug("coming home");
        },
        routeTo : function(oEvent) {
            const tile = oEvent.getSource();
            const routeName = tile.data("routeName");
            
            this.info("navTo: " + routeName);
            this.getRouter().vNavTo(routeName);
        },
        onExit: function() {
            this.debug("destroying entry view");
        },
        onBeforeRendering: function() {
            this.debug("going to render entry view");
        },
        onAfterRendering: function() {
            this.debug(" rendering of entry view is complete");
        }
    });

    return entryController;
});
