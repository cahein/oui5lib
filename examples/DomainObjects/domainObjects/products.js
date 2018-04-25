/** @namespace oum.do.products */
(function() {
   const primaryKey = oui5lib.mapping.getPrimaryKey("product");
   const listBase = oui5lib.listBase.getObject(primaryKey);

   let products = oum.namespace("do.products");
   products = oui5lib.util.extend(products, listBase);
}());
