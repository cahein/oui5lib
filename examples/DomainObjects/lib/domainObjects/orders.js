/** @namespace oum.orders */
(function() {
    var addressesLoading = {};
    var productsLoading = {};

    /**
     * Initialize the orders object.
     * @function oum.orders.init
     * @param {Array} data The orders array.
     */
    function init(data) {
        if (data.value) {
            var ordersData = data.value;
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
            var propDef = oui5lib.mapping.getPropertyDefinition("order",
                                                                "orderDate");
            if (typeof propDef.dateFormat === "string") {
                order.orderDate = new Date(orderDateString);
            } else {
                order.orderDate = new Date(orderDateString);
            }

            order.total = calculateOrderTotal(order.items);
            
            handleAddresses(addressIds, order);
            handleProducts(productIds, order);
            procStatus(order);
        }
        if (addressIds.length > 0) {
            oum.addresses.load(addressIds);
        }
        if (productIds.length > 0) {
            oum.products.load(productIds);
        }
        try {
            orders.publishReadyEvent("orders");
        } catch(e) {
            oui5lib.logger.info("not in an UI5 environment: " + e);
        }
    }
    
    function handleAddresses(addressIds, order) {
        var orderId = order.id;
        
        var addressId = order.customerAddressId;
        var address;
        if (oum.addresses.isItemLoaded(addressId)) {
            address = new oum.Address(addressId);
            order.customerName = address.getName();
        } else {
            addAddressIdForLoading(addressIds, orderId, addressId);
        }
        
        if (addressId !== order.billingAddressId) {
            addressId = order.billingAddressId;
            if (oum.addresses.isItemLoaded(addressId)) {
                address = new oum.Address(addressId);
                order.billingName = address.getName();
            } else {
                addAddressIdForLoading(addressIds, orderId, addressId);
            }
        }
    }
    
    function addAddressIdForLoading(addressIds, orderId, addressId) {
        if (addressIds.indexOf(addressId) === -1) {
            addressIds.push(addressId);
        }

        if (typeof addressesLoading[addressId] === "undefined") {
            addressesLoading[addressId] = [ orderId ];
        } else {
            var orderIds = addressesLoading[addressId];
            orderIds.push(orderId);
        }
    }

    function onAddressLoaded(addressId) {
        if (typeof addressesLoading[addressId] !== "undefined") {
            var address = new oum.Address(addressId);
            
            var orderIds = addressesLoading[addressId];
            for (var i = 0, s = orderIds.length; i < s; i++) {
                var orderId = orderIds[i];
                var order = orders.getItem(orderId);
                if (order.customerAddressId === addressId) {
                    order.customerName = address.getName();
                }
                if (order.billingAddressId === addressId) {
                    order.billingName = address.getName();
                }
            }

            delete addressesLoading[addressId];

            var id, allLoaded = true;
            for (id in addressesLoading) {
                allLoaded = false;
                break;
            }
            if (allLoaded) {
                try {
                    orders.publishReadyEvent("order-addresses");
                } catch(e) {
                    oui5lib.logger.info("not in an UI5 environment: " + e);
                }
            }
        }
    }

    function handleProducts(productIds, order) {
        var items = order.items;
        for (var i = 0, s = items.length; i < s; i++) {
            var entry = items[i];
            var productId = entry.productId;
            if (oum.products.isItemLoaded(productId)) {
                var product = new oum.Product(productId);
                entry.productName = product.getName();
            } else {
                if (productIds.indexOf(entry.productId) === -1) {
                    addProductIdForLoading(productIds, order.id, entry.productId);
                }
            }
        }
    }

    function addProductIdForLoading(productIds, orderId, productId) {
        if (productIds.indexOf(productId) === -1) {
            productIds.push(productId);
        }

        if (typeof productsLoading[productId] === "undefined") {
            productsLoading[productId] = [ orderId ];
        } else {
            var orderIds = productsLoading[productId];
            if (orderIds.indexOf(orderId) === -1) {
                orderIds.push(orderId);
            }
        }
    }

    function onProductLoaded(productId) {
        if (typeof productsLoading[productId] !== "undefined") {
            var product = new oum.Product(productId);

            var orderIds = productsLoading[productId];
            for (var i = 0, s = orderIds.length; i < s; i++) {
                var orderId = orderIds[i];
                var order = orders.getItem(orderId);
                if (order === null) {
                    continue;
                }
                var items = order["items"];
                for (var j = 0, os = items.length; j < os; j++) {
                    var entry = items[j];
                    if (entry.productId === productId) {
                        entry.productName = product.getName();
                    }
                }
            }
            delete productsLoading[productId];
        }
    }

    function procStatus(order) {
        if (oum.statuses.isInitialized()) {
            var status = order.status;
            var statusItem = oum.statuses.getItem(status);
            order.valueState = statusItem.valueState; 
        } else {
            oui5lib.logger.debug("statuses not yet loaded");
        }
    }
    
    function onStatusesLoaded() {
        if (typeof orders === "object") {
            var orders = orders.getData();
            for (var i = 0, s = orders.length; i < s; i++) {
                procStatus(orders[i]);
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
        return total.toFixed(2);
    }

    
    var primaryKey = oui5lib.mapping.getPrimaryKey("order");
    var listBase = oui5lib.listBase.getObject(primaryKey);
    listBase.registerProcFunction(procData);
    
    var orders = oum.namespace("orders");
    orders = oui5lib.util.extend(orders, listBase);
    
    orders.init = init;
    orders.onAddressLoaded = onAddressLoaded;
    orders.onProductLoaded = onProductLoaded;
    orders.onStatusesLoaded = onStatusesLoaded;
    orders.calculateOrderTotal = calculateOrderTotal;
}());
