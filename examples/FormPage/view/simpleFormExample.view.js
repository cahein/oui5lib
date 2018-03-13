sap.ui.jsview("oum.view.simpleFormExample", {
    getControllerName : function() {
        return "oum.controller.formExample";
    },
    createContent : function(oController) {
        const exampleForm = new sap.ui.layout.form.SimpleForm(this.createId("exampleForm"), {
            title: "{i18n>some.form.title}",
            editable: true,
            layout: "ResponsiveGridLayout",
            singleContainerFullSize: false,
            adjustLabelSpan: true,
            labelSpanS: 12,
            labelSpanM: 2,
            labelSpanL: 4,
            labelSpanXL: -1,
            emptySpanS: 0,
            emptySpanM: 0,
            emptySpanL: 1,
            emptySpanXL: -1,
            columnsL: 1,
            columnsM: 1,
            columnsXL: -1
        });

        oController.addInput(exampleForm, "exampleEntity", "first_name");
        oController.addInput(exampleForm, "exampleEntity", "last_name", false);
        oController.addInput(exampleForm, "exampleEntity", "number");
        oController.addInput(exampleForm, "exampleEntity", "integer");
        oController.addInput(exampleForm, "exampleEntity", "email");
        oController.addInput(exampleForm, "exampleEntity", "phone");
        oController.addMaskInput(exampleForm, "exampleEntity", "timestring");
        oController.addSwitch(exampleForm, "exampleEntity", "switchBoolParam");
        oController.addCheckBox(exampleForm, "exampleEntity", "checkboxBoolParam");
        oController.addComboBox(exampleForm, "exampleEntity", "comboItem");
        oController.addMultiComboBox(exampleForm, "exampleEntity", "multiComboItem");
        oController.addSelect(exampleForm, "exampleEntity", "selectItem");
        oController.addDateTimePicker(exampleForm, "exampleEntity", "dateTime");
        oController.addDatePicker(exampleForm, "exampleEntity", "date");
        oController.addTimePicker(exampleForm, "exampleEntity", "time");
        oController.addTextArea(exampleForm, "exampleEntity", "textarea");
        
        const headerTitle = new sap.m.Text({
            text: "SimpleForm Example"
        });

        const messages = new sap.ui.layout.VerticalLayout(this.createId("messagesContainer"));

        return new sap.m.Page({
            customHeader: new sap.m.Bar({
                contentLeft: [
                    sap.ui.jsfragment("oui5lib.fragment.BackButton", oController),
                ],
                contentMiddle: [ headerTitle ],
                contentRight: [
                    sap.ui.jsfragment("oui5lib.fragment.HomeButton", oController)
                ]
            }),
            content: [ messages, exampleForm ],
            footer: new sap.m.Bar({
                contentLeft : [
                    new sap.m.Button({
                        icon: "sap-icon://save",
                        press: function(){
                            oController.submitForm();
                        }
                    })
                ],
                contentMiddle : [ ],
                contentRight : [ ]
            })                  
        });
    }
});
