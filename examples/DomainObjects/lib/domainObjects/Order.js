(function () {
    function Order(id) {
        if (!(this instanceof oum.Order)) {
            return new oum.Order(id);
        }
        if (id === undefined || id === null) {
            this.setData(getNewOrder());
            this.setNew(true);
        } else {
            var orderEntry = oum.orders.getItem(id);
            if (orderEntry === null) {
                _o = this;
                oui5lib.request.doRequest("order", "getOrder",
                                          { "id": id },
                                          this.requestSucceeded);
                this.setLoading(true);
            } else {
                this.setData(orderEntry);
                this.id = id;
            }
        }
    }
    
    var _o = null;
    
    // 'this' may have changed
    function requestSucceeded(data) {
        _o.setData(data);
        _o.setLoading(false);
        oum.orders.addData(data);
    }
    
    function getNewOrder() {
        var newOrder = {
            "status": "new",
            "customerAddressId": null,
            "billingAddressId": null,
            "items": []
        };
        return newOrder;
    }

    function getCustomerAddress() {
        var id = this.getProperty("customerAddressId");
        return getAddress(id);
    }

    function getBillingAddress() {
        var id = this.getProperty("billingAddressId");
        return getAddress(id);
    }

    function getItems() {
        return this.getProperty("items");
    }

    function removeItem(entry) {
    }

    function updateItem(entry) {
    }

    function addProduct(productId, qty) {
    }

    function getPriceTotal() {
    }

    function getAddress(id) {
        return new oum.Address(id);
    }
    
    Order.prototype = Object.create(oui5lib.itemBase);
    Order.prototype.getCustomerAddress = getCustomerAddress;
    Order.prototype.getBillingAddress = getBillingAddress;
    Order.prototype.getProducts = getItems;
    
    Order.prototype.requestSucceeded = requestSucceeded;

    oum.Order = Order;
}());
