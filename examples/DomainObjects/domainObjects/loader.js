/** @namespace oum.do.loader */
(function() {
    function queryOrders(query) {
        oui5lib.request.sendMappingRequest(
            "order", "getOrders",
            query,
            handleSuccessfulResponse
        );
    }

    function loadOrder(orderId) {
        oui5lib.request.sendMappingRequest(
            "order", "getOrder",
            { "id": orderId },
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
                oum.do.orders.addData(data);
                break;
            case "product":
                oum.do.products.addData(data);
                break;
            case "address":
                oum.do.addresses.addData(data);
                break;
            case "status":
                oum.do.statuses.init(data);
                break;
            default:
                break;
            }
            
            oum.do.relationsHandler.onDataLoaded(entity, data);
        } else {
            oui5lib.logger.error("No data returned: " + entity);
        }
    }
    
    
    var loader = oum.namespace("do.loader");
    loader.queryOrders = queryOrders;
    loader.loadOrder = loadOrder;
    loader.loadAddresses = loadAddresses;
    loader.loadAddress = loadAddress;
    loader.loadProducts = loadProducts;
    loader.loadProduct = loadProduct;
    loader.loadStatuses = loadStatuses;

    // for testing only
    loader.handleSuccessfulResponse = handleSuccessfulResponse;
}());
