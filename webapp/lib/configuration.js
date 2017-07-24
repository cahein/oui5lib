jQuery.sap.require("oui5lib.request");

jQuery.sap.declare("oui5lib.configuration");

(function() {
    var _configData = null;
    var _configDataLoading = false;
    
    function getComponentName() {
        var config = getConfigData();
        return config.componentName;
    }
    
    function getComponent() {
        var componentName = getComponentName();
        if (typeof componentName === "string") {
            return sap.ui.getCore().getComponent(componentName);
        }
        return null;
    }
    
    function getAvailableLanguages() {
        var config = getConfigData();
        return config.availableLanguages;
    }

    function getLogLevel() {
        var config = getConfigData();
        if (config === null || typeof config.logLevel === "undefined") {
            return "WARN";
        }
        return config.logLevel;
    }

    function getDefaultLanguage() {
        var config = getConfigData();
        return config.defaultLanguage;
    }

    function getCurrentLanguage() {
        var config = getConfigData();
        if (typeof config.currentLanguage === "undefined") {
            return config.defaultLanguage;
        }
        return config.currentLanguage;
    }

    function getMappingDir() {
        var config = getConfigData();
        return config.mappingDir;
    }
        
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
     * Get config data. Loads configuration file, if necessary.
     * @function getConfigData
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

    configuration.getComponent = getComponent;

    configuration.loadConfig = loadConfigData;
}());

oui5lib.configuration.loadConfig();
