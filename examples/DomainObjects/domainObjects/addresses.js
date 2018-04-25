/** @namespace oum.do.addresses */
(function() {
   const primaryKey = oui5lib.mapping.getPrimaryKey("address");
   const listBase = oui5lib.listBase.getObject(primaryKey);

   let addresses = oum.namespace("do.addresses");
   addresses = oui5lib.util.extend(addresses, listBase);
}());
