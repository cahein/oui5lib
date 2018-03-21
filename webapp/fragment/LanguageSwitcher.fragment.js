/**
 * Use this fragment to get a Select control with languages to choose from. The available languages are configured in the oui5lib.json. Upon selecting another language it is set as the current language and the the related i18n model is updated using the  {@link oui5lib.configuration.setCurrentLanguage} function.
 * @module oui5lib.fragment.LanguageSwitcher
 */
sap.ui.jsfragment("oui5lib.fragment.LanguageSwitcher", {
    /**
     * Creates the control.
     * @returns {sap.m.Select} The Select control.
     */
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
