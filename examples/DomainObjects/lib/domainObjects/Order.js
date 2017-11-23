(function () {
    function Order(id) {
        if (!(this instanceof oum.Order)) {
            return new oum.Order(id);
        }
        if (id === undefined || id === null) {
            this.setData(getNewOrder());
            this.setNew(true);
        } else {
            if (oum.orders.isItemLoaded(id)) {
                var orderEntry = oum.orders.getItem(id);
                this.setData(orderEntry);
                this.id = id;
            } else {
                _o = this;
                oui5lib.request.doRequest("order", "getOrder",
                                          { "id": id },
                                          this.requestSucceeded);
                this.setLoading(true);
            }
        }
    }
    
    var _o = null;
    
    function requestSucceeded(data) {
        oum.orders.addData(data);

        var item = data.value;
        _o.setData(oum.orders.getItem(item.id));
        _o.id = item.id;
        _o.setLoading(false);
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

    function getAddress(id) {
        if (oum.addresses.isItemLoaded(id)) {
            return new oum.Address(id);
        }
        return null;
    }

    var listHelper = oui5lib.lib.listHelper;
    function getOrderItems() {
        return this.getProperty("items");
    }

    function getOrderItem(productId) {
        var items = this.getOrderItems();
        return listHelper.getItemByKey(items, "productId", productId);
    }
    
    function removeOrderItem(productId) {
        if (this.getOrderItem(productId) !== null) {
            var items = this.getOrderItems();
            listHelper.removeByKey(items, "productId", productId);
        }
    }

    function addOrderEntry(productId, quantity) {
        var items = this.getOrderItems();

        if (this.getOrderItem(productId) === null) {
            var product = new oum.Product(productId);
            var item = {
                "productId": productId,
                "quantity": quantity,
                "unitPrice": product.getProperty("salesPrice")
            };
            items.push(item);
        }
    }

    function getOrderTotal() {
        var items = this.getOrderItems();
        var total = oum.orders.calculateOrderTotal(items);
        this.setProperty("total", total);
        return total;
    }
    
    Order.prototype = Object.create(oui5lib.itemBase);
    Order.prototype.getCustomerAddress = getCustomerAddress;
    Order.prototype.getBillingAddress = getBillingAddress;

    Order.prototype.getOrderItems = getOrderItems;
    Order.prototype.getOrderItem = getOrderItem;
    Order.prototype.addOrderEntry = addOrderEntry;
    Order.prototype.removeOrderItem = removeOrderItem;

    Order.prototype.getOrderTotal = getOrderTotal;
    
    Order.prototype.requestSucceeded = requestSucceeded;

    oum.Order = Order;
}());
