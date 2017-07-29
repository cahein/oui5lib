sap.ui.jsfragment("oui5lib.fragment.BackButton", {
    createContent: function () {
        var btn = new sap.m.Button({
            icon: "sap-icon://nav-back",
            tooltip: "{i18n>button.back.tooltip}",
            press: function () {
                var router = oui5lib.util.getComponentRouter();
                router.navBack();
            }
        });
        return btn;
    }
});
