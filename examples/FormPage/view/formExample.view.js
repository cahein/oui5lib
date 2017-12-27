sap.ui.jsview("oum.view.formExample", {
    getControllerName : function() {
        return "oum.controller.formExample";
    },
    createContent : function(oController) {
        var formContainer = new sap.ui.layout.form.FormContainer({
            formElements: []
        });

        var exampleForm = new sap.ui.layout.form.Form(this.createId("exampleForm"), {
            title: "{i18n>some.form.title}",
            layout: [
                new sap.ui.layout.form.ResponsiveGridLayout()
            ],
            editable: true,
            formContainers: [ formContainer ]
        });
        
        oController.addInput(formContainer, "exampleEntity", "first_name");
        oController.addInputToLastFormElement(formContainer, "exampleEntity", "last_name");
        
        oController.addInput(formContainer, "exampleEntity", "number");
        oController.addInput(formContainer, "exampleEntity", "integer");
        oController.addInput(formContainer, "exampleEntity", "email");
        oController.addInput(formContainer, "exampleEntity", "phone");
        oController.addMaskInput(formContainer, "exampleEntity", "timestring");
        oController.addSwitch(formContainer, "exampleEntity", "switchBoolParam");
        oController.addCheckBox(formContainer, "exampleEntity", "checkboxBoolParam");
        oController.addComboBox(formContainer, "exampleEntity", "comboItem");
        oController.addMultiComboBox(formContainer, "exampleEntity", "multiComboItem");
        oController.addSelect(formContainer, "exampleEntity", "selectItem");
        oController.addDateTimePicker(formContainer, "exampleEntity", "dateTime");
        oController.addDatePicker(formContainer, "exampleEntity", "date");
        oController.addTimePicker(formContainer, "exampleEntity", "time");
        oController.addTextArea(formContainer, "exampleEntity", "textarea");
        
        var headerTitle = new sap.m.Text({
            text: "Form Example"
        });

        var messages = new sap.ui.layout.VerticalLayout(this.createId("messagesContainer"));

        return new sap.m.Page({
            customHeader: new sap.m.Bar({
                contentLeft: [
                    sap.ui.jsfragment("oui5lib.fragment.BackButton", oController)
                ],
                contentMiddle: [ headerTitle ],
                contentRight: [
                    sap.ui.jsfragment("oui5lib.fragment.HomeButton", oController)
                ]
            }),
	    content: [ messages, exampleForm ]
        });
    }
});
