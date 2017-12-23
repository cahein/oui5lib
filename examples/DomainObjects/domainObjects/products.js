/** @namespace oum.do.products */
(function() {
    var primaryKey = oui5lib.mapping.getPrimaryKey("product");
    var listBase = oui5lib.listBase.getObject(primaryKey);

    var products = oum.namespace("do.products");
    products = oui5lib.util.extend(products, listBase);
}());
