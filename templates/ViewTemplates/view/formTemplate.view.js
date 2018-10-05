sap.ui.jsview("ooooo.view.eeeee", {
    getControllerName : function() {
        return "ooooo.controller.eeeee";
    },
    createContent : function(oController) {
        const formContainer = new sap.ui.layout.form.FormContainer({
            formElements: []
        });

        const eeeeeForm = new sap.ui.layout.form.Form(this.createId("eeeeeForm"), {
            title: "{i18n>eeeee.form.title}",
            layout: [
                new sap.ui.layout.form.ResponsiveGridLayout()
            ],
            editable: true,
            formContainers: [ formContainer ]
        });
        
        // form controls

        const headerTitle = new sap.m.Text({
            text: "{i18n>eeeee.page.title}"
        });

        const messages = new sap.ui.layout.VerticalLayout(this.createId("messagesContainer"));

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
