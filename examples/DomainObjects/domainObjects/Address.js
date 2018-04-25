(function () {
   function Address(id, isClone) {
      if (!(this instanceof oum.do.Address)) {
         return new oum.do.Address(id);
      }
      if (typeof isClone !== "boolean") {
         isClone = false;
      }
      this.setIsClone(isClone);

      if (id === undefined || id === null) {
         this.setData(getNewAddress());
         this.setNew(true);
      } else {
         this.id = id;
         if (oum.do.addresses.isItemLoaded(id)) {
            let addressEntry = oum.do.addresses.getItem(id);
            if (isClone) {
               addressEntry = oui5lib.util.cloneData(addressEntry);
            }
            this.setData(addressEntry);
         } else {
            this.setLoading(true);
            oum.do.addresses.addItemDataChangedListener(dataAvailable, this);
            oum.do.Loader.loadAddress(id);
         }
      }
   }

   function dataAvailable(addressId) {
      if (this.id === addressId) {
         oum.do.addresses.removeItemDataChangedListener(dataAvailable, this);
         let addressEntry = oum.do.addresses.getItem(addressId);
         if (this.isClone()) {
            addressEntry = oui5lib.util.cloneData(addressEntry);
         }
         this.setData(addressEntry);
         this.setLoading(false);
      }
   }

   function getNewAddress() {
      const newAddress = {
         "firstname": "",
         "lastname": "",
         "street": "",
         "city": "",
         "postcode": "",
         "countryCode": "",
         "phone": ""
      };
      return newAddress;
   }

   function getName() {
      const firstName = this.getProperty("firstname");
      const lastName = this.getProperty("lastname");
      return firstName + " " + lastName;
   }
   
   Address.prototype = Object.create(oui5lib.itemBase);
   Address.prototype.getName = getName;
   
   oum.do.Address = Address;
}());
