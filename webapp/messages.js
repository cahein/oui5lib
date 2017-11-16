jQuery.sap.require("oui5lib.logger");
jQuery.sap.require("oui5lib.util");

jQuery.sap.declare("oui5lib.messages");

/** @namespace oui5lib.messages */
(function () {
    /**
     * Show notification message briefly without blocking the application.
     * @memberof oui5lib.messages
     * @function showNotification
     * @param {string} msg The message text.
     */
    function showMessageToast(msg, duration) {
        if (typeof duration !== "number") {
            duration = 3000;
        }
        jQuery.sap.require("sap.m.MessageToast");
        sap.m.MessageToast.show(msg, { duration: duration });
    }

    /**
     * Show error message.
     * @memberof oui5lib.messages
     * @function showErrorMessage
     * @param {string} msg The error message.
     * @param {function} handleClose Function to handle the closed event.
     */
    function showErrorMessageBox(msg, handleClose) {
        if (typeof handleClose !== "function") {
            handleClose = handleMessageBoxClosed;
        }
        var title = oui5lib.util.getI18nText("messagebox.error.title");

        jQuery.sap.require("sap.m.MessageBox");
        sap.m.MessageBox.error(msg, {
            title: title,
            onClose: handleClose
        });
    }

    /**
     * Default function to handle the onClose event of the sap.m.MessageBox.
     * @memberof oui5lib.messages
     * @inner 
     * @param {string} sResult
     */
    function handleMessageBoxClosed(sResult) {
        oui5lib.logger.info("ErrorMessage closed: " + sResult);
    }
    
    /**
     * Opens a MessageBox to require the user to confirm unsaved changes.
     * @memberof oui5lib.ui
     * @param {function} handleClose The function to call upon user action.
     */
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

    /**
     * Opens a MessageBox to require the user to confirm deleting an entity.
     * @memberof oui5lib.ui
     * @param {string} msg The message to show.
     * @param {function} handleClose  The function to call upon user action.
     */
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

    var messages = oui5lib.namespace("messages");
    messages.showNotification = showMessageToast;
    messages.showErrorMessage = showErrorMessageBox;
    messages.confirmUnsavedChanges = confirmUnsavedChanges;
    messages.confirmDelete = confirmDelete;
}());
