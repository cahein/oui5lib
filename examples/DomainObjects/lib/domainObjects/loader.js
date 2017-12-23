/** @namespace oum.loader */
(function() {
    function loadOrder(orderId) {
        oui5lib.request.sendMappingRequest(
            "order", "getOrder",
            { "id": orderId },
            handleSuccessfulResponse
        );
    }

    function loadOrders(startDate, endDate, status, reset) {
        if (typeof reset === "boolean" && reset) {
            oui5lib.logger.info("resetting orders");
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

    function loadAddress(addressId) {
        loadAddresses([addressId]);
    }

    function loadAddresses(addressIds) {
        oui5lib.request.sendMappingRequest(
            "address", "getAddresses",
            { "ids": addressIds },
            handleSuccessfulResponse
        );
    }

    function loadProduct(productId) {
        loadProducts([productId]);
    }

    function loadProducts(productIds) {
        oui5lib.request.sendMappingRequest(
            "product", "getProducts",
            { "isbns": productIds },
            handleSuccessfulResponse
        );
    }
    
    function loadStatuses() {
        oui5lib.request.sendMappingRequest(
            "status", "getStatuses",
            null,
            handleSuccessfulResponse);
    }
    
    function handleSuccessfulResponse(responseObject, requestInfo) {
        var entity = requestInfo.entity;
        if (responseObject.result) {
            var data = responseObject.value;
            if (!(data instanceof Array) && data instanceof Object) {
                data = [ data ];
            }
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
    loader.loadOrders = loadOrders;
    loader.loadOrder = loadOrder;
    loader.loadAddresses = loadAddresses;
    loader.loadAddress = loadAddress;
    loader.loadProducts = loadProducts;
    loader.loadProduct = loadProduct;
    loader.loadStatuses = loadStatuses;

    // for testing only
    loader.handleSuccessfulResponse = handleSuccessfulResponse;
}());
