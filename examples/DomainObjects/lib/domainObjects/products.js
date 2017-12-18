/** @namespace oum.products */
(function() {
    var primaryKey = oui5lib.mapping.getPrimaryKey("product");
    var listBase = oui5lib.listBase.getObject(primaryKey);

    var products = oum.namespace("products");
    products = oui5lib.util.extend(products, listBase);
}());
