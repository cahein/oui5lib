sap.ui.define([
    "oui5lib/controller/FormController"
], function(Controller) {
    "use strict";

    var formController = Controller.extend("ooooo.controller.eeeee", {
        onInit: function () {
            this.getRouter().getRoute("rrrrr")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function(oEvent) {
        },

        submitForm: function() {
            const form = this.getView().byId("eeeeeForm");

            const model = form.getModel("eeeee");
            const eeeeeData = model.getData();
            
            const props = oui5lib.mapping.getEntityAttributeSpecs("eeeee");

            const errors = oui5lib.validation.validateData(eeeeeData, props);
            if (errors.length > 0) {
                // there are errors
                oui5lib.ui.handleValidationErrors(this.getView(), "eeeee", errors);
                return;
            }
            oui5lib.logger.info("record is valid");
        },
        
        handleUnsavedChanges: function(action, navto) {
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
            const form = this.getView().byId("eeeeeForm");
            this.resetFormValueStates(form);
        }
    });
    
    return formController;
});
