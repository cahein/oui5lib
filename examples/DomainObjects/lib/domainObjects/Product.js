(function () {
    function Product(id) {
        if (!(this instanceof oum.Product)) {
            return new oum.Product(id);
        }
        if (id === undefined || id === null) {
            this.setData(getNewProduct());
            this.setNew(true);
        } else {
            if (oum.products.isItemLoaded(id)) {
                var productEntry = oum.products.getItem(id);
                this.setData(productEntry);
                this.id = id;
            } else {
                _o = this;
                oui5lib.request.doRequest("product", "getProducts",
                                          { "isbns": [ id ] },
                                          this.requestSucceeded);
                this.setLoading(true);
            }
        }
    }

    var _o = null;
    
    function requestSucceeded(data) {
        oum.products.addData(data);

        var item = data.value[0];
        _o.id = item.isbn;
        _o.setData(oum.products.getItem(item.isbn));
        _o.setLoading(false);
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

    Product.prototype.requestSucceeded = requestSucceeded;

    oum.Product = Product;
}());
