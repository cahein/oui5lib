(function () {
   function Order(id, isClone) {
      if (!(this instanceof oum.do.Order)) {
         return new oum.do.Order(id, isClone);
      }
      if (typeof isClone !== "boolean") {
         isClone = false;
      }
      this.setIsClone(isClone);

      if (id === undefined || id === null) {
         this.setData(getNewOrder());
         this.setNew(true);
      } else {
         this.id = id;
         if (oum.do.orders.isItemLoaded(id)) {
            let orderEntry = oum.do.orders.getItem(id);
            if (isClone) {
               orderEntry = oui5lib.util.cloneData(orderEntry);
            }
            this.setData(orderEntry);
         } else {
            this.setLoading(true);
            oum.do.orders.addItemDataChangedListener(dataAvailable, this);
            oum.do.Loader.loadOrder(id);
         }
      }
   }
   
   function dataAvailable(orderId) {
      if (this.id === orderId) {
         oum.do.orders.removeItemDataChangedListener(dataAvailable, this);
         let orderEntry = oum.do.orders.getItem(orderId);
         if (this.isClone()) {
            orderEntry = oui5lib.util.cloneData(orderEntry);
         }
         this.setData(orderEntry);
         this.setLoading(false);
      }
   }

   function getNewOrder() {
      const newOrder = {
         "id": "-1",
         "status": "new",
         "billingAddressId": null,
         "shippingAddressId": null,
         "items": []
      };
      if (oui5lib.util.isUI5Env()) {
         newOrder.statusText = oui5lib.util.getI18nText("orderStatus.new");
      }
      return newOrder;
   }

   function getBillingAddress() {
      const id = this.getProperty("billingAddressId");
      return getAddress.call(this, id);
   }

   function getShippingAddress() {
      const id = this.getProperty("shippingAddressId");
      return getAddress.call(this, id);
   }

   function getAddress(id) {
      if (oum.do.addresses.isItemLoaded(id)) {
         return new oum.do.Address(id, this.isClone());
      }
      return null;
   }
   function shiptoBillingAddress() {
      return this.getProperty("billingAddressId") ===
         this.getProperty("shippingAddressId");
   }



   
   function getOrderItems() {
      const items = this.getProperty("items");
      items.forEach(function(item) {
         if (oum.do.products.isItemLoaded(item.productId)) {
            const product = new oum.do.Product(item.productId);
            item.productName = product.getName();
         }
         const unitPrice = item.unitPrice;
         if (typeof unitPrice === "number") {
            item.unitPrice = unitPrice.toFixed(2);
            const total = unitPrice * item.quantity;
            item.lineTotal = total.toFixed(2);
         }
      });
      return items;
   }

   const listHelper = oui5lib.lib.listHelper;

   function getOrderItem(productId) {
      const items = this.getOrderItems();
      return listHelper.getItemByKey(items, "productId", productId);
   }

   function changeOrderItemQuantity(productId, quantity) {
      const orderItem = this.getOrderItem(productId);
      if (orderItem === null || isNaN(parseInt(quantity))) {
         return false;
      }
      
      orderItem.quantity = parseInt(quantity);
      const unitPrice = parseFloat(orderItem.unitPrice);
      if (typeof unitPrice === "number") {
         let total = unitPrice * orderItem.quantity;
         orderItem.lineTotal = total.toFixed(2);
      }
      this.setOrderTotal();
      return true;
   }

   function removeOrderItem(productId) {
      let removedItem;
      if (this.getOrderItem(productId) !== null) {
         const items = this.getOrderItems();
         removedItem = listHelper.removeByKey(items, "productId", productId);
         if (removedItem !== null) {
            this.setOrderTotal();
         }
      }
      return removedItem;
   }

   function addOrderItem(productId, quantity) {
      if (!oum.do.products.isItemLoaded(productId) || isNaN(quantity)) {
         return;
      }

      const items = this.getOrderItems();
      if (this.getOrderItem(productId) === null) {
         const product = new oum.do.Product(productId);
         const item = {
            "productId": productId,
            "quantity": quantity,
            "unitPrice": product.getProperty("salesPrice")
         };
         items.push(item);

         this.setOrderTotal();
      }
   }

   function setOrderTotal() {
      const items = this.getOrderItems();
      const total = oum.do.orders.calculateOrderTotal(items);
      this.setProperty("total", total);
      return total;
   }
   
   Order.prototype = Object.create(oui5lib.itemBase);
   Order.prototype.getBillingAddress = getBillingAddress;
   Order.prototype.getShippingAddress = getShippingAddress;
   Order.prototype.shiptoBillingAddress = shiptoBillingAddress;

   Order.prototype.getOrderItems = getOrderItems;
   Order.prototype.addOrderItem = addOrderItem;
   Order.prototype.removeOrderItem = removeOrderItem;
   Order.prototype.changeOrderItemQuantity = changeOrderItemQuantity;
   
   Order.prototype.getOrderItem = getOrderItem;
   Order.prototype.setOrderTotal = setOrderTotal;
   oum.do.Order = Order;
}());
