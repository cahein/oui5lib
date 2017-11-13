(function () {
    function Address(id) {
        if (!(this instanceof oum.Address)) {
            return new oum.Address(id);
        }
        if (id === undefined || id === null) {
            this.setData(getNewAddress());
            this.setNew(true);
        } else {
            if (oum.addresses.isItemLoaded(id)) {
                var addressEntry = oum.addresses.getItem(id);
                this.setData(addressEntry);
                this.id = id;
            } else {
                _o = this;
                oui5lib.request.doRequest("address", "getAddresses",
                                          { "ids": [ id ] },
                                          this.requestSucceeded);
                this.setLoading(true);
            }
        }
    }

    var _o = null;

    function requestSucceeded(data) {
        oum.addresses.addData(data);

        var item = data.value[0];
        _o.id = item.id;
        _o.setData(oum.addresses.getItem(item.id));
        _o.setLoading(false);
        
    }

    function getName() {
        var firstName = this.getProperty("firstname");
        var lastName = this.getProperty("lastname");
        return firstName + " " + lastName;
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

    Address.prototype = Object.create(oui5lib.itemBase);
    Address.prototype.getName = getName;
    Address.prototype.requestSucceeded = requestSucceeded;
    
    oum.Address = Address;
}());
