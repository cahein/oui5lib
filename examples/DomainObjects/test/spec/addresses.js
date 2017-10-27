describe("Addresses collection object", function() {
    beforeAll(function() {
        oum.addresses.setData([]);
        
        spyOn(oui5lib.request, "doRequest");
        spyOn(oum.orders, "setAddressLoaded").and.callThrough();
    });
    
    it ("should load addresses", function() {
        oum.addresses.load([1, 2]);
        expect(oui5lib.request.doRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.doRequest).toHaveBeenCalledWith("address", "getAddresses", { "ids": [1, 2] }, oum.addresses.addData);

        oum.addresses.addData(
            {
                "results": [
                    {
                        "id": 1,
                        "firstName": "Donald",
                        "lastName": "Knuth",
                        "street": "Algo Street 1",
                        "city": "Mathtown 0",
                        "postcode": "123"
                    },
                    {
                        "id": 2,
                        "firstName": "Edward",
                        "lastName": "Snowden",
                        "street": "Uliza Nonsa",
                        "city": "Moscow",
                        "postcode": "001"
                    }
                ]
            }
        );

        expect(oum.orders.setAddressLoaded.calls.count()).toEqual(2);
        
        var addressData = oum.addresses.getData();
        expect(addressData.length).toEqual(2);
    });

    it ("should keep loading order", function() {
        var addressData = oum.addresses.getData();
        expect(addressData[1].id).toEqual(2);
    });
});
