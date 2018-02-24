/**
 * Use this fragment to get a 'Back' button.
 * @module oui5lib.fragment.BackButton
 */
sap.ui.jsfragment("oui5lib.fragment.BackButton", {
    /**
     * @param {sap.ui.core.mvc.Controller} oController The view controller.
     * The controller can implement a custom function 'back', which will be used
     * instead of the code here. If the controller has a 'wasRecordChanged' function
     * and the record is set changed a confirmation dialog is opened which will
     * call the 'handleUnsavedChanges' function of the controller.
     * @returns {sap.m.Button}
     */
    createContent: function(oController) {
        const btn = new sap.m.Button({
            icon: "sap-icon://nav-back",
            tooltip: "{i18n>button.back.tooltip}",
            press: function () {
                let router;
                if (oController) {
                    if (typeof oController.back === "function") {
                        oController.back();
                        return;
                    } else {
                        if (typeof oController.wasRecordChanged === "function" &&
                            oController.wasRecordChanged()) {
                            oui5lib.messages.confirmUnsavedChanges(
                                oController.handleUnsavedChanges.bind(oController), "back");
                        } else {
                            router = oui5lib.util.getComponentRouter();
                            router.navBack();
                        }
                    }
                } else {
                    router = oui5lib.util.getComponentRouter();
                    router.navBack();
                }
            }
        });
        return btn;
    }
});
