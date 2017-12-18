/** @namespace oum.loader */
(function() {
    function requestOrder(orderId) {
        oui5lib.request.doRequest(
            "order", "getOrder",
            { "id": orderId },
            dataRequestSucceeded
        );
    }

    function requestOrders(startDate, endDate, status, reset) {
        if (typeof reset === "boolean" && reset) {
            oum.orders.resetData();
        }
        
        var queryParams = { "startDate": startDate };
        if (typeof endDate === "string") {
            queryParams.endDate = endDate;
        }
        if (typeof status === "string") {
            queryParams.status = status;
        }
        oui5lib.request.doRequest(
            "order", "getOrders",
            queryParams,
            dataRequestSucceeded
        );
    }

    function requestAddress(addressId) {
        requestAddresses([addressId]);
    }

    function requestAddresses(addressIds) {
        oui5lib.request.doRequest(
            "address", "getAddresses",
            { "ids": addressIds },
            dataRequestSucceeded
        );
    }

    function requestProduct(productId) {
        requestProducts([productId]);
    }

    function requestProducts(productIds) {
        oui5lib.request.doRequest(
            "product", "getProducts",
            { "isbns": productIds },
            dataRequestSucceeded
        );
    }
    
    function requestStatuses() {
        oui5lib.request.doRequest(
            "status", "getStatuses",
            null,
            dataRequestSucceeded);
    }
    
    function dataRequestSucceeded(responseObject, requestInfo) {
        if (responseObject.result) {
            var data = responseObject.value;
            var entity = requestInfo.entity;
            switch(entity) {
            case "order":
                oum.orders.addData(data);
                break;
            case "product":
                oum.products.addData(data);
                break;
            case "address":
                oum.addresses.addData(data);
                break;
            case "status":
                oum.statuses.init(data);
                break;
            default:
                break;
            }
            
            oum.relationsHandler.onDataLoaded(entity, data);
        }
    }
    
    
    var loader = oum.namespace("loader");
    loader.requestOrders = requestOrders;
    loader.requestOrder = requestOrder;
    loader.requestAddresses = requestAddresses;
    loader.requestAddress = requestAddress;
    loader.requestProducts = requestProducts;
    loader.requestProduct = requestProduct;
    loader.requestStatuses = requestStatuses;

    // for testing only
    loader.dataRequestSucceeded = dataRequestSucceeded;
}());
