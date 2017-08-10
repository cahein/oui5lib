(function () {
   function Product(id) {
      if (!(this instanceof oum.Product)) {
         return new oum.Product(id);
      }
      if (id === undefined || id === null) {
         this.setData(getNewProduct());
         this.setNew(true);
      } else {
         var productEntry = oum.products.getItem(id);
         this.setData(productEntry);
         this.id = id;
      }
   }
   
   Product.prototype = Object.create(oui5lib.itemBase);
   
   function getNewProduct() {
      var newProduct = {
         "name": "",
         "description": "",
         "salesPrice": 0.00,
         "stockQty": 0
      };
      return newProduct;
   }
   
   oum.Product = Product;
}());
