describe("Addresses collection object", function() {
    beforeAll(function() {
        oum.do.addresses.resetData();
        oum.do.addresses.addData(oum.fixture.addressesData);
    });
    
    it ("should preserve loading order", function() {
        var addressData = oum.do.addresses.getData();
        expect(addressData[0].id).toEqual(1);
        expect(addressData[1].id).toEqual(2);
        expect(addressData[2].id).toEqual(3);
    });
});
