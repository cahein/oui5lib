jQuery.sap.require("oui5lib.configuration");

sap.ui.jsfragment("oui5lib.fragment.LanguageSwitcher", {
    createContent: function () {
        var languageSelect = new sap.m.Select({
            tooltip: "{i18n>language.select.tooltip}",
            width: "200px",
            selectedKey: oui5lib.configuration.getCurrentLanguage(),
            change: function (oEvent) {
                var selectedLanguage = oEvent.getParameter("selectedItem").getKey();
                if (oui5lib.configuration.getCurrentLanguage() !== selectedLanguage) {
                    oui5lib.logger.debug("selected language: " + selectedLanguage);
                    oui5lib.configuration.setCurrentLanguage(selectedLanguage);
                }
            }
        });

        var availableLanguages = oui5lib.configuration.getAvailableLanguages();
        for (var i = 0, s = availableLanguages.length; i < s; i++) {
            var languageKey = availableLanguages[i];
            var item = new sap.ui.core.Item({
                text: "{i18n>language." + languageKey + "}",
                key: languageKey
            });
            languageSelect.addItem(item);
        }
        return languageSelect;
    }
});
