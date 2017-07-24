(function () {
    function getMessageManager() {
        return sap.ui.getCore().getMessageManager();
    }
    
    function getMessageProcessor() {
        return new sap.ui.core.message.ControlMessageProcessor();
    }

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
    
    function addErrorMessage(msgText, target) {
        addMessage("Error", msgText, target);
    }

    function addWarnMessage(msgText, target) {
        addMessage("Warning", msgText, target);
    }

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

    var messages = oui5lib.namespace("messages");
    messages.addErrorMessage = addErrorMessage;
    messages.addWarnMessage = addWarnMessage;
    messages.removeMessages = removeMessages;
}());
