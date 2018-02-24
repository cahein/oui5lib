/**
 * Use this fragment to get a 'Home' button.
 * @module oui5lib.fragment.HomeButton
 */
sap.ui.jsfragment("oui5lib.fragment.HomeButton", {
    /**
     * @param {sap.ui.core.mvc.Controller} oController The view controller.
     * If the controller has a 'wasRecordChanged' function and the record is
     * set changed a confirmation dialog is opened which will call the
     * 'handleUnsavedChanges' function of the controller.
     * @returns {sap.m.Button}
     */
    createContent: function(oController) {
        const btn =  new sap.m.Button({
            icon: "sap-icon://home",
            tooltip: "{i18n>button.home.tooltip}",
            press: function () {
                if (oController &&
                    typeof oController.wasRecordChanged === "function" &&
                    oController.wasRecordChanged()) {
                    oui5lib.messages.confirmUnsavedChanges(
                        oController.handleUnsavedChanges.bind(oController), "home");
                } else {
                    const router = oui5lib.util.getComponentRouter();
                    router.vNavTo("home");
                }
            }
        });
        return btn;
    }
});
