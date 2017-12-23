/** @namespace oum.loader */
(function() {
    function requestOrder(orderId) {
        oui5lib.request.sendMappingRequest(
            "order", "getOrder",
            { "id": orderId },
            handleSuccessfulResponse
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
        oui5lib.request.sendMappingRequest(
            "order", "getOrders",
            queryParams,
            handleSuccessfulResponse
        );
    }

    function requestAddress(addressId) {
        requestAddresses([addressId]);
    }

    function requestAddresses(addressIds) {
        oui5lib.request.sendMappingRequest(
            "address", "getAddresses",
            { "ids": addressIds },
            handleSuccessfulResponse
        );
    }

    function requestProduct(productId) {
        requestProducts([productId]);
    }

    function requestProducts(productIds) {
        oui5lib.request.sendMappingRequest(
            "product", "getProducts",
            { "isbns": productIds },
            handleSuccessfulResponse
        );
    }
    
    function requestStatuses() {
        oui5lib.request.sendMappingRequest(
            "status", "getStatuses",
            null,
            handleSuccessfulResponse);
    }
    
    function handleSuccessfulResponse(responseObject, requestInfo) {
        var entity = requestInfo.entity;
        if (responseObject.result) {
            var data = responseObject.value;
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
        } else {
            oui5lib.logger.error("No data returned: " + entity);
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
    loader.handleSuccessfulResponse = handleSuccessfulResponse;
}());
