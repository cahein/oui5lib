(function () {
    function Address(id) {
        if (!(this instanceof oum.Address)) {
            return new oum.Address(id);
        }
        if (id === undefined || id === null) {
            this.setData(getNewAddress());
            this.setNew(true);
        } else {
            var addressEntry = oum.addresses.getItem(id);
            this.setData(addressEntry);
            this.id = id;
        }
    }

    Address.prototype = Object.create(oui5lib.itemBase);
    
    function getNewAddress() {
        var newAddress = {
            "firstName": "",
            "lastName": "",
            "street": "",
            "city": "",
            "postcode": ""
        };
        return newAddress;
    }

    oum.Address = Address;
}());
