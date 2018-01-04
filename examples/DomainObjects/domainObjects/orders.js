/** @namespace oum.do.orders */
(function() {
    var _addressTypes = ["billing", "shipping"];
    
    function procData(orders) {
        oum.do.relationsHandler.processOrderReferences(orders);
        
        orders.forEach(function(order) {
            var orderDateString = order.orderDate;
            var propDef = oui5lib.mapping.getEntityAttributeSpec("order",
                                                                 "orderDate");
            if (typeof propDef.dateFormat === "string") {
                order.orderDate = new Date(orderDateString);
            } else {
                order.orderDate = new Date(orderDateString);
            }

            order.total = calculateOrderTotal(order.items);

            procStatus(order);
            procAddresses(order);
            procOrderedItems(order);
        });
    }

    function procAddresses(order) {
        var address, addressId;
        _addressTypes.forEach(function(type) {
            addressId = order[type + "AddressId"];
            if (oum.do.addresses.isItemLoaded(addressId)) {
                address = new oum.do.Address(addressId);
                order[type + "Name"] = address.getName();
            }
        });
    }
    
    function procOrderedItems(order) {
        var items = order.items;
        items.forEach(function(item) {
            var productId = item.productId;
            if (oum.do.products.isItemLoaded(productId)) {
                var product = new oum.do.Product(productId);
                item.productName = product.getName();
            }
        });
    }

    function procStatus(order) {
        if (oum.do.statuses.isInitialized()) {
            var status = order.status;
            var statusItem = oum.do.statuses.getItem(status);
            order.valueState = statusItem.valueState; 
        } else {
            oui5lib.logger.info("statuses not yet loaded");
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

    function getAddressTypes() {
        return _addressTypes;
    }
    
    var primaryKey = oui5lib.mapping.getPrimaryKey("order");
    var listBase = oui5lib.listBase.getObject(primaryKey);
    listBase.registerProcFunction(procData);

    var orders = oum.namespace("do.orders");
    orders = oui5lib.util.extend(orders, listBase);
    
    orders.calculateOrderTotal = calculateOrderTotal;

    orders.getAddressTypes = getAddressTypes;
    
    orders.procAddresses = procAddresses;
    orders.procOrderedItems = procOrderedItems;
    orders.procStatus = procStatus;
}());
