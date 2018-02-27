var oui5lib = {};
oui5lib.namespace = function(string) {
    let object = this;
    const levels = string.split(".");
    for (let i = 0, l = levels.length; i < l; i++) {
        if (typeof object[levels[i]] === "undefined") {
            object[levels[i]] = {};
        }
        object = object[levels[i]];
    }
    return object;
};

const xhr = new XMLHttpRequest();
xhr.open("GET", "oui5lib.json", false);
xhr.onload = function() {
    if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 0) {
            try {
                const configData = JSON.parse(xhr.responseText);
                oui5lib.config = configData;
            } catch (e) {
                throw new Error("Not valid JSON");
            }
        }
    }
};
xhr.send();

