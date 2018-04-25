describe("Address object", function() {
    beforeEach(function() {
        oum.do.addresses.addData(
            JSON.parse(JSON.stringify(oum.fixture.addressesData)),
            true);
    });

    it ("should get a new Address", function() {
        const address = new oum.do.Address();
        expect(address instanceof oum.do.Address).toBe(true);
        expect(address.isNew()).toBe(true);
    });

    it ("should get a loaded Address", function() {
        const address = new oum.do.Address(3);
        expect(address instanceof oum.do.Address).toBe(true);
        expect(address.isNew()).toBe(false);
        expect(address.id).toEqual(3);
    });

    it ("should allow to modify Address data", function() {
        const address = new oum.do.Address(3);
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
        spyOn(oum.do.Loader, "loadAddress");
        
        const address = new oum.do.Address(3);
        expect(address instanceof oum.do.Address).toBe(true);
        expect(address.isNew()).toBe(false);

        expect(oum.do.Loader.loadAddress.calls.count()).toEqual(1);
        expect(oum.do.Loader.loadAddress)
            .toHaveBeenCalledWith(3);
    });
    it ("should return the name for an Address", function() {
        const addressData = oum.fixture.addressesData[0];
        const addressName = addressData.firstname + " " + addressData.lastname;
        
        const address = new oum.do.Address(addressData.id);
        expect(typeof address.getName === "function").toBe(true);
        expect(address.getName()).toEqual(addressName);
    });
});
