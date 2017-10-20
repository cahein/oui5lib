sap.ui.jsfragment("oui5lib.fragment.HomeButton", {
    createContent: function(oController) {
        var btn =  new sap.m.Button({
            icon: "sap-icon://home",
            tooltip: "{i18n>button.home.tooltip}",
            press: function () {
                if (oController &&
                    typeof oController.wasRecordChanged === "function" &&
                    oController.wasRecordChanged()) {
                    oui5lib.messages.confirmUnsavedChanges(oController.handleUnsavedChanges);
                } else {
                    var router = oui5lib.util.getComponentRouter();
                    router.vNavTo("home");
                }
            }
        });
        return btn;
    }
});










