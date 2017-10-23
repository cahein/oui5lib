/** @namespace oum.products */
(function() {
    /**
     * Initialize the products object.
     * @function oum.products.init
     * @param {Array} data The products array.
     */
    function init(data) {
        if (data.results) {
            var productsData = data.results;
            if (productsData instanceof Array) {
                products.setData(productsData);
                procData(productsData);
            }
        }
    }

    function procData(productsData) {
        setReady();
    }

    function setReady() {
        if (typeof sap !== "undefined" &&
            typeof sap.ui !== "undefined") {
            products.publishReadyEvent("products");
        }
    }
    
    var primaryKey = oui5lib.mapping.getPrimaryKey("product");
    var listBase = oui5lib.listBase.getObject(primaryKey);

    var products = oum.namespace("products");
    products = oui5lib.util.extend(products, listBase);

    products.init = init;
}());
