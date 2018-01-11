/** @namespace oui5lib.ui */
(function(logger, util, messages) {
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
        let msgs = [];
        for (let i = 0, s = errors.length; i < s; i++) {
            let error = errors[i].split(":");
            logger.debug( "error: " + error[0] + " : " + error[1]);
            let fnme = error[1];
            let control = view.byId(modelName + "_" + fnme);
            setControlValueState(control, false);

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
        let msgText = util.getI18nText("validation.fix-errors");
        for (let i = 0, s = msgs.length; i < s; i++) {
            msgText += msgs[i] + "\n";
        }
        messages.showErrorMessage(msgText);
    }

    /**
     * Set or remove the error value state of a control.
     * @param {object} control  A sapui control.
     * @param {boolean} isValid Is the value valid (true), or not (false).
     */
    function setControlValueState(control, isValid) {
        if (typeof control === "undefined") {
            return;
        }
        
        if (typeof control.setValueState === "function") {
            if (isValid) {
                control.setValueState("None");
            } else {
                control.setValueState("Error");
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
        let vlue = comboBox.getValue();
        let selectedItem = comboBox.getSelectedItem();
        if (selectedItem === null) {
            if (!util.isBlank(vlue)) {
                comboBox.setValueState("Warning");
                let valueStateText = util.getI18nText("common.combobox.noItemSelected");
                comboBox.setValueStateText(valueStateText);
                return;
            }
        }
        comboBox.setValueState("None");
    }

    /**
     * Use to check if a DatePicker value is a valid date.
     * If not, a warning message will be shown.
     * @memberof oui5lib.ui
     * @param {sap.m.DatePicker} datePicker The DatePicker to check.
     */
    function checkDatePicker(datePicker) {
        let value = datePicker.getValue();
        if (value === null) {
            return false;
        }
        let dateValue = datePicker.getDateValue();
        let oDate = new Date(value);
        if (oDate == "Invalid Date" ||
            !(oDate.getFullYear() === dateValue.getFullYear() &&
              oDate.getMonth() === dateValue.getMonth() &&
              oDate.getDate() === dateValue.getDate())) {
            datePicker.setValueState("Warning");
            return false;
        } else {
            datePicker.setValueState("None");
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
    
    let ui = oui5lib.namespace("ui");
    ui.handleValidationErrors = handleValidationErrors;
    ui.setControlValueState = setControlValueState;

    ui.clearComboBox = clearComboBox;

    ui.checkComboBox = checkComboBox;
    ui.checkDatePicker = checkDatePicker;
}(oui5lib.logger, oui5lib.util, oui5lib.messages));
