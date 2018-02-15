sap.ui.jsfragment("oui5lib.fragment.BackButton", {
    createContent: function(oController) {
        var btn = new sap.m.Button({
            icon: "sap-icon://nav-back",
            tooltip: "{i18n>button.back.tooltip}",
            press: function () {
                var router;
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
