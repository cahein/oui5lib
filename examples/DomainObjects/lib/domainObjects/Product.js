(function () {
    function Product(id) {
        if (!(this instanceof oum.Product)) {
            return new oum.Product(id);
        }
        if (id === undefined || id === null) {
            this.setData(getNewProduct());
            this.setNew(true);
        } else {
            this.id = id;
            if (oum.products.isItemLoaded(id)) {
                var productItem = oum.products.getItem(id);
                this.setData(productItem);
            } else {
                this.setLoading(true);
                oum.products.addItemDataChangedListener(dataAvailable, this);
                oum.loader.loadProduct(id);
            }
        }
    }

    function dataAvailable(productId) {
        if (this.id === productId) {
            oum.products.removeItemDataChangedListener(dataAvailable, this);
            this.setData(oum.products.getItem(productId));
            this.setLoading(false);
        }
    }

    function getNewProduct() {
        var newProduct = {
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

    oum.Product = Product;
}());
