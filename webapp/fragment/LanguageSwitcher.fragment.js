sap.ui.jsfragment("oui5lib.fragment.LanguageSwitcher", {
    createContent: function () {
        const languageSelect = new sap.m.Select({
            tooltip: "{i18n>language.select.tooltip}",
            width: "200px",
            selectedKey: oui5lib.configuration.getCurrentLanguage(),
            change: function (oEvent) {
                const selectedLanguage = oEvent.getParameter("selectedItem").getKey();
                if (oui5lib.configuration.getCurrentLanguage() !== selectedLanguage) {
                    oui5lib.logger.debug("selected language: " + selectedLanguage);
                    oui5lib.configuration.setCurrentLanguage(selectedLanguage);
                }
            }
        });

        const availableLanguages = oui5lib.configuration.getAvailableLanguages();
        if (availableLanguages !== undefined) {
            let item;
            availableLanguages.forEach(function(languageKey) {
                item = new sap.ui.core.Item({
                    text: "{i18n>language." + languageKey + "}",
                    key: languageKey
                });
                languageSelect.addItem(item);
            });
        }
        return languageSelect;
    }
});
