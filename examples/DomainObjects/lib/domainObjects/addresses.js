/** @namespace oum.addresses */
(function() {
    function loadAddresses(addressIds) {
        oui5lib.request.doRequest(
            "address", "getAddresses",
            {
                "ids": addressIds
            },
            addAddresses);
    }
    
    function addAddresses(data) {
        if (data === undefined || data === null) {
            return;
        }
        if (data.results) {
            var addressArray = data.results;
            for (var i = 0, s = addressArray.length; i < s; i++) {
                var address = addressArray[i];
                if (addresses.getItem(address.id) === null) {
                    addresses.addItem(address);
                }
                oum.orders.setAddressLoaded(address.id);
            }
        }
    }
    
    var primaryKey = oui5lib.mapping.getPrimaryKey("address");
    var listBase = oui5lib.listBase.getObject(primaryKey);
    
    var addresses = oum.namespace("addresses");
    addresses = oui5lib.util.extend(addresses, listBase);
    addresses.setData([]);
    addresses.load = loadAddresses;
}());
