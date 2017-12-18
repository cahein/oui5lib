describe("Address object", function() {
    beforeAll(function() {
        oum.addresses.resetData();
        oum.addresses.addData(oum.addressesData);
    });

    it ("should get a new Address", function() {
        var address = new oum.Address();
        expect(address instanceof oum.Address).toBe(true);
        expect(address.isNew()).toBe(true);
    });

    it ("should get a loaded Address", function() {
        var address = new oum.Address(3);
        expect(address instanceof oum.Address).toBe(true);
        expect(address.isNew()).toBe(false);
        expect(address.id).toEqual(3);
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

    it ("should call loader to request an Address", function() {
        oum.addresses.resetData();
        spyOn(oum.loader, "requestAddress");
        
        var address = new oum.Address(3);
        expect(address instanceof oum.Address).toBe(true);
        expect(address.isNew()).toBe(false);

        expect(oum.loader.requestAddress.calls.count()).toEqual(1);
        expect(oum.loader.requestAddress)
            .toHaveBeenCalledWith(3);
    });
});
