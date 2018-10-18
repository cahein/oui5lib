sap.ui.jsview("oum.view.help.index", {
   createContent: function(oController) {
      const page = new sap.m.Page({
         title: "{i18n>view.help.index.title}"
      });
      return page;
   }
});
