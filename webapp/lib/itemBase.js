jQuery.sap.declare("oui5lib.itemBase");

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
     * @return {sap.ui.model.json.JSONModel} The JSONModel.
     */
    function getModel() {
        if (this._model === undefined) {
            if (typeof sap === "undefined") {
                return null;
            }
            this._model = new sap.ui.model.json.JSONModel();
        }
        return this._model;
    }

    /**
     * Use to get object data.
     * @return {object}
     */
    function getData() {
        return this._data;
    }

    /**
     * Use to set object data.
     * @param {object} data
     */
    function setData(data) {
        this._data = data;
        updateModel();
    }
    
    /**
     * Use to get property value from object data.
     * @param {string} key The parameter key.
     * @return The parameter value
     */
    function getProperty(key) {
        var item = this.getData();
        if (item === null || typeof item[key] === "undefined") {
            return null;
        }
        return item[key];
    }

    /**
     * Use to set a property value. Sets the item modified.
     * @param {string} key The parameter key.
     * @param {string} vlue The parameter value.
     * @return {boolean} True if successful, false if key undefined.
     */
    function setProperty(key, vlue) {
        var item = this.getData();
        if (item === null || typeof item[key] === "undefined") {
            return false;
        }
        item[key] = vlue;
        
        this._modified = true;

        return true;
    }
    
    /**
     * Were the item data modified?
     * @returns {boolean} True if modified.
     */
    function wasModified() {
        return this._modified;
    }

    /**
     * Is the item new?
     * @returns {boolean} True if new. Defaults to false.
     */
    function isNew() {
        return this._new;
    }

    /**
     * Set the item new
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
