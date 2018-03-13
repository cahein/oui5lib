sap.ui.jsview("oum.view.help.intro", {
    getControllerName : function() {
        return "oum.controller.help.intro";
    },
    
    createContent: function(oController) {
        var pageTitle = new sap.m.Title({
            text: "{i18n>view.help.intro.title}",
            level: "H2",
            titleStyle: "H2"
        });
        var page = new sap.m.Page({
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
