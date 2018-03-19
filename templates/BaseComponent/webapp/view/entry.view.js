sap.ui.jsview("ooooo.view.entry", {
    getControllerName : function() {
        return "ooooo.controller.entry";
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
                sap.ui.jsfragment("ooooo.fragment.HelpButton")
            ]
        });

        const tiles = [];

        const entryPoints = ooooo.lib.configuration.getEntryPoints();
        if (entryPoints) {
            var tile;
            entryPoints.forEach(function(tileDef) {
                tile = new sap.m.GenericTile({
                    header: tileDef.header,
                    tooltip: tileDef.tooltip,
                    tileContent: new sap.m.TileContent({
                        content: new sap.m.ImageContent({
                            src: tileDef.icon,
                            description: tileDef.iconText
                        }),
                        footer: tileDef.footer
                    }),
                    press : function(oEvent) {
                        oController.routeTo(oEvent);
                    }
                });
                tile.data("routeName", tileDef.routeName);

                tile.addStyleClass("sapUiTinyMarginBegin");
                tile.addStyleClass("sapUiTinyMarginTop");
                tile.addStyleClass("tileLayout");

                tiles.push(tile);
            });
        }

        const landmarks = new sap.m.PageAccessibleLandmarkInfo({
            headerRole: "Region",
            headerLabel: "{i18n>view.entry.headerLabel}",
            contentRole: "Main",
            contentLabel: "{i18n>view.entry.contentLabel}"
        });
        const entryPage = new sap.m.Page({
            landmarkInfo: landmarks,
            customHeader: headerBar,
            content: [ tiles ],
            footer: sap.ui.xmlfragment("ooooo.fragment.AppInfoToolbar")
        });
        return entryPage;
    }
});
