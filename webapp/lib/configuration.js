(function() {
    var configData = null;
    
    function getComponent() {
        var config = getConfigData();
        return sap.ui.getCore().getComponent(config.componentName);
    }
    
    function getAvailableLanguages() {
        var config = getConfigData();
        return config.availableLanguages;
    }

    function getLogLevel() {
        var config = getConfigData();
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

    function getTilesDef() {
        var config = getConfigData();
        if (config.entryPoints !== "undefined") {
            return config.entryPoints;
        }
        return false;
    }

    function getAppModel() {
        var component = getComponent();
        var appConfig = component.getManifestEntry("sap.app");
        
        var appModel = new sap.ui.model.json.JSONModel({
            appTitle: appConfig.title,
            appVersion: appConfig.applicationVersion.version,
            openui5Version: sap.ui.version
        });

        return appModel;
    }
    
    /**
     * Get config data. Loads configuration file, if necessary
     * @function getConfigData
     * @memberof oui5lib.configuration
     * @returns {object} The config data
     */
    function getConfigData() {
        if (configData === null) {
            var configFile = "../oui5lib.json";
            configData = oui5lib.request.loadFile(configFile);
        }
        return configData;
    }
    
    var configuration = oui5lib.namespace("configuration");
    configuration.getAvailableLanguages = getAvailableLanguages;
    configuration.getDefaultLanguage = getDefaultLanguage;
    configuration.getCurrentLanguage = getCurrentLanguage;
    configuration.getLogLevel = getLogLevel;
    configuration.getMappingDir = getMappingDir;

    configuration.setCurrentLanguage = setCurrentLanguage;
    configuration.getAppInfoModel = getAppModel;
    configuration.getEntryPoints = getTilesDef;
}());
