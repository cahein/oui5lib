describe("Order entity object", function() {
    beforeAll(function() {
        oum.orders.setData([{
            "id": 2,
            "status": "processing",
            "customerAddressId": 2,
            "billingAddressId": 3,
            "orderDate": "2017-05-02 02:21:03",
            "items": [
                {
                    "productId": "1859847390",
                    "quantity": 1,
                    "unitPrice": 2.4
                },
                {
                    "productId": "0889610356",
                    "quantity": 2,
                    "unitPrice": 19.8
                }
            ]
        }]);
    });
    it ("should get a new Order", function() {
        var order = new oum.Order();
        expect(order instanceof oum.Order).toBe(true);
        expect(order.getProperty("id")).toEqual(undefined);
        expect(order.isNew()).toBe(true);
    });
    
    it ("should get an existing Order already loaded", function() {
        var order = new oum.Order(2);
        expect(order instanceof oum.Order).toBe(true);
        expect(order.getProperty("id")).toEqual(2);
        expect(order.isNew()).toBe(false);
    });

    it ("should get the id directly", function() {
        var order = new oum.Order(2);
        expect(order.id).toEqual(order.getProperty("id"));
    });
    
    it ("should add an existing Order not yet loaded", function() {
        var ordersArray = oum.orders.getData();
        expect(ordersArray.length).toBe(1);
        var orderData = oum.orders.getItem(8);
        expect(orderData).toBe(null);

        spyOn(oui5lib.request, "doRequest").and.callThrough();
        var order = new oum.Order(8);
        expect(oui5lib.request.doRequest)
            .toHaveBeenCalledWith("order", "getOrder",
                                  { "id": 8 },
                                  oum.Order.prototype.requestSucceeded);

        expect(order instanceof oum.Order).toBe(true);
        expect(order.isNew()).toBe(false);
        
        ordersArray = oum.orders.getData();
        expect(ordersArray.length).toBe(2);
        orderData = oum.orders.getItem(8);
        expect(orderData.id).toBe(8);

    });

    it ("should allow modification of Order data", function() {
        var order = new oum.Order(2);
        expect(order.getProperty("status")).toEqual("processing");
        expect(order.wasModified()).toEqual(false);
        order.setProperty("status", "shipped");
        expect(order.getProperty("status")).toEqual("shipped");
        expect(order.wasModified()).toEqual(true);
    });
    
    it ("should have functions to get the customer and billing address", function() {
        var order = oum.Order(2);
        expect(typeof order.getCustomerAddress).toEqual("function"); 
        expect(typeof order.getBillingAddress).toEqual("function"); 
    });

    it ("should get related address entity objects", function() {
        var order = oum.Order(2);
        var customerAddress = order.getCustomerAddress();
        expect(customerAddress instanceof oum.Address).toBe(true);
        expect(customerAddress.getProperty("id")).toEqual(2);
        
        var billingAddress = order.getBillingAddress();
        expect(billingAddress instanceof oum.Address).toBe(true);
        expect(billingAddress.getProperty("id")).toEqual(3);
    });

    it ("should get the order total", function() {
        var order = oum.Order(2);
        expect(order.getOrderTotal()).toEqual("42.00");
    });
    
    it ("should get the order items", function() {
        var order = oum.Order(2);
        var orderItems = order.getOrderItems();
        expect(orderItems.length).toEqual(2);
    });

    it ("should add an order item and get updated order total", function() {
        var order = oum.Order(2);
        var orderItems = order.getOrderItems();
        expect(orderItems.length).toEqual(2);

        order.addOrderEntry("0394718747", 1);
        
        orderItems = order.getOrderItems();
        expect(orderItems.length).toEqual(3);
        expect(order.getOrderTotal()).toEqual("55.09");
    });

    it ("should remove an order item", function() {
        var order = oum.Order(2);
        order.removeOrderItem("0394718747");
        var orderItems = order.getOrderItems();
        expect(orderItems.length).toEqual(2);
    });

    it ("should get an order item by product id", function() {
        var order = oum.Order(2);
        var item = order.getOrderItem("1859847390");
        expect(item.quantity).toEqual(1);
        expect(item.unitPrice).toEqual(2.4);
    });
});
