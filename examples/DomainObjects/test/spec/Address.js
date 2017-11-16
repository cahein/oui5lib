describe("Address object", function() {
    beforeAll(function() {
        oum.addresses.setData([]);
        oum.addresses.setData([{
            "id": 3,
            "firstname": "No Privacy",
            "lastname": "Here",
            "street": "Mac Goo Str. 10",
            "city": "Fakebook",
            "postcode": "-1"
        }]);
    });

    it ("should get a new Address", function() {
        var address = new oum.Address();
        expect(address instanceof oum.Address).toBe(true);
        expect(address.isNew()).toBe(true);
    });

    it ("should get an existing Address", function() {
        var address = new oum.Address(3);
        expect(address instanceof oum.Address).toBe(true);
        expect(address.isNew()).toBe(false);
        expect(address.id).toEqual(3);
    });

    it ("should request an address", function() {
        spyOn(oui5lib.request, "doRequest").and.callThrough();
        var address = new oum.Address(4);
        expect(oui5lib.request.doRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.doRequest)
            .toHaveBeenCalledWith("address", "getAddresses",
                                  { "ids": [4] },
                                  oum.Address.prototype.requestSucceeded);

        expect(address instanceof oum.Address).toBe(true);
        expect(address.isNew()).toBe(false);
        expect(address.id).toEqual(4);
        expect(address.getProperty("firstname")).toEqual("Linus");
    });
    
    it ("should allow to modify Address data", function() {
        var address = new oum.Address(3);
        expect(address.getProperty("postcode")).toEqual("-1");
        expect(address.wasModified()).toEqual(false);
        address.setProperty("note", "Don't go there");
        expect(address.getProperty("note")).toEqual("Don't go there");
        expect(address.wasModified()).toEqual(true);
        address.setProperty("postcode", "000");
        expect(address.getProperty("postcode")).toEqual("000");
    });

});
