/** @namespace oum.statuses */
(function() {
    var initialized = false;
    
    /**
     * Initialize the statuses object.
     * @function oum.statuses.init
     * @param {Array} data The statuses array.
     */
    function init(data) {
        if (data instanceof Array) {
            statuses.resetData();
            statuses.addData(data);
            initialized = true;
        }
    }

    function isInitialized() {
        return initialized;
    }
    
    var primaryKey = oui5lib.mapping.getPrimaryKey("status");
    var listBase = oui5lib.listBase.getObject(primaryKey);

    var statuses = oum.namespace("statuses");
    statuses = oui5lib.util.extend(statuses, listBase);

    statuses.init = init;
    statuses.isInitialized = isInitialized;
}());

oum.loader.loadStatuses();
