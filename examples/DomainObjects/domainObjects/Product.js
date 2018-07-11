(function () {
   function Product(id) {
      if (!(this instanceof oum.do.Product)) {
         return new oum.do.Product(id);
      }
      if (id === undefined || id === null) {
         this.setData(getNewProduct());
         this.setNew(true);
      } else {
         this.id = id;
         if (oum.do.products.isItemLoaded(id)) {
            const productItem = oum.do.products.getItem(id);
            this.setData(productItem);
         } else {
            this.setLoading(true);
            oum.do.products.addItemDataChangedListener(dataAvailable, this);
            oum.do.Loader.loadProduct(id);
         }
      }
   }

   function dataAvailable(productId) {
      if (this.id === productId) {
         oum.do.products.removeItemDataChangedListener(dataAvailable, this);
         this.setData(oum.do.products.getItem(productId));
         this.setLoading(false);
      }
   }

   function getNewProduct() {
      const newProduct = {
         "name": "",
         "description": "",
         "salesPrice": 0.00,
         "stockQty": 0
      };
      return newProduct;
   }

   function getName() {
      return this.getProperty("title/a");
   }
   
   
   Product.prototype = Object.create(oui5lib.itemBase);
   Product.prototype.getName = getName;   

   oum.do.Product = Product;
}());
