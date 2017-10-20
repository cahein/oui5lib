if (typeof oum === "undefined") {
    var oum = {};
}
oum.namespace = function(string) {
    var object = this;
    var levels = string.split(".");
    for (var i = 0, l = levels.length; i < l; i++) {
        if (typeof object[levels[i]] === "undefined") {
            object[levels[i]] = {};
        }
        object = object[levels[i]];
    }
    return object;
};

oui5lib.isTest = true;
oui5lib.request.getTestUrl = function(requestUrl) {
    switch(requestUrl) {
    case "getAddresses":
        return "../model/addresses.json";
    case "getOrders":
        return "../model/orders.json";
    case "getOrder":
        return "../model/order.json";
    case "getProducts":
        return "../model/products.json";
    default:
        return null;
    }
};
