jQuery.sap.require("oui5lib.util");
jQuery.sap.require("oui5lib.messages");
jQuery.sap.require("oui5lib.logger");

jQuery.sap.declare("oui5lib.ui");

/** @namespace oui5lib.ui */
(function() {
    /**
     * Handles validation errors. Use with FormController.
     * @memberof oui5lib.ui
     * @param {sap.ui.core.mvc.JSView} view The view with the form.
     * @param {string} modelName The name of the model set to the form.
     * @param {array} errors List of error objects returned from the {@link oui5lib.validation.validateData} function.
     * @param {boolean} openMessageBox Show error messages in a MessageBox? Defaults to 'false'.
     */
    function handleValidationErrors(view, modelName, errors, openMessageBox) {
        if (typeof openMessageBox !== "boolean") {
            openMessageBox = false;
        }
        var msgs = [];
        for (var i = 0, s = errors.length; i < s; i++) {
            var error = errors[i].split(":");
            oui5lib.logger.debug( "error: " + error[0] + " : " + error[1]);
            var fnme = error[1];
            var control = view.byId(modelName + "_" + fnme);
            setControlValueState(control, fnme, false);

            msgs.push("Invalid: " + error[0] + " " + error[1]);                
        }
        if (openMessageBox) {
            showValidationErrors(msgs);
        }
    }
    
    /**
     * Show input validation errors. Will open a MessageBox.
     * @memberof oui5lib.ui
     * @inner 
     * @param {array} msgs Error messages to be shown in the box.
     */
    function showValidationErrors(msgs) {
        var msgText = oui5lib.util.getI18nText("validation.fix-errors");
        for (var i = 0, s = msgs.length; i < s; i++) {
            msgText += msgs[i] + "\n";
        }
        oui5lib.messages.showErrorMessage(msgText);
    }

    /**
     * Set or remove the error value state of a control. In case of an Error, the message shown will be the property 'valueStateText'.
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
        }
        if (typeof control.setValueState === "function") {
            if (isValid) {
                control.setValueState(sap.ui.core.ValueState.None);
//                control.closeValueStateMessage();
            } else {
                control.setValueState(sap.ui.core.ValueState.Error);
//                control.openValueStateMessage();
            }
        }
    }
    
    /**
     * Remove MessageManager messages for a particular target.
     * @memberof oui5lib.ui
     * @inner 
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
     * @memberof oui5lib.ui
     * @param {sap.m.ComboBox} comboBox The ComboBox to check.
     */
    function checkComboBox(comboBox) {
        var vlue = comboBox.getValue();
        var selectedItem = comboBox.getSelectedItem();
        if (selectedItem === null) {
            if (!oui5lib.validation.isBlank(vlue)) {
                comboBox.setValueState("Warning");
                var valueStateText = oui5lib.util.getI18nText("common.combobox.noItemSelected");
                comboBox.setValueStateText(valueStateText);
                return;
            }
        }
        comboBox.setValueState("None");
        var target = comboBox.sId + "/value";
        oui5lib.messages.removeMessages(target);
    }

    /**
     * Use to check if a DatePicker value is a valid date.
     * If not, a warning message will be shown.
     * @memberof oui5lib.ui
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

    /**
     * Use to unset any selected item and remove all items from a ComboBox.
     * @memberof oui5lib.ui
     * @param {sap.m.ComboBox} comboBox The ComboBox to clear.
     */
    function clearComboBox(comboBox) {
        comboBox.setSelectedItem(null);
        comboBox.removeAllItems();
    }
    
    var ui = oui5lib.namespace("ui");
    ui.handleValidationErrors = handleValidationErrors;
    ui.setControlValueState = setControlValueState;

    ui.clearComboBox = clearComboBox;

    ui.checkComboBox = checkComboBox;
    ui.checkDatePicker = checkDatePicker;
}());
