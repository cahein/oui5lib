/** @namespace oum.relationsHandler */
(function() {
    var _missingData = {};

    function procOrders(orders) {
        var addressTypes = oum.orders.getAddressTypes();

        var addressesToLoad = [];
        var productsToLoad = [];
        
        orders.forEach(function(order) {
            var addressId;
            addressTypes.forEach(function(type) {
                addressId = order[type + "AddressId"];
                if (!oum.addresses.isItemLoaded(addressId)) {
                    if (addressesToLoad.indexOf(addressId) === -1) {
                        addressesToLoad.push(addressId);
                        addMissing(order.id, "address", addressId);
                    }
                }
            });
            var items = order.items;
            items.forEach(function(item) {
                var productId = item.productId;
                if (!oum.products.isItemLoaded(productId)) {
                    if (productsToLoad.indexOf(productId) === -1) {
                        productsToLoad.push(productId);
                        addMissing(order.id, "product", productId);
                    }
                }
            });
        });
        if (addressesToLoad.length > 0) {
            oum.loader.requestAddresses(addressesToLoad);
        }
        if (productsToLoad.length > 0) {
            oum.loader.requestProducts(productsToLoad);
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



    function addMissing(orderId, type, id) {
        orderId = "o" + orderId;
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
                            orderId = idString.substring(1);
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
        var orders = oum.orders.getData();
        orders.forEach(function(order) {
            oum.orders.procStatus(order);
        });
    }
    
    function completeOrder(orderId) {
        var order = oum.orders.getItem(orderId);
        oum.orders.procAddresses(order);
        oum.orders.procOrderedItems(order);
    }

    var relationsHandler = oum.namespace("relationsHandler");
    relationsHandler.processOrderReferences = procOrders;
    relationsHandler.onDataLoaded = onDataLoaded;
}());
