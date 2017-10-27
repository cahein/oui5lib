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
    
    function procData(addressArray) {
        for (var i = 0, s = addressArray.length; i < s; i++) {
            var address = addressArray[i];
            oum.orders.setAddressLoaded(address.id);
        }
    }
    
    var primaryKey = oui5lib.mapping.getPrimaryKey("address");
    var listBase = oui5lib.listBase.getObject(primaryKey);
    listBase.registerProcFunction(procData);
    
    var addresses = oum.namespace("addresses");
    addresses = oui5lib.util.extend(addresses, listBase);

    addresses.load = loadAddresses;
}());
