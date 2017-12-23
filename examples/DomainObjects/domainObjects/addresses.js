/** @namespace oum.do.addresses */
(function() {
    var primaryKey = oui5lib.mapping.getPrimaryKey("address");
    var listBase = oui5lib.listBase.getObject(primaryKey);

    var addresses = oum.namespace("do.addresses");
    addresses = oui5lib.util.extend(addresses, listBase);
}());
