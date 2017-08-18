jQuery.sap.require("oui5lib.logger");

jQuery.sap.declare("oui5lib.messages");

/** @namespace oui5lib.messages */
(function () {
    function getMessageManager() {
        return sap.ui.getCore().getMessageManager();
    }
    function getMessageProcessor() {
        return new sap.ui.core.message.ControlMessageProcessor();
    }

    /**
     * Add message to the specified target.
     * @memberof oui5lib.messages
     * @param {string} msgType
     * @param {string} msgText
     * @param {string} target
     */
    function addMessage(msgType, msgText, target) {
        var messageManager  = getMessageManager();
        var messageProcessor = getMessageProcessor();
        var msg = new sap.ui.core.message.Message({
            message: msgText,
            target: target,
            type: msgType,
            processor: messageProcessor
        });
        messageManager.addMessages(msg);
    }
    
    /**
     * Add message of type Error to the specified target.
     * @memberof oui5lib.messages
     * @param {string} msgText
     * @param {string} target
     */
    function addErrorMessage(msgText, target) {
        addMessage("Error", msgText, target);
    }

    /**
     * Add message of type Warning to the specified target.
     * @memberof oui5lib.messages
     * @param {string} msgText
     * @param {string} target
     */
    function addWarnMessage(msgText, target) {
        addMessage("Warning", msgText, target);
    }

    /**
     * Remove messages for specified target.
     * @memberof oui5lib.messages
     */
    function removeMessages(target) {
        var messageManager  = getMessageManager();
        var data = messageManager.getMessageModel().getData();
        for (var i = 0, s = data.length; i < s; i++) {
            var msg = data[i];
            if (msg.target === target) {
                messageManager.removeMessages(msg);
            }
        }
    }

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

    var messages = oui5lib.namespace("messages");
    messages.addErrorMessage = addErrorMessage;
    messages.addWarnMessage = addWarnMessage;
    messages.removeMessages = removeMessages;

    messages.showNotification = showMessageToast;
    messages.showErrorMessage = showErrorMessageBox;
}());
