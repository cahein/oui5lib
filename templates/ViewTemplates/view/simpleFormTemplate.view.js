sap.ui.jsview("ooooo.view.eeeee", {
    getControllerName : function() {
        return "ooooo.controller.eeeee";
    },
    createContent : function(oController) {
        const eeeeeForm = new sap.ui.layout.form.SimpleForm(this.createId("eeeeeForm"), {
            title: "{i18n>eeeee.form.title}",
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

        
        // form controls
        
        const headerTitle = new sap.m.Text({
            text: "{i18n>eeeee.page.title}"
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
            content: [ messages, eeeeeForm ],
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
