(function () {
    function updateModel() {
        if (this._model !== undefined) {
            const data = this.getData();
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
            this._model = new sap.ui.model.json.JSONModel(this.getData());
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
        const item = this.getData();
        if (item === null) {
            return null;
        }

        const keys = key.split("/");
        if (keys.length > 1) {
            let subitem = item;
            for (let i = 0, s = keys.length; i < s; i++) {
                let subkey = keys[i];
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
        const item = this.getData();
        if (item === null) {
            return false;
        }
        
        const keys = key.split("/");
        if (keys.length > 1) {
            let subitem = item;
            for (let i = 0, s = keys.length; i < s - 1; i++) {
                let subkey = keys[i];
                if (typeof subitem[subkey] === "undefined") {
                    return false;
                }
                subitem = subitem[subkey];
            }
            subitem[keys[keys.length - 1]] = vlue;
            this.setModified();
            return true;
        }
        
        item[key] = vlue;
        this.setModified();
        return true;
    }
    
    /**
     * Set the item data modified
     * @memberof oui5lib.itemBase
     */
    function setModified() {
        this._modified = true;
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

    function isClone() {
        return this._isClone;
    }
    function setIsClone(isClone) {
        this._isClone = isClone;
    }


    /** @namespace oui5lib.itemBase */
    const itemBase = oui5lib.namespace("itemBase");

    itemBase._model = undefined;
    itemBase._data = null;
    itemBase._new = false;
    itemBase._modified = false;
    itemBase._isLoading = false;
    itemBase._isClone = false;

    itemBase.getModel = getModel;

    itemBase.setData = setData;
    itemBase.getData = getData;
    itemBase.setProperty = setProperty;
    itemBase.getProperty = getProperty;

    itemBase.setNew = setNew;
    itemBase.isNew = isNew;

    itemBase.setModified = setModified;
    itemBase.wasModified = wasModified;

    itemBase.setLoading = setLoading;
    itemBase.isLoading = isLoading;

    itemBase.setIsClone = setIsClone;
    itemBase.isClone = isClone;
}());
