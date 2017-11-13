/** @namespace oum.products */
(function() {
    /**
     * Initialize the products object.
     * @function oum.products.init
     * @param {Array} data The products array.
     */
    function init(data) {
        if (data.value) {
            var productsData = data.value;
            if (productsData instanceof Array) {
                products.setData(productsData);
                procData(productsData);
            }
        }
    }

    function loadProducts(productIds) {
        oui5lib.request.doRequest(
            "product", "getProducts",
            {
                "isbns": productIds
            },
            oum.products.addData);
    }
    
    function handleItemDataChanged(id) {
        oum.orders.onProductLoaded(id);
    }

    var primaryKey = oui5lib.mapping.getPrimaryKey("product");
    var listBase = oui5lib.listBase.getObject(primaryKey);
    listBase.registerItemDataChangedFunction(handleItemDataChanged);

    var products = oum.namespace("products");
    products = oui5lib.util.extend(products, listBase);

    products.init = init;
    products.load = loadProducts;
}());
