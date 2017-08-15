sap.ui.jsfragment("oui5lib.fragment.BackButton", {
    createContent: function(oController) {
        var btn = new sap.m.Button({
            icon: "sap-icon://nav-back",
            tooltip: "{i18n>button.back.tooltip}",
            press: function () {
                if (oController) {
                    if (typeof oController.back === "function") {
                        oController.back();
                    } else {
                        if (typeof oController.wasRecordChanged === "function" &&
                            oController.wasRecordChanged()) {
                            oui5lib.ui.confirmUnsavedChanges(oController.handleUnsavedChanges);
                        }
                    }
                } else {
                    var router = oui5lib.util.getComponentRouter();
                    router.navBack();
                }
            }
        });
        return btn;
    }
});
