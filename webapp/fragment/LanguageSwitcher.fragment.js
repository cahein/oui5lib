sap.ui.define([
    "oui5lib/configuration",
    "oui5lib/logger"
], function(configuration, logger) {

    sap.ui.jsfragment("oui5lib.fragment.LanguageSwitcher", {
        createContent: function () {
            const languageSelect = new sap.m.Select({
                tooltip: "{i18n>language.select.tooltip}",
                width: "200px",
                selectedKey: configuration.getCurrentLanguage(),
                change: function (oEvent) {
                    const selectedLanguage = oEvent.getParameter("selectedItem").getKey();
                    if (configuration.getCurrentLanguage() !== selectedLanguage) {
                        logger.debug("selected language: " + selectedLanguage);
                        configuration.setCurrentLanguage(selectedLanguage);
                    }
                }
            });

            const availableLanguages = configuration.getAvailableLanguages();
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
});
