(function() {
    /**
     * @param {Array} list The list, from which the entry shall be removed.
     * @param {String} keyName The name of the key field. 
     * @param {String|Number} keyValue The key value. Maybe a string or number.
     * @returns {Boolean} The removed entry or undefined or null.
     */
    function removeByKey(list, keyName, keyValue) {
        if (typeof list === "undefined" ||
            list.length === 0) {
            return null;
        }

        var removedEntry = null;
        for (var i = 0, s = list.length; i < s; i++) {
            if (list[i][keyName] == keyValue) {
                removedEntry = list.splice(i, 1);
                break;
            }
        }
        return removedEntry;
    }
    
    /**
     * @param {Array} list The list, where to find the entry.
     * @param {String} keyName The name of the key field to compare.
     * @param {String|Number} keyValue The key value. May be a string or number.
     * @returns Returns the item.
     */
    function getItemByKey(list, keyName, keyValue) {
        var item = null;
        for (var i = 0, s = list.length; i < s; i++) {
            if (list[i][keyName] == keyValue) {
                item = list[i];
                break;
            }
        }
        return item;
    }
    
    /**
     * @param {Array} list The list, where to find the entry.
     * @param {String} keyName The name of the key field to compare.
     * @param {Object} updatedItem The item to update.
     * @returns {Boolean} True (updated), or otherwise false.
     */
    function updateItemByKey(list, keyName, updatedItem) {
        for (var i = 0, s = list.length; i < s; i++) {
            var item = list[i];
            if (item[keyName] == updatedItem[keyName]) {
                list[i] = updatedItem;
                return true;
            }
        }
        return false;
    }
    
    /**
     * Filter array by key and value.
     * @param {Array} list The array to filter.
     * @param {String} key The key to filter by.
     * @param {String} value The value to filter by.
     * @returns {Array} The array of filtered items.
     */
    function filterBy(list, key, value) {
        var filtered = [];
        for (var i = 0, s = list.length; i < s; i++) {
            var item = list[i];
            if (item[key] === value) {
                filtered.push(item);
            }
        }
        return filtered;
    }

    /**
     * Sort array by key.
     * @param {Array} list The array to sort.
     * @param {String} key The key to sort by.
     * @returns {Array} The sorted array.
     */
    function sortBy(list, key) {
        return list.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    var listhelper = oui5lib.namespace("lib.listHelper");
    listhelper.removeByKey = removeByKey;
    listhelper.getItemByKey = getItemByKey;
    listhelper.updateItemByKey = updateItemByKey;
    listhelper.filterBy = filterBy;
    listhelper.sortBy = sortBy;
}());
