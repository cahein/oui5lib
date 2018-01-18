/** @namespace oui5lib.configuration */
(function() {
    /**
     * Get the componentName from the configuration.
     */
    function getComponentName() {
        let config = getConfigData();
        return config.componentName;
    }
    
    /**
     * Get Component.
     * @memberof oui5lib.configuration
     * @returns The Component by the configured name. Returns undefined if such a Components does not exist. Returns null if the componentName has not been specified.
     */
    function getComponent() {
        let componentName = getComponentName();
        if (typeof componentName === "string") {
            return sap.ui.getCore().getComponent(componentName);
        }
        return null;
    }

    /**
     * Get the availableLanguages property from the configuration.
     * @memberof oui5lib.configuration
     * @returns {Array} The available languages. Returns undefined if not set.
     */
    function getAvailableLanguages() {
        let config = getConfigData();
        return config.availableLanguages;
    }

    /**
     * Get the logLevel property from the configuration.
     * @memberof oui5lib.configuration
     * @returns {string} The logLevel. Returns WARN if not set.
     */
    function getLogLevel() {
        let config = getConfigData();
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
        let config = getConfigData();
        return config.defaultLanguage;
    }

    /**
     * Get the current language.
     * @memberof oui5lib.configuration
     * @returns {string} The current language. Returns the defaultLanguage if not set.
     */
    function getCurrentLanguage() {
        let config = getConfigData();
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
        let config = getConfigData();

        let availableLanguages = config.availableLanguages;
        if (availableLanguages.indexOf(sLanguage) === -1) {
            sLanguage = config.defaultLanguage;
        }

        let oConfiguration = sap.ui.getCore().getConfiguration();
        oConfiguration.setLanguage(sLanguage);
        config.currentLanguage = sLanguage;

        setLanguageModel(sLanguage);
    }
    
    /**
     * Set the language model to the component under the name 'i18n'. Will load oui5lib properties and enhance it with 'i18n/i18n.properties'.
     * @memberof oui5lib.configuration
     * @param {string} sLanguage 
     */
    function setLanguageModel(sLanguage) {
        // set i18n model
        let i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleUrl: "oui5lib/i18n/i18n.properties",
            bundleLocale: sLanguage
        });
        i18nModel.enhance({
            bundleUrl: "i18n/i18n.properties",
            bundleLocale: sLanguage
        });
        let component = getComponent();
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
        let config = getConfigData();
        return config.mappingDirectory;
    }

    function getEnvironment() {
        let config = getConfigData();
        if (config.environment === undefined) {
            return "production";
        }
        return config.environment;
    }

    function getUserProfileUrl() {
        let userProfileUrl = getConfigData("userProfileUrl");
        if (userProfileUrl === "undefined") {
            return null;
        }
        return userProfileUrl;
    }

    const _defaultDateTimePatterns = {
        dateTime: "YYYY-MM-dd HH:mm:ss",
        date: "YYYY-MM-dd",
        time: "HH:mm:ss"
    };

    function getDateTimeValuePattern(type) {
        if (_defaultDateTimePatterns.hasOwnProperty(type)) {
            let config = getConfigData();
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
        let oLocale = new sap.ui.core.Locale(getCurrentLanguage());
        let oLocaleData = new sap.ui.core.LocaleData(oLocale);
        switch(type) {
        case "dateTime":
            let pattern = oLocaleData.getDateTimePattern(style);
            pattern = pattern.replace(/'/g, "");
            pattern = pattern.replace("{1}", oLocaleData.getDatePattern(style));
            pattern = pattern.replace("{0}", oLocaleData.getTimePattern(style));
            return pattern;
        case "date":
            return oLocaleData.getDatePattern(style);
        case "time":
            return oLocaleData.getTimePattern(style);
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
        let config = getConfigData();
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
        let customRegex = getValidationRegex("date");
        if (customRegex !== null &&
            customRegex instanceof RegExp) {
            return customRegex;
        }
        return _dateRegex;
    }

    function getTimeRegex() {
        let customRegex = getValidationRegex("time");
        if (customRegex !== null &&
            customRegex instanceof RegExp) {
            return customRegex;
        }
        return _timeRegex;
    }

    function getPhoneRegex() {
        let customRegex = getValidationRegex("phone");
        if (customRegex !== null &&
            customRegex instanceof RegExp) {
            return customRegex;
        }
        return _phoneRegex;
    }

    function getEmailRegex() {
        let customRegex = getValidationRegex("email");
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
    
    let configuration = oui5lib.namespace("configuration");
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
