/** @namespace oui5lib.itemBase */
(function () {
    function updateModel() {
        if (this._model !== undefined) {
            var data = this.getData();
            if (data !== null) {
                this._model.setData(data);
            }
        }
    }
    


    /**
     * Get Model from data.
     * @memberof oui5lib.itemBase
     * @return {sap.ui.model.json.JSONModel} The JSONModel.
     */
    function getModel() {
        if (this._model === undefined) {
            if (typeof sap === "undefined" || typeof sap.ui === "undefined") {
                return null;
            }
            this._model = new sap.ui.model.json.JSONModel();
        }
        return this._model;
    }

    /**
     * Use to get object data.
     * @memberof oui5lib.itemBase
     * @return {object}
     */
    function getData() {
        return this._data;
    }

    /**
     * Use to set object data.
     * @memberof oui5lib.itemBase
     * @param {object} data
     */
    function setData(data) {
        this._data = data;
        updateModel();
    }
    
    /**
     * Use to get property value from object data.
     * @memberof oui5lib.itemBase
     * @param {string} key The parameter key.
     * @return The parameter value
     */
    function getProperty(key) {
        var item = this.getData();
        if (item === null) {
            return null;
        }

        var keys = key.split("/");
        if (keys.length > 1) {
            var subitem = item;
            for (var i = 0, s = keys.length; i < s; i++) {
                var subkey = keys[i];
                if (typeof subitem[subkey] === "undefined") {
                    return null;
                }
                subitem = subitem[subkey];
            }
            return subitem;
        }

        return item[key];
    }

    /**
     * Use to set a property value. Sets the item modified.
     * @memberof oui5lib.itemBase
     * @param {string} key The parameter key.
     * @param {string} vlue The parameter value.
     * @return {boolean} True if successful, false if key undefined.
     */
    function setProperty(key, vlue) {
        var item = this.getData();
        if (item === null) {
            return false;
        }
        
        var keys = key.split("/");
        if (keys.length > 1) {
            var subitem = item;
            for (var i = 0, s = keys.length; i < s - 1; i++) {
                var subkey = keys[i];
                if (typeof subitem[subkey] === "undefined") {
                    return false;
                }
                subitem = subitem[subkey];
            }
            subitem[keys[keys.length - 1]] = vlue;
            this._modified = true;
            return true;
        }
        
        item[key] = vlue;
        this._modified = true;
        return true;
    }
    
    /**
     * Were the item data modified?
     * @memberof oui5lib.itemBase
     * @returns {boolean} True if modified.
     */
    function wasModified() {
        return this._modified;
    }

    /**
     * Is the item new?
     * @memberof oui5lib.itemBase
     * @returns {boolean} True if new. Defaults to false.
     */
    function isNew() {
        return this._new;
    }

    /**
     * Set the item new
     * @memberof oui5lib.itemBase
     * @param {boolean} isNew True if new. Defaults to false.
     */
    function setNew(isNew) {
        this._new = isNew;
    }

    function isLoading() {
        return this._isLoading;
    }
    function setLoading(isLoading) {
        this._isLoading = isLoading;
    }

    var itemBase = oui5lib.namespace("itemBase");
    itemBase._data = null;
    itemBase._new = false;
    itemBase._modified = false;
    itemBase._isLoading = false;

    itemBase.getModel = getModel;

    itemBase.setData = setData;
    itemBase.getData = getData;

    itemBase.setNew = setNew;
    itemBase.isNew = isNew;

    itemBase.setLoading = setLoading;
    itemBase.isLoading = isLoading;

    itemBase.setProperty = setProperty;
    itemBase.getProperty = getProperty;
    itemBase.wasModified = wasModified;
}());
