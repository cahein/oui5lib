/** @namespace oum.orders */
(function() {
    var addressesLoading = [];
    var productsLoading = [];
    
    /**
     * Initialize the orders object.
     * @function oum.orders.init
     * @param {Array} data The orders array.
     */
    function init(data) {
        if (data.results) {
            var ordersData = data.results;
            if (ordersData instanceof Array) {
                orders.setData(ordersData);
                procData(ordersData);
            }
        }
    }

    function procData(ordersData) {
        var addressIds = [];
        var productIds = [];
        for (var i = 0, s = ordersData.length; i < s; i++) {
            var order = ordersData[i];

            var orderDateString = order.orderDate;
            order.orderDate = new Date(orderDateString);

            order.total = calculateOrderTotal(order.items);

            var addressId = order.customerAddressId;
            addAddressIdForLoading(addressIds, addressId);
            
            if (addressId !== order.billingAddressId) {
                addressId = order.billingAddressId;
                addAddressIdForLoading(addressIds, addressId);
            }

            var items = order.items;
            for (var j = 0, os = items.length; j < os; j++) {
                var entry = items[j];
                if (productIds.indexOf(entry.productId) === -1) {
                    productIds.push(entry.productId);
                }
            }
        }
        if (addressIds.length > 0) {
            registerLoading("addresses", addressIds);
            oum.addresses.load(addressIds);
        }
        if (productIds.length > 0) {
            registerLoading("products", productIds);
            oum.products.load(productIds);
        }
        try {
            orders.publishReadyEvent("orders");
        } catch(e) {
            oui5lib.logger.info(e.message);
        }
    }

    function addAddressIdForLoading(addressIds, addressId) {
        if (oum.addresses.getItem(addressId) === null) {
            if (addressIds.indexOf(addressId) === -1) {
                addressIds.push(addressId);
            }
        }
    }

    function registerLoading(type, ids) {
        var loading;
        switch(type) {
        case "addresses":
            loading = addressesLoading;
            break;
        case "products":
            loading = productsLoading;
        }
        for (var i = 0, s = ids.length; i < s; i++) {
            var id = ids[i];
            var pos = loading.indexOf(id);
            if (pos === -1) {
                loading.push(id);
            }
        }
    }
    
    function setAddressLoaded(addressId) {
        setLoaded("addresses", addressId);
    }
    
    function setProductLoaded(productId) {
        setLoaded("products", productId);
    }
    
    function setLoaded(type, id) {
        var loading;
        switch(type) {
        case "addresses":
            loading = addressesLoading;
            break;
        case "products":
            loading = productsLoading;
        }

        var pos = loading.indexOf(id);
        if (pos > -1) {
            loading.splice(pos, 1);
        }
        if (loading.length === 0) {
            try {
                orders.publishReadyEvent("order-" + type);
            } catch(e) {
                oui5lib.logger.info(e.message);
            }
        }
    }

    function calculateOrderTotal(items) {
        var total = 0.00;
        for (var i = 0, s = items.length; i < s; i++) {
            var entry = items[i];
            var quantity = entry.quantity;
            var price = entry.unitPrice;
            total += quantity * price;
        }
        return total;
    }
    
    var primaryKey = oui5lib.mapping.getPrimaryKey("order");
    var listBase = oui5lib.listBase.getObject(primaryKey);
    listBase.registerProcFunction(procData);
    
    var orders = oum.namespace("orders");
    orders = oui5lib.util.extend(orders, listBase);
    
    orders.init = init;
    orders.setAddressLoaded = setAddressLoaded;
    orders.setProductLoaded = setProductLoaded;
}());
