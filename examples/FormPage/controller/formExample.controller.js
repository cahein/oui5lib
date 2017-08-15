sap.ui.define([
    "oui5lib/controller/FormController"
], function(Controller) {
    "use strict";

    var exampleFormController = Controller.extend("oum.controller.formExample", {
        onInit: function () {
            var exampleList = [
                { key: 0, text: "c by" },
                { key: 1, text: "b me" },
                { key: 2, text: "d name" },
                { key: 3, text: "a Sort" }
            ];
            var listModel = oui5lib.util.getJsonModelForData(exampleList);
            var comboBox = this.getView().byId("exampleEntity_comboItem");
            comboBox.setModel(listModel, "items");

            var multiComboBox = this.getView().byId("exampleEntity_multiComboItem");
            multiComboBox.setModel(listModel, "items");

            var select = this.getView().byId("exampleEntity_selectItem");
            select.setModel(listModel, "items");
        },

        handleUnsavedChanges: function(action) {
            oui5lib.logger.debug("overwrite default function");
            oui5lib.logger.info("unsavedChanges: " + action);
        }
    });
    
    return exampleFormController;
});
