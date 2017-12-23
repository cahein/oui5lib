(function () {
    function Address(id) {
        if (!(this instanceof oum.Address)) {
            return new oum.Address(id);
        }
        if (id === undefined || id === null) {
            this.setData(getNewAddress());
            this.setNew(true);
        } else {
            this.id = id;
            if (oum.addresses.isItemLoaded(id)) {
                var addressItem = oum.addresses.getItem(id);
                this.setData(addressItem);
            } else {
                this.setLoading(true);
                oum.addresses.addItemDataChangedListener(dataAvailable, this);
                oum.loader.loadAddress(id);
            }
        }
    }

    function dataAvailable(addressId) {
        if (this.id === addressId) {
            oum.addresses.removeItemDataChangedListener(dataAvailable, this);
            this.setData(oum.addresses.getItem(addressId));
            this.setLoading(false);
        }
    }

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

    function getName() {
        var firstName = this.getProperty("firstname");
        var lastName = this.getProperty("lastname");
        return firstName + " " + lastName;
    }
    
    Address.prototype = Object.create(oui5lib.itemBase);
    Address.prototype.getName = getName;
    
    oum.Address = Address;
}());
