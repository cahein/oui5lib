/** @namespace oum.addresses */
(function() {
    function loadAddresses(addressIds) {
        oui5lib.request.doRequest(
            "address", "getAddresses",
            {
                "ids": addressIds
            },
            oum.addresses.addData);
    }
    
    function handleItemDataChanged(id) {
        oum.orders.onAddressLoaded(id);
    }

    var primaryKey = oui5lib.mapping.getPrimaryKey("address");
    var listBase = oui5lib.listBase.getObject(primaryKey);
    listBase.registerItemDataChangedFunction(handleItemDataChanged);
    
    var addresses = oum.namespace("addresses");
    addresses = oui5lib.util.extend(addresses, listBase);

    addresses.load = loadAddresses;
}());
