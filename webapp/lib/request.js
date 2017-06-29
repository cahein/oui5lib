(function () {
    function loadFileSync(fileName) {
        var data = null;
        
        var xhr = new XMLHttpRequest();
        xhr.open("GET", fileName, false);
        xhr.addEventListener("load", function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    data = JSON.parse(xhr.responseText);
                } catch (e) {
                    throw new Error("oui5lib.json is not valid JSON");
                }
            }
        });
        xhr.send();
        
        return data;
    }
   
   var request = oui5lib.namespace("request");
   request.loadFile = loadFileSync;
}());
