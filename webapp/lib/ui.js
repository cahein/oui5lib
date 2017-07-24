jQuery.sap.require("oui5lib.util");
jQuery.sap.require("oui5lib.logger");

jQuery.sap.declare("oui5lib.ui");

(function() {
    function showMessageToast(msg) {
        jQuery.sap.require("sap.m.MessageToast");
        sap.m.MessageToast.show(msg);
    }

    function showErrorMessageBox(msg, handleClose) {
        if (typeof handleClose !== "function") {
            handleClose = handleErrorMessageBoxClosed;
        }
        
        jQuery.sap.require("sap.m.MessageBox");
        sap.m.MessageBox.error(msg, {
            title: "{i18n>messagebox.error}",
            onClose: handleClose
        });
    }
    function handleErrorMessageBoxClosed(sResult) {
        oui5lib.logger.info("ErrorMessage closed: " + sResult);
    }
    
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

    var ui = oui5lib.namespace("ui");
    ui.showNotification = showMessageToast;
    ui.showErrorMessage = showErrorMessageBox;
    ui.confirmUnsavedChanges = confirmUnsavedChanges;
    ui.confirmDelete = confirmDelete;
}());
