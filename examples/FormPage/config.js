if (typeof oum === "undefined") {
   var oum = {};
}
oum.config = {
   entryPoints: [
      {
         "title" : "{i18n>tiles.form.example}",
         "info" : "{i18n>tiles.form.example}",
         "tooltip" : "{i18n>form.example}",
         "icon" : "sap-icon://form",
         "routeName" : "formexample"
      },
      {
         "title" : "{i18n>tiles.help.title}",
         "info" : "{i18n>tiles.help.info}",
         "tooltip" : "{i18n>help.tooltip}",
         "icon" : "sap-icon://sys-help",
         "routeName" : "help"
      }
   ]
};
oum.namespace = function(string) {
   var object = this;
   var levels = string.split(".");
   for (var i = 0, l = levels.length; i < l; i++) {
      if (typeof object[levels[i]] === "undefined") {
         object[levels[i]] = {};
      }
      object = object[levels[i]];
   }
   return object;
};
