sap.ui.jsfragment("oum.fragment.HelpButton", {
    createContent: function () {
        const btn = new sap.m.Button({
            icon : "sap-icon://sys-help",
            tooltip : "{i18n>help.tooltip}",
            press: function() {
                const router = oui5lib.util.getComponentRouter();
                router.vNavTo("help");
            }
        });
        return btn;
    }
});
