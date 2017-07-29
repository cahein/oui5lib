jQuery.sap.require("oui5lib.util");
jQuery.sap.require("oui5lib.messages");
jQuery.sap.require("oui5lib.logger");

jQuery.sap.declare("oui5lib.ui");

(function() {
    function confirmUnsavedChanges(handleClose) {
        if (typeof handleClose !== "function") {
            throw TypeError("need a function to handle the onClose event");
        }
        jQuery.sap.require("sap.m.MessageBox");
        sap.m.MessageBox.confirm(oui5lib.util.getI18nText("unsavedChanges.text"), {
            initialFocus: "CANCEL",
            onClose: handleClose
        });
    }

    function confirmDelete(msg, handleClose) {
        if (typeof handleClose !== "function") {
            throw TypeError("need a function to handle the onClose event");
        }
        jQuery.sap.require("sap.m.MessageBox");
        sap.m.MessageBox.show(msg, {
            icon: "WARNING",
            title: oui5lib.util.getI18nText("confirmDelete.title"),
            actions: [ "DELETE", "CANCEL" ],
            initialFocus: "CANCEL",
            onClose: handleClose
        });
    }
    
    /**
     * Handles validation errors. Use with FormController.
     * @param {sap.ui.core.mvc.JSView} view The view with the form.
     * @param {string} modelName The name of the model set to the form.
     * @param {array} errors List of error objects returned from the oui5lib.validation.validateData function.
     */
    function handleValidationErrors(view, modelName, errors) {
        var msgs = [];
        for (var i = 0, s = errors.length; i < s; i++) {
            var error = errors[i].split(":");
            oui5lib.logger.debug( "error: " + error[0] + " : " + error[1]);
            var fnme = error[1];
            var control = view.byId(modelName + "_" + fnme);
            setControlValueState(control, fnme, false);

            msgs.push("Invalid: " + error[0] + " " + error[1]);                
        }
        this.showValidationErrors(msgs);
    }
    
    /**
     * Set or remove the error value state of a control and show related message.
     * @param {object} control  A sapui control.
     * @param {string} propertyName The name of the property. It is used for the message to the user.
     * @param {boolean} isValid Is the value valid (true), or not (false).
     */
    function setControlValueState(control, propertyName, isValid) {
        if (typeof control === "undefined") {
            return;
        }
        
        var target = control.sId + "/value";
        if (isValid) {
            removeMessages(target);
        } else {
            if (typeof control.setValueState === "function") {
                control.setValueState(sap.ui.core.ValueState.Error);
                oui5lib.messages.addErrorMessage(
                    oui5lib.util.getI18nText("validation." + propertyName + ".invalid"),
                    target);
            }
        }
    }
    
    /**
     * Remove MessageManager messages for a particular target.
     * @param {string} target Specify the target.
     */
    function removeMessages(target) {
        var oMessageManager  = sap.ui.getCore().getMessageManager();
        var data = oMessageManager.getMessageModel().getData();
        for (var i = 0, s = data.length; i < s; i++) {
            var msg = data[i];
            if (msg.target === target) {
                oMessageManager.removeMessages(msg);
            }
        }
    }
    
    /**
     * Use to check if a ComboBox value and the selected item text are equal.
     * If not, a warning message will be shown.
     * @param {sap.m.ComboBox} comboBox The ComboBox to check.
     */
    function checkComboBox(comboBox) {
        var vlue = comboBox.getValue();
        var target = comboBox.sId + "/value";

        var selectedItem = comboBox.getSelectedItem();
        if (selectedItem === null) {
            if (!oui5lib.validation.isBlank(vlue)) {
                this.addWarnMessage(oui5lib.util.getI18nText("common.combobox.noItemSelected"), target);
                comboBox.setValueState(sap.ui.core.ValueState.Warning);
                return;
            }
        } else {
            var text = selectedItem.getText();
            if (text !== vlue) {
                this.addWarnMessage(oui5lib.util.getI18nText("common.combobox.otherItemSelected"), target);
                comboBox.setValueState(sap.ui.core.ValueState.Warning);
                return;
            }
        }
        oui5lib.messages.removeMessages(target);
        comboBox.setValueState(sap.ui.core.ValueState.None);
    }

    /**
     * Use to check if a DatePicker value is a valid date.
     * If not, a warning message will be shown.
     * @param {sap.m.DatePicker} datePicker The DatePicker to check.
     */
    function checkDatePicker(datePicker) {
        var value = datePicker.getValue();
        if (value === null) {
            return false;
        }
        oui5lib.logger.debug( "date field value: " + value);

        var target = datePicker.sId + "/value";
        var oDate = new Date(value);
        if (oDate == "Invalid Date") {
            datePicker.setValueState(sap.ui.core.ValueState.Warning);
            oui5lib.messages.addWarnMessage(
                oui5lib.util.getI18nText("common.date.invalid"), target);
            return false;
        } else {
            datePicker.setValueState(sap.ui.core.ValueState.None);
            oui5lib.messages.removeMessages(target);
        }
        return true;
    }

    var ui = oui5lib.namespace("ui");
    ui.confirmUnsavedChanges = confirmUnsavedChanges;
    ui.setControlValueState = setControlValueState;
    ui.confirmDelete = confirmDelete;
    ui.handleValidationErrors = handleValidationErrors;

    ui.checkComboBox = checkComboBox;
    ui.checkDatePicker = checkDatePicker;
}());
