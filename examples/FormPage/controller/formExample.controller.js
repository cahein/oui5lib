sap.ui.define([
    "oui5lib/controller/FormController"
], function(Controller) {
    "use strict";

    var exampleFormController = Controller.extend("oum.controller.formExample", {
        onInit: function () {
            this.getRouter().getRoute("formexample")
                .attachPatternMatched(this._onRouteMatched, this);
            this.getRouter().getRoute("simpleformexample")
                .attachPatternMatched(this._onRouteMatched, this);
            
            const exampleData = {
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
            const exampleModel = oui5lib.util.getJsonModelForData(exampleData);
            const form = this.getView().byId("exampleForm");
            form.setModel(exampleModel, "exampleEntity");
            
            const exampleList = [
                { key: 0, text: "c by" },
                { key: 1, text: "b me" },
                { key: 2, text: "d name" },
                { key: 3, text: "a Sort" }
            ];
            const listModel = oui5lib.util.getJsonModelForData(exampleList);
            const comboBox = this.getView().byId("exampleEntity_comboItem");
            comboBox.setModel(listModel, "items");

            const multiComboBox = this.getView().byId("exampleEntity_multiComboItem");
            multiComboBox.setModel(listModel, "items");

            const select = this.getView().byId("exampleEntity_selectItem");
            select.setModel(listModel, "items");
        },

        _onRouteMatched: function(oEvent) {
            this.resetValueStates();
        },

        submitForm: function() {
            const form = this.getView().byId("exampleForm");
            const model = form.getModel("exampleEntity");
            const exampleData = model.getData();
            
            const props = oui5lib.mapping.getEntityAttributeSpecs("exampleEntity");
            const errors = oui5lib.validation.validateData(exampleData, props);
            if (errors.length > 0) {
                // there are errors
                oui5lib.ui.handleValidationErrors(this.getView(), "exampleEntity", errors);
                return;
            }
            oui5lib.logger.info("record is valid");
        },
        
        handleUnsavedChanges: function(action, navto) {
            oui5lib.logger.debug("overwrite default function");
            oui5lib.logger.info("reset unsaved changes: " + action);
            if (action === "OK") {
                this.resetRecordChanged();

                switch(navto) {
                case "home":
                    this.getRouter().vNavTo("home");
                    break;
                case "back":
                    this.getRouter().navBack();
                    break;
                }
            }
        },

        resetValueStates: function() {
            const form = this.getView().byId("exampleForm");
            if (typeof form.getContent === "function") {
                const content = form.getContent();
                content.forEach(function(control) {
                    if (typeof control.setValueState === "function") {
                        control.setValueState("None");
                    }
                });
            } else if (typeof form.getFormContainers === "function") {
                const formContainers = form.getFormContainers();
                formContainers.forEach(function(formContainer) {
                    const formElements = formContainer.getFormElements();
                    formElements.forEach(function(formElement) {
                        const formFields = formElement.getFields();
                        formFields.forEach(function(formField) {
                            if (typeof formField.setValueState === "function") {
                                formField.setValueState("None");
                            }
                        });
                    });
                });
            } 
        }
    });
    
    return exampleFormController;
});
