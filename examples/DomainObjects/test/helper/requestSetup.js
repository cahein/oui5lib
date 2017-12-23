oui5lib.request.getTestingUrl = function(pathname) {
    switch(pathname) {
    case "getOrders":
        return "mockdata/orders.json";
    case "getOrder":
        return "mockdata/order.json";
    case "getProducts":
        return "mockdata/products.json";
    case "getAddresses":
        return "mockdata/addresses.json";
    case "getStatuses":
        return "mockdata/statuses.json";
    default:
        return null;
    }
};
