(function(listHelper) {
    "use strict";
    
    function getBaseObject(primaryKey) {
        if (primaryKey === undefined ||
            typeof primaryKey !== "string") {
            throw new Error("cannot create listBase object without primary key");
        }

        let _primaryKey = primaryKey,
            _model = null,
            _data = [],
            _itemsLoaded = {},
            _procFunction = null,
            _dataChangedEventListeners = [],
            _itemDataChangedEventListeners = [];
        
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
        
        function removeListener(listeners, listener, context) {
            let func, ctx;
            for (let i = 0, s = listeners.length; i < s; i++) {
                func = listeners[i][0];
                ctx = listeners[i][1];
                if (func === listener && ctx === context) {
                    listeners.splice(i, 1);
                }
            }

        }
        
        /**
         * The ListBase is a base of functions commonly useful for an array of objects.
         * @mixin
         * @example oui5lib.listBase.getObject(primaryKey);
         */
        const ListBase = {
            /**
             * Register a function to be called to process incoming data through both the setData and addData function. The item data will be passed as only parameter to the function.
             * @param func The function. 
             */
            registerProcFunction: function(func) {
                if (typeof func === "function") {
                    _procFunction = func;
                }
            },

            /**
             * Add a listener function to be called at the end of the setData and addData functions.
             * @param listener The function to be added to the event. 
             * @param context The context object for the listener function. 
             */
            addDataChangedListener: function(listener, context ) {
                if (typeof listener === "function") {
                    _dataChangedEventListeners.push([listener, context]);
                }
            },
            removeDataChangedListener: function(listener, context) {
                if (typeof listener === "function") {
                    removeListener(_dataChangedEventListeners,
                                   listener, context);
                }
            },

            /**
             * Add a function to be called when some item data was added or updated. The primary key value will be passed as only parameter to the function.
             * @param listener The function to be added to the event. 
             * @param context The context object for the listener function. 
             */
            addItemDataChangedListener: function(listener, context) {
                if (typeof listener === "function") {
                    _itemDataChangedEventListeners.push([listener, context]);
                }
            },
            removeItemDataChangedListener: function(listener, context) {
                if (typeof listener === "function") {
                    removeListener(_itemDataChangedEventListeners,
                                   listener, context);
                }
            },
            
            /**
             * Add the data.
             * @param {Object|Array} data May be either a single object or an array of objects. Already loaded objects with the same primary key will be updated. 
             */
            addData: function(data, reset) {
                if (typeof reset === "boolean" && reset) {
                    this.resetData();
                }
                let entries = null;
                if (data instanceof Array) {
                    entries = data;
                } else if (data instanceof Object) {
                    entries = [ data ];
                }
                if (entries === null) {
                    throw new TypeError("listBase.addData requires an Array");
                }

                if (_data === null) {
                    _data = [];
                }

                let id;
                
                entries.forEach(function(item) {
                    id = item[_primaryKey];
                    
                    let alreadyLoaded = isItemLoaded(id);
                    if (alreadyLoaded) {
                        listHelper.updateItemByKey(_data,
                                                   _primaryKey,
                                                   item);
                    } else {
                        _data.push(item);
                        _itemsLoaded[id] = new Date();
                    }
                    if (_itemDataChangedEventListeners.length > 0) {
                        _itemDataChangedEventListeners.forEach(
                            function(listener) {
                                listener[0].call(listener[1], id);
                            }
                        );
                    }
                });
                if (_procFunction !== null) {
                    _procFunction(entries);
                }
                updateModel(_data);

                if (_dataChangedEventListeners.length > 0) {
                    _dataChangedEventListeners.forEach(
                        function(listener) {
                            listener[0].call(listener[1]);
                        }
                    );
                }
            },

            /**
             * Reset the data. Will empty the data array.
             */
            resetData: function() {
                _itemsLoaded = {};
                _data = null;
            },
            

            /**
             * Get the data.
             * @returns {array} An array.
             */
            getData: function() {
                return _data;
            },

            /**
             * Get the number of item objects currently loaded.
             * @returns {number} The length of the data array.
             */
            getItemCount: function() {
                return _data.length;
            },

            /**
             * Query if an item with the given primary key is currently loaded.
             * @returns {boolean} Is loaded (true) or not (false).
             */
            isItemLoaded: function(keyValue) {
                return isItemLoaded(keyValue);
            },
            
            /**
             * Get an item with a given primary key. Will return null if no such item exists. It is better to test before with the isItemLoaded function.
             * @param {object} value The primaryKey value of the item to be returned.
             * @returns {array} The object with the given primaryKey value.
             */
            getItem: function(value) {
                return listHelper.getItemByKey(_data, _primaryKey, value);
            },

            /**
             * Add an item to the data.
             * @param {object} data The object to be added to the data array.
             * @returns {boolean} True if the item could be added. False means there is already an item with the same primary key value.
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
             * @param {object} item The object to be updated.
             */
            updateItem: function(item) {
                return listHelper.updateItemByKey(_data, _primaryKey, item);
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
                    _model = new sap.ui.model.json.JSONModel();
                }
                if (_data.length > 100) {
                    _model.setSizeLimit(_data.length);
                }
                _model.setData(_data);
                return _model;
            }
        };
        return ListBase;
    }
    
    let listBase = oui5lib.namespace("listBase");
    listBase.getObject = getBaseObject;
}(oui5lib.lib.listHelper));
