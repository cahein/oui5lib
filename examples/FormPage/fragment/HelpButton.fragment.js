sap.ui.jsfragment("oum.fragment.HelpButton", {
   createContent: function () {
      var btn = new sap.m.Button({
         icon : "sap-icon://sys-help",
         tooltip : "{i18n>help.tooltip}",
         press: function() {
            var router = oui5lib.util.getComponentRouter();
            router.vNavTo("help");
         }
      });
      return btn;
   }
});
