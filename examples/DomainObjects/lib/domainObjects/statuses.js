/** @namespace oum.statuses */
(function() {
    var initialized = false;
    
    /**
     * Initialize the statuses object.
     * @function oum.statuses.init
     * @param {Array} data The statuses array.
     */
    function init(data) {
        if (data.value) {
            var statusesData = data.value;
            if (statusesData instanceof Array) {
                statuses.setData(statusesData);
                initialized = true;

                oum.orders.onStatusesLoaded();
            }
        }
    }

    function isInitialized() {
        return initialized;
    }
    
    function loadStatuses() {
        initialized = false;
        oui5lib.request.doRequest(
            "status", "getStatuses",
            null,
            oum.statuses.init);
    }
    
    var primaryKey = oui5lib.mapping.getPrimaryKey("status");
    var listBase = oui5lib.listBase.getObject(primaryKey);

    var statuses = oum.namespace("statuses");
    statuses = oui5lib.util.extend(statuses, listBase);

    statuses.init = init;
    statuses.load = loadStatuses;
    statuses.isInitialized = isInitialized;
}());

oum.statuses.load();
