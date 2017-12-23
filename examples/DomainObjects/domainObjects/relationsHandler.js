/** @namespace oum.do.relationsHandler */
(function() {
    var _missingData = {};

    function procOrders(orders) {
        var addressTypes = oum.do.orders.getAddressTypes();

        var addressesToLoad = [];
        var productsToLoad = [];
        
        orders.forEach(function(order) {
            var addressId;
            addressTypes.forEach(function(type) {
                addressId = order[type + "AddressId"];
                if (!oum.do.addresses.isItemLoaded(addressId)) {
                    if (addressesToLoad.indexOf(addressId) === -1) {
                        addressesToLoad.push(addressId);
                        addMissing(order.id, "address", addressId);
                    }
                }
            });
            var items = order.items;
            items.forEach(function(item) {
                var productId = item.productId;
                if (!oum.do.products.isItemLoaded(productId)) {
                    if (productsToLoad.indexOf(productId) === -1) {
                        productsToLoad.push(productId);
                        addMissing(order.id, "product", productId);
                    }
                }
            });
        });
        if (addressesToLoad.length > 0) {
            oum.do.loader.loadAddresses(addressesToLoad);
        }
        if (productsToLoad.length > 0) {
            oum.do.loader.loadProducts(productsToLoad);
        }
    }
    
    function onDataLoaded(entity, data) {
        data.forEach(function(item) {
            switch(entity) {
            case "address":
                resolveMissing(entity, item.id);
                break;
            case "product":
                resolveMissing(entity, item.isbn);
                break;
            case "status":
                updateOrderStatuses();
                break;
            }
        });
    }

    function clearMissingData() {
        _missingData = {};
    }



    function addMissing(orderId, type, id) {
        orderId = "order" + orderId;
        if (_missingData[orderId] === undefined) {
            _missingData[orderId] = {};
        }
        var orderEntry = _missingData[orderId];
        if (orderEntry[type] === undefined) {
            orderEntry[type] = [ id ]; 
        } else {
            var ids = orderEntry[type];
            if (ids.indexOf(id) === -1) {
                ids.push(id);
            }
        }
    }
    
    function resolveMissing(entity, id) {
        var idString, orderId,  orderMissing, ids, pos;
        var count = 0;
        for (idString in _missingData) {
            count++;

            orderMissing = _missingData[idString];
            if (typeof orderMissing[entity] !== "undefined") {
                ids = orderMissing[entity] ;
                pos = ids.indexOf(id);
                if (pos > -1) {
                    ids.splice(pos, 1);

                    if (ids.length === 0) {
                        delete orderMissing[entity];
                        if (!orderMissing.hasOwnProperty("address") &&
                            !orderMissing.hasOwnProperty("product")) {
                            orderId = idString.substring(5);
                            completeOrder(orderId);
                        
                            oui5lib.event.publishReadyEvent({
                                entity: "order",
                                id: orderId
                            });
                            delete _missingData[idString];
                            count--;
                        }
                    }
                }
            }
        }
        if (count === 0) {
            oui5lib.event.publishReadyEvent("orders");
        }
    }
    
    function updateOrderStatuses() {
        var orders = oum.do.orders.getData();
        orders.forEach(function(order) {
            oum.do.orders.procStatus(order);
        });
    }
    
    function completeOrder(orderId) {
        var order = oum.do.orders.getItem(orderId);
        if (order !== null) {
            oum.do.orders.procAddresses(order);
            oum.do.orders.procOrderedItems(order);
        }
    }

    var relationsHandler = oum.namespace("do.relationsHandler");
    relationsHandler.processOrderReferences = procOrders;
    relationsHandler.onDataLoaded = onDataLoaded;
    relationsHandler.clearMissingData = clearMissingData;
}());
