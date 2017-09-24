sap.ui.define([
    "oui5lib/controller/FormController"
], function(Controller) {
    "use strict";

    var exampleFormController = Controller.extend("oum.controller.formExample", {
        onInit: function () {
            var exampleData = {
                first_name: "",
                last_name: "",
                number: "",
                integer: null,
                email: "",
                phone: "",
                timestring: "",
                switchBoolParam: false,
                checkboxBoolParam: false,
                comboItem: null,
                multiComboItem: null,
                selectItem: null,
                dateTime: null,
                date: new Date(),
                time: null,
                textarea: ""
            };
            var exampleModel = oui5lib.util.getJsonModelForData(exampleData);
            var form = this.getView().byId("exampleForm");
            form.setModel(exampleModel, "exampleEntity");
            
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

        submitForm: function() {
            var form = this.getView().byId("exampleForm");
            var model = form.getModel("exampleEntity");
            var exampleData = model.getData();
            
            var props = oui5lib.mapping.getPropertyDefinitions("exampleEntity");
            var errors = oui5lib.validation.validateData(exampleData, props);
            if (errors.length > 0) {
                // there are errors
                oui5lib.ui.handleValidationErrors(this.getView(), "exampleEntity", errors);
                return;
            }
            oui5lib.logger.info("record is valid");
        },
        
        handleUnsavedChanges: function(action) {
            oui5lib.logger.debug("overwrite default function");
            oui5lib.logger.info("unsavedChanges: " + action);
        }
    });
    
    return exampleFormController;
});
