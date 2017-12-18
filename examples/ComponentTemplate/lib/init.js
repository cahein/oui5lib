if (typeof oum === "undefined") {
    var oum = {};
}
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

var xhr = new XMLHttpRequest();
xhr.open("GET", "config.json", false);
xhr.onload = function() {
    if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 0) {
            try {
                var configData = JSON.parse(xhr.responseText);
                oum.config = configData;
            } catch (e) {
                throw new Error("Not valid JSON");
            }
        }
    }
};
xhr.send();
