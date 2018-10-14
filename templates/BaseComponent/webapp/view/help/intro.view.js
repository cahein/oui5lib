sap.ui.jsview("ooooo.view.help.intro", {
    getControllerName : function() {
        return "ooooo.controller.help.intro";
    },
    
    createContent: function(oController) {
        const pageTitle = new sap.m.Title({
            text: "{i18n>view.help.intro.title}",
            level: "H2",
            titleStyle: "H2"
        });
        const page = new sap.m.Page({
            customHeader: new sap.m.Bar({
                contentLeft: [
                    sap.ui.jsfragment("oui5lib.fragment.BackButton")
                ],
                contentMiddle: pageTitle,
                contentRight: [
                    sap.ui.jsfragment("oui5lib.fragment.HomeButton")
                ]
            }),
            content : [  ]
        });
        return page;
    }
});
