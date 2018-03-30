(function () {
    function Order(id) {
        if (!(this instanceof oum.do.Order)) {
            return new oum.do.Order(id);
        }
        if (id === undefined || id === null) {
            this.setData(getNewOrder());
            this.setNew(true);
        } else {
            this.id = id;
            if (oum.do.orders.isItemLoaded(id)) {
                var orderEntry = oum.do.orders.getItem(id);
                this.setData(orderEntry);
            } else {
                this.setLoading(true);
                oum.do.orders.addItemDataChangedListener(dataAvailable, this);
                oum.do.loader.loadOrder(id);
            }
        }
    }
    
    function dataAvailable(orderId) {
        if (this.id === orderId) {
            oum.do.orders.removeItemDataChangedListener(dataAvailable, this);
            this.setData(oum.do.orders.getItem(orderId));
            this.setLoading(false);
        }
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

    function getBillingAddress() {
        var id = this.getProperty("billingAddressId");
        return getAddress(id);
    }

    function getShippingAddress() {
        var id = this.getProperty("shippingAddressId");
        return getAddress(id);
    }

    function getAddress(id) {
        if (oum.do.addresses.isItemLoaded(id)) {
            return new oum.do.Address(id);
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
            const items = this.getOrderItems();
            return listHelper.removeByKey(items, "productId", productId);
        }
        return false;
    }

    function addOrderItem(productId, quantity) {
        var items = this.getOrderItems();

        if (this.getOrderItem(productId) === null) {
            var product = new oum.do.Product(productId);
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
        var total = oum.do.orders.calculateOrderTotal(items);
        this.setProperty("total", total);
        return total;
    }
    
    Order.prototype = Object.create(oui5lib.itemBase);
    Order.prototype.getBillingAddress = getBillingAddress;
    Order.prototype.getShippingAddress = getShippingAddress;

    Order.prototype.getOrderItems = getOrderItems;
    Order.prototype.getOrderItem = getOrderItem;
    Order.prototype.addOrderEntry = addOrderItem;
    Order.prototype.removeOrderItem = removeOrderItem;

    Order.prototype.getOrderTotal = getOrderTotal;
    
    oum.do.Order = Order;
}());
