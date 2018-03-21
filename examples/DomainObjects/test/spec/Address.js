describe("Address object", function() {
    beforeEach(function() {
        oum.do.addresses.resetData();
        oum.do.addresses.addData(oum.fixture.addressesData);
    });

    it ("should get a new Address", function() {
        var address = new oum.do.Address();
        expect(address instanceof oum.do.Address).toBe(true);
        expect(address.isNew()).toBe(true);
    });

    it ("should get a loaded Address", function() {
        var address = new oum.do.Address(3);
        expect(address instanceof oum.do.Address).toBe(true);
        expect(address.isNew()).toBe(false);
        expect(address.id).toEqual(3);
    });

    it ("should allow to modify Address data", function() {
        var address = new oum.do.Address(3);
        expect(address.getProperty("postcode")).toEqual("-1");
        expect(address.wasModified()).toEqual(false);
        address.setProperty("note", "Don't go there");
        expect(address.getProperty("note")).toEqual("Don't go there");
        expect(address.wasModified()).toEqual(true);
        address.setProperty("postcode", "000");
        expect(address.getProperty("postcode")).toEqual("000");
    });

    it ("should call loader to request an Address", function() {
        oum.do.addresses.resetData();
        spyOn(oum.do.loader, "loadAddress");
        
        var address = new oum.do.Address(3);
        expect(address instanceof oum.do.Address).toBe(true);
        expect(address.isNew()).toBe(false);

        expect(oum.do.loader.loadAddress.calls.count()).toEqual(1);
        expect(oum.do.loader.loadAddress)
            .toHaveBeenCalledWith(3);
    });
});
