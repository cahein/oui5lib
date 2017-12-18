describe("Addresses collection object", function() {
    beforeAll(function() {
        oum.addresses.resetData();
        oum.addresses.addData(oum.addressesData);
    });
    
    it ("should preserve loading order", function() {
        var addressData = oum.addresses.getData();
        expect(addressData[0].id).toEqual(1);
        expect(addressData[1].id).toEqual(2);
        expect(addressData[2].id).toEqual(3);
    });
});
