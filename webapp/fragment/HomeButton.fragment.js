sap.ui.jsfragment("oui5lib.fragment.HomeButton", {
    createContent: function () {
        var btn =  new sap.m.Button({
            icon: "sap-icon://home",
            tooltip: "{i18n>button.home.tooltip}",
            press: function () {
                var router = oui5lib.util.getComponentRouter();
                router.vNavTo("home");
            }
        });
        return btn;
    }
});
