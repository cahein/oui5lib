(function() {
    "use strict";

    /** @namespace oui5lib.configuration */
    const configuration = oui5lib.namespace("configuration");

    /**
     * Get the componentId from the configuration.
     */
    function getComponentId() {
        return getConfigData().componentId;
    }
    
    /**
     * Get Component.
     * @memberof oui5lib.configuration
     * @returns The Component by the configured ID. Returns undefined if such a Components does not exist. Returns null if the componentId parameter has not been specified in the configuration.
     */
    function getComponent() {
        const componentId = getComponentId();
        if (typeof componentId === "string") {
            return sap.ui.getCore().getComponent(componentId);
        }
        return null;
    }

    /**
     * Get the availableLanguages property from the configuration.
     * @memberof oui5lib.configuration
     * @returns {Array} The available languages. Returns undefined if not set.
     */
    function getAvailableLanguages() {
        return getConfigData().availableLanguages;
    }

    /**
     * Get the logLevel property from the configuration.
     * @memberof oui5lib.configuration
     * @returns {string} The logLevel. Returns WARN if not set.
     */
    function getLogLevel() {
        const config = getConfigData();
        if (config === null || typeof config.logLevel === "undefined") {
            return "WARN";
        }
        return config.logLevel;
    }

    /**
     * Get the defaultLanguage property from the configuration.
     * @memberof oui5lib.configuration
     * @returns {string} The default language. Returns undefined if not set.
     */
    function getDefaultLanguage() {
        return getConfigData().defaultLanguage;
    }

    /**
     * Get the current language.
     * @memberof oui5lib.configuration
     * @returns {string} The current language. Returns the defaultLanguage if not set.
     */
    function getCurrentLanguage() {
        const config = getConfigData();
        if (typeof config.currentLanguage === "undefined") {
            return config.defaultLanguage;
        }
        return config.currentLanguage;
    }

    /**
     * Set the current language.
     * @memberof oui5lib.configuration
     * @param {string} sLanguage 
     */
    function setCurrentLanguage(sLanguage) {
        const config = getConfigData();

        const availableLanguages = config.availableLanguages;
        if (availableLanguages.indexOf(sLanguage) === -1) {
            sLanguage = config.defaultLanguage;
        }

        setLanguageModel(sLanguage);

        const ui5Configuration = sap.ui.getCore().getConfiguration();
        ui5Configuration.setLanguage(sLanguage);
        config.currentLanguage = sLanguage;
    }
    
    /**
     * Set the language model to the component under the name 'i18n'. Will load oui5lib properties and enhance it with 'i18n/i18n.properties'.
     * @memberof oui5lib.configuration
     * @param {string} sLanguage 
     */
    function setLanguageModel(sLanguage) {
        // set i18n model
        const i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleUrl: "oui5lib/i18n/i18n.properties",
            bundleLocale: sLanguage
        });
        i18nModel.enhance({
            bundleUrl: "i18n/i18n.properties",
            bundleLocale: sLanguage
        });
        const component = getComponent();
        if (typeof component.setModel === "function") {
            component.setModel(i18nModel, "i18n");
        }
    }
    
    /**
     * Get the mappingDirectory property from the configuration.
     * @memberof oui5lib.configuration
     * @returns {string} The mapping folder. Returns undefined if not set.
     */
    function getMappingDir() {
        return getConfigData().mappingDirectory;
    }

    function getEnvironment() {
        const config = getConfigData();
        if (config.environment === undefined) {
            return "production";
        }
        return config.environment;
    }

    function getUserProfileUrl() {
        const userProfileUrl = getConfigData("userProfileUrl");
        if (userProfileUrl === "undefined") {
            return null;
        }
        return userProfileUrl;
    }

    const _defaultDateTimePatterns = {
        dateTime: "yyyy-MM-dd HH:mm:ss",
        date: "yyyy-MM-dd",
        time: "HH:mm:ss"
    };

    function getDateTimeValuePattern(type) {
        if (_defaultDateTimePatterns.hasOwnProperty(type)) {
            const config = getConfigData();
            if (typeof config.defaultFormats === "object" &&
                typeof config.defaultFormats[type] === "string") {
                return  config.defaultFormats[type];
            }
            return _defaultDateTimePatterns[type];
        }
        return undefined;
    }
    
    /**
     * @param {string} type Possible values: "dateTime", "date", "time".
     * @param {string} style Possible values: "short", "medium", "long", "full".
     */
    function getDateTimeDisplayPattern(type, style) {
        const ui5Locale = new sap.ui.core.Locale(getCurrentLanguage());
        const ui5LocaleData = new sap.ui.core.LocaleData(ui5Locale);
        switch (type) {
        case "dateTime": {
            let pattern = ui5LocaleData.getDateTimePattern(style);
            pattern = pattern.replace("{1}", ui5LocaleData.getDatePattern(style));
            pattern = pattern.replace("{0}", ui5LocaleData.getTimePattern(style));
            return pattern;
        }
        case "date":
            return ui5LocaleData.getDatePattern(style);
        case "time":
            return ui5LocaleData.getTimePattern(style);
        default:
            return undefined;
        }
    }

    /**
     * Get the regular expression string from the configuration.
     * @memberof oui5lib.configuration
     * @param {string} type 
     * @returns {RegExp}
     */
    function getValidationRegex(type) {
        const config = getConfigData();
        if (typeof config.validation === "undefined") {
            return null;
        }
        
        if (typeof config.validation[type + "Regex"] === "string") {
            return new RegExp(config.validation[type + "Regex"]);
        }
        return null;
    }

    const _dateRegex = /^\d{4}-\d{2}-\d{2}$/,
          _timeRegex = /^\d{2}:\d{2}:\d{2}$/,
          _phoneRegex = /^0{2}[1-9][\d]*$/,
          _emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

    function getDateRegex() {
        const customRegex = getValidationRegex("date");
        if (customRegex !== null &&
            customRegex instanceof RegExp) {
            return customRegex;
        }
        return _dateRegex;
    }

    function getTimeRegex() {
        const customRegex = getValidationRegex("time");
        if (customRegex !== null &&
            customRegex instanceof RegExp) {
            return customRegex;
        }
        return _timeRegex;
    }

    function getPhoneRegex() {
        const customRegex = getValidationRegex("phone");
        if (customRegex !== null &&
            customRegex instanceof RegExp) {
            return customRegex;
        }
        return _phoneRegex;
    }

    function getEmailRegex() {
        const customRegex = getValidationRegex("email");
        if (customRegex !== null &&
            customRegex instanceof RegExp) {
            return customRegex;
        }
        return _emailRegex;
    }

    /**
     * Get config data. Loads configuration file, if necessary.
     * @memberof oui5lib.configuration
     * @returns {object} The config data
     */
    function getConfigData() {
        if (typeof oui5lib.config === "undefined") {
            throw new Error("oui5lib needs configuration");
        }
        return oui5lib.config;
    }
    
    configuration.getAvailableLanguages = getAvailableLanguages;
    configuration.getDefaultLanguage = getDefaultLanguage;
    configuration.getCurrentLanguage = getCurrentLanguage;
    configuration.setCurrentLanguage = setCurrentLanguage;

    configuration.getLogLevel = getLogLevel;
    configuration.getMappingDir = getMappingDir;
    configuration.getEnvironment = getEnvironment;

    configuration.getDateRegex = getDateRegex;
    configuration.getTimeRegex = getTimeRegex;
    configuration.getPhoneRegex = getPhoneRegex;
    configuration.getEmailRegex = getEmailRegex;

    configuration.getDateTimeValuePattern = getDateTimeValuePattern;
    configuration.getDateTimeDisplayPattern = getDateTimeDisplayPattern;

    configuration.getComponent = getComponent;
    configuration.getUserProfileUrl = getUserProfileUrl;
}());
