module.exports = function (grunt) {
    "use strict";
    
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        dirs: grunt.file.readJSON("GruntRef.json"),

        jasmine: {
            src: [
                "<%= dirs.oui5lib %>/mapping.js",
                "<%= dirs.oui5lib %>/listBase.js",
                "<%= dirs.oui5lib %>/itemBase.js",
                "<%= dirs.domainObjects %>/*.js"
            ],
           options: {
               "--web-security" : false,
               "--local-to-remote-url-access" : true,
               "--ignore-ssl-errors" : true,
                outfile: "specrunner.html",
                vendor: [
                    "<%= dirs.test %>/helper/jquery.js",
                    "<%= dirs.oui5lib %>/init.js",
                    "<%= dirs.oui5lib %>/lib/listHelper.js",
                    "<%= dirs.oui5lib %>/configuration.js",
                    "<%= dirs.oui5lib %>/logger.js",
                    "<%= dirs.oui5lib %>/formatter.js",
                    "<%= dirs.oui5lib %>/util.js",
                    "<%= dirs.oui5lib %>/request.js",
                    "<%= dirs.test %>/helper/setupGrunt.js"
                ],
                specs: [
                    "<%= dirs.spec %>/orders.js",
                    "<%= dirs.spec %>/Order.js",
                    "<%= dirs.spec %>/addresses.js",
                    "<%= dirs.spec %>/Address.js",
                    "<%= dirs.spec %>/products.js",
                    "<%= dirs.spec %>/Product.js"
                ]
            }
        }
    });
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.registerTask("test", ["jasmine"]);

};
