jQuery.sap.require("oui5lib.listHelper");

jQuery.sap.declare("oui5lib.listBase");

(function() {
    function getBaseObject(primaryKey) {
        if (primaryKey === undefined ||
            typeof primaryKey !== "string") {
            throw Error("cannot create listBase object without primary key");
        }
        
        var listHelper = oui5lib.listHelper;
        
        var _primaryKey = primaryKey;
        var _model = null;
        var _data = null;

        var _itemsLoaded = {};
        var _procFunction = null;
        
        function isItemLoaded(id) {
            if (typeof _itemsLoaded[id] === "undefined") {
                return false;
            }
            return _itemsLoaded[id];
        }

        function updateModel(data) {
            if (_model !== null) {
                _model.setData(data, false);
            }
        }
        
        /**
         * The ListBase is a base of functions commonly useful for an array of objects.
         * @mixin
         * @example oui5lib.listBase.getObject(primaryKey);
         */
        var ListBase = {
            registerProcFunction: function(func) {
                if (typeof func === "function") {
                    _procFunction = func;
                }
            },
            
            /**
             * Set the model.
             * @param model The loaded model. 
             */
            setModel: function(model) {
                if (model === undefined || model === null) {
                    throw Error("setModel requires a model to be set");
                }
                if (typeof model.getData === "function") {
                    _model = model;
                    _data = model.getData();
                }
            },
            
            /**
             * Get the model. The sizeLimit is set to hold all data.
             * Returns null if no data are set.
             * @returns {sap.ui.model.json.JSONModel} The JSONModel.
             */
            getModel: function() {
                if (typeof sap === "undefined" ||
                    typeof sap.ui === "undefined") {
                    throw Error("openui5 is not loaded");
                }
                if (_data === null) {
                    return null;
                }
                if (_model === null) {
                    var model = new sap.ui.model.json.JSONModel();
                    _model = model;
                }
                if (_data.length > 100) {
                    _model.setSizeLimit(_data.length);
                }
                _model.setData(_data);
                return _model;
            },

            /**
             * Set the data.
             * @param {array} data We expect a Javascript array.
             */
            setData: function(data) {
                if (!(data instanceof Array)) {
                    throw new TypeError("listBase.setData only accepts an Array");
                }
                _itemsLoaded = {};
                _data = data;
                var item, id;
                for (var i = 0, s = _data.length; i < s; i++) {
                    item = _data[i];
                    id = item[_primaryKey];
                    _itemsLoaded[id] = new Date();
                }
            },

            // 'this' may have changed
            addData: function(data) {
                var entries = [], item, id;
                if (typeof data === "object") {
                    if (data.results === undefined) {
                        entries = [ data ];
                    } else {
                        if (data.results instanceof Array) {
                            entries = data.results;
                        }
                    }
                }
                
                if (entries.length > 0) {
                    if (_procFunction !== null) {
                        _procFunction(entries);
                    }
                    
                    for (var i = 0, s = entries.length; i < s; i++) { 
                        item = entries[i];
                        id = item[_primaryKey];
                        var alreadyLoaded = isItemLoaded(id);
                        if (alreadyLoaded) {
                            listHelper.updateItemByKey(_data, _primaryKey, item);
                        } else {
                            if (_data === null) {
                                _data = [];
                            }
                            _data.push(item);
                            _itemsLoaded[id] = new Date();
                        }
                    }
                    updateModel(_data);
                }
            },

            /**
             * Get the data.
             * @returns {array} A Javascript array.
             */
            getData: function() {
                return _data;
            },
            
            /**
             * Get an entry from the data.
             * @param {object} value The primaryKey value of the entry to be returned.
             * @returns {array} The object with the given primaryKey value.
             */
            getItem: function(value) {
                return listHelper.getItemByKey(_data, _primaryKey, value);
            },

            /**
             * Add an entry to the data.
             * @param {object} data The object to be added to the data array.
             */
            addItem: function(data) {
                if (this.getItem(data[_primaryKey]) === null) {
                    _data.push(data);
                    _itemsLoaded[data[_primaryKey]] = new Date();
                    return true;
                }
                return false;
            },
            
            /**
             * Update an entry of the data.
             * @param {object} data The object to be updated.
             */
            updateItem: function(data) {
                return listHelper.updateItemByKey(_data, _primaryKey, data);
            },

            /**
             * Remove an entry from the data.
             * @param {String|Number} value The primaryKey value.
             * @returns The removed entry.
             */
            removeItem: function(value) {
                delete _itemsLoaded[value];
                return listHelper.removeByKey(_data, _primaryKey, value);
                
            },

            filterBy: function(key, value) {
                return listHelper.filterBy(_data, key, value);
            },
            
            sortBy: function(key) {
                return listHelper.sortBy(_data, key);
            },
            
            /**
             * Use to publish the om ready event
             * @param {string} name The name of the ListBase object.
             */
            publishReadyEvent : function(name) {
                if (typeof sap === "undefined" ||
                    typeof sap.ui === "undefined") {
                    throw Error("Couldn't publish event " + name + ": ui5 is not loaded");
                }
                var eventBus = sap.ui.getCore().getEventBus();
                eventBus.publish("loaded", "ready", name);
            }
        };
        return ListBase;
    }
    
    var listBase = oui5lib.namespace("listBase");
    listBase.getObject = getBaseObject;
}());
