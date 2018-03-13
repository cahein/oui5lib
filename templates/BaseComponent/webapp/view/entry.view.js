sap.ui.jsview("oum.view.entry", {
    getControllerName : function() {
        return "oum.controller.entry";
    },
    
    createContent : function(oController) {
        const headerTitle = new sap.m.Title({
            text: "{i18n>view.entry.headerTitle}",
            level: "H2",
            titleStyle: "H2"
        });
        const headerBar = new sap.m.Bar({
            contentMiddle: [ headerTitle ],
            contentRight: [
                sap.ui.jsfragment("oui5lib.fragment.LanguageSwitcher"),
                sap.ui.jsfragment("oum.fragment.HelpButton")
            ]
        });

        const tileContainer = new sap.m.TileContainer();

        const entryPoints = oum.lib.configuration.getEntryPoints();
        if (entryPoints) {
            var tile;
            entryPoints.forEach(function(tileDef) {
                tile = new sap.m.StandardTile({
                    icon : tileDef.icon,
                    title : tileDef.title,
                    tooltip: tileDef.tooltip,
                    info : tileDef.info,
                    press : function(oEvent) {
                        oController.routeTo(oEvent);
                    }
                });
                tile.data("routeName", tileDef.routeName);

                tileContainer.addTile(tile);
            });
        }
        
        const entryPage = new sap.m.Page({
            customHeader: headerBar,
            content: [ tileContainer ],
            footer: sap.ui.xmlfragment("oum.fragment.AppInfoToolbar")
        });
        return entryPage;
    }
});
