(function () {
    function Address(id) {
        if (!(this instanceof oum.do.Address)) {
            return new oum.do.Address(id);
        }
        if (id === undefined || id === null) {
            this.setData(getNewAddress());
            this.setNew(true);
        } else {
            this.id = id;
            if (oum.do.addresses.isItemLoaded(id)) {
                var addressItem = oum.do.addresses.getItem(id);
                this.setData(addressItem);
            } else {
                this.setLoading(true);
                oum.do.addresses.addItemDataChangedListener(dataAvailable, this);
                oum.do.loader.loadAddress(id);
            }
        }
    }

    function dataAvailable(addressId) {
        if (this.id === addressId) {
            oum.do.addresses.removeItemDataChangedListener(dataAvailable, this);
            this.setData(oum.do.addresses.getItem(addressId));
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
    
    oum.do.Address = Address;
}());
