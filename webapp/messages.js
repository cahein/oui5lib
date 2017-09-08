jQuery.sap.require("oui5lib.logger");

jQuery.sap.declare("oui5lib.messages");

/** @namespace oui5lib.messages */
(function () {
    /**
     * Get MessageManager from the UI5 Core.
     * @memberof oui5lib.messages
     * @inner 
     * @returns {sap.ui.core.message.MessageManager} The active MessageManager instance.
     */
    function getMessageManager() {
        return sap.ui.getCore().getMessageManager();
    }

    /**
     * Get MessageProcessor.
     * @memberof oui5lib.messages
     * @inner 
     * @returns {sap.ui.core.message.ControlMessageProcessor} The ControlMessageProcessor implementation.
     */
    function getMessageProcessor() {
        return new sap.ui.core.message.ControlMessageProcessor();
    }

    /**
     * Add message to the specified target.
     * @memberof oui5lib.messages
     * @inner 
     * @param {string} msgType The message type ('Error', 'Warning').
     * @param {string} msgText The message text.
     * @param {string} target The message target.
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
     * @param {string} msgText The message text.
     * @param {string} target The message target.
     */
    function addErrorMessage(msgText, target) {
        addMessage("Error", msgText, target);
    }

    /**
     * Add message of type Warning to the specified target.
     * @memberof oui5lib.messages
     * @param {string} msgText The message text.
     * @param {string} target The message target.
     */
    function addWarnMessage(msgText, target) {
        addMessage("Warning", msgText, target);
    }

    /**
     * Remove messages for specified target.
     * @memberof oui5lib.messages
     * @param {string} target The message target.
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

    /**
     * Show notification message briefly without blocking the application.
     * @memberof oui5lib.messages
     * @function showNotification
     * @param {string} msg The message text.
     */
    function showMessageToast(msg) {
        jQuery.sap.require("sap.m.MessageToast");
        sap.m.MessageToast.show(msg);
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
        
        jQuery.sap.require("sap.m.MessageBox");
        sap.m.MessageBox.error(msg, {
            title: "{i18n>messagebox.error}",
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

    var messages = oui5lib.namespace("messages");
    messages.addErrorMessage = addErrorMessage;
    messages.addWarnMessage = addWarnMessage;
    messages.removeMessages = removeMessages;

    messages.showNotification = showMessageToast;
    messages.showErrorMessage = showErrorMessageBox;
}());
