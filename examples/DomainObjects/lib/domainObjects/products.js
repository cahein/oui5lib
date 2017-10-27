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

    function loadProducts(productIds) {
        oui5lib.request.doRequest(
            "product", "getProducts",
            {
                "isbns": productIds
            },
            oum.products.addData);
    }
    
    function procData(productArray) {
        for (var i = 0, s = productArray.length; i < s; i++) {
            var product = productArray[i];
            oum.orders.setProductLoaded(product.isbn);
        }
    }
    
    var primaryKey = oui5lib.mapping.getPrimaryKey("product");
    var listBase = oui5lib.listBase.getObject(primaryKey);
    listBase.registerProcFunction(procData);

    var products = oum.namespace("products");
    products = oui5lib.util.extend(products, listBase);

    products.init = init;
    products.load = loadProducts;
}());
