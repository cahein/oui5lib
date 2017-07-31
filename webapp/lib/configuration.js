jQuery.sap.require("oui5lib.request");

jQuery.sap.declare("oui5lib.configuration");

/** @namespace oui5lib.configuration */
(function() {
    var _configData = null;
    var _configDataLoading = false;

    /**
     * Get the componentName from the configuration.
     */
    function getComponentName() {
        var config = getConfigData();
        return config.componentName;
    }
    
    /**
     * Get Component.
     * @memberof oui5lib.configuration
     * @returns The Component by the configured name. Returns undefined if such a Components does not exist. Returns null if the componentName has not been specified.
     */
    function getComponent() {
        var componentName = getComponentName();
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
        var config = getConfigData();
        return config.availableLanguages;
    }

    /**
     * Get the logLevel property from the configuration.
     * @memberof oui5lib.configuration
     * @returns {string} The logLevel. Returns WARN if not set.
     */
    function getLogLevel() {
        var config = getConfigData();
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
        var config = getConfigData();
        return config.defaultLanguage;
    }

    /**
     * Get the current language.
     * @memberof oui5lib.configuration
     * @returns {string} The current language. Returns the defaultLanguage if not set.
     */
    function getCurrentLanguage() {
        var config = getConfigData();
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
        var config = getConfigData();

        var availableLanguages = config.availableLanguages;
        if (availableLanguages.indexOf(sLanguage) === -1) {
            sLanguage = config.defaultLanguage;
        }

        var oConfiguration = sap.ui.getCore().getConfiguration();
        oConfiguration.setLanguage(sLanguage);
        config.currentLanguage = sLanguage;

        setLanguageModel(sLanguage);
    }
    
    function setLanguageModel(sLanguage) {
        // set i18n model
        var oI18nModel = new sap.ui.model.resource.ResourceModel({
            bundleUrl: "i18n/i18n.properties",
            bundleLocale: sLanguage
        });
        var component = getComponent();
        if (typeof component.setModel === "function") {
            component.setModel(oI18nModel, "i18n");
        }
    }
    
    /**
     * Get the mappingDir property from the configuration.
     * @memberof oui5lib.configuration
     * @returns {string} The mapping folder. Returns undefined if not set.
     */
    function getMappingDir() {
        var config = getConfigData();
        return config.mappingDir;
    }
        
    /**
     * Get the regular expression from the validation section of the configuration.
     * @memberof oui5lib.configuration
     * @param {string} type 
     * @returns {RegExp}
     */
    function getValidationRegex(type) {
        var config = getConfigData();
        var validation = config.validation;
        if (typeof validation[type + "Regex"] === "string") {
            return new RegExp(validation[type + "Regex"]);
        }
        return null;
    }
        
    /**
     * Get config data. Loads configuration file, if necessary.
     * @memberof oui5lib.configuration
     * @returns {object} The config data
     */
    function getConfigData() {
        if (_configData === null && !_configDataLoading) {
            loadConfigData();
        }
        return _configData;
    }
    
    function loadConfigData() {
        var configFile = "oui5lib.json";
        oui5lib.request.loadJson(configFile, configDataLoaded, null, false);
        _configDataLoading = true;
    }
    
    function configDataLoaded(data) {
        _configData = data;
        _configDataLoading = false;
    }
    
    var configuration = oui5lib.namespace("configuration");
    configuration.getAvailableLanguages = getAvailableLanguages;
    configuration.getDefaultLanguage = getDefaultLanguage;
    configuration.getCurrentLanguage = getCurrentLanguage;
    configuration.setCurrentLanguage = setCurrentLanguage;

    configuration.getLogLevel = getLogLevel;
    configuration.getMappingDir = getMappingDir;
    configuration.getRegex = getValidationRegex;

    configuration.getComponent = getComponent;

    configuration.loadConfig = loadConfigData;
}());

oui5lib.configuration.loadConfig();
