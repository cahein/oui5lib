(function () {
    function Eeeee(id) {
        if (!(this instanceof ooooo.do.Eeeee)) {
            return new ooooo.do.Eeeee(id);
        }
        if (id === undefined || id === null) {
            this.setData(getNewEeeee());
            this.setNew(true);
        } else {
            this.id = id;
            if (ooooo.do.eeeeP.isItemLoaded(id)) {
                const eeeeeItem = ooooo.do.eeeeP.getItem(id);
                this.setData(eeeeeItem);
            } else {
                this.setLoading(true);
                ooooo.do.eeeeP.addItemDataChangedListener(dataAvailable, this);
                // load data and add them to the collection
            }
        }
    }

    function dataAvailable(id) {
        if (this.id === id) {
            ooooo.do.eeeeP.removeItemDataChangedListener(dataAvailable, this);
            this.setData(ooooo.do.eeeeP.getItem(id));
            this.setLoading(false);
        }
    }

    function getNewEeeee() {
        const newEeeee = {
        };
        return newEeeee;
    }
    
    Eeeee.prototype = Object.create(oui5lib.itemBase);
    ooooo.do.Eeeee = Eeeee;
}());
