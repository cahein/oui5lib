sap.ui.jsview("oum.view.entry", {
   getControllerName : function() {
      return "oum.controller.entry";
   },
   
   createContent : function(oController) {
      var headerTitle = new sap.m.Title({
         text: "{i18n>view.entry.headerTitle}",
         level: "H2",
         titleStyle: "H2"
      });
      var headerBar = new sap.m.Bar({
         contentMiddle: [ headerTitle ],
         contentRight: [
            sap.ui.jsfragment("oui5lib.fragment.LanguageSwitcher"),
            sap.ui.jsfragment("oum.fragment.HelpButton")
         ]
      });

      var tileContainer = new sap.m.TileContainer();

      var entryPoints = oum.lib.configuration.getEntryPoints();
      if (entryPoints) {
         for (var i = 0; i < entryPoints.length; i++) {
            var tileDef = entryPoints[i];
            var tile = new sap.m.StandardTile({
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
         }
      }
      
      var entryPage = new sap.m.Page({
         customHeader: headerBar,
         content: [ tileContainer ],
         footer: sap.ui.xmlfragment("oum.fragment.Footer")
      });
      return entryPage;
   }
});
