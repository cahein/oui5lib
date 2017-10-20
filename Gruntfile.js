module.exports = function (grunt) {
    "use strict";
    
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        dirs: grunt.file.readJSON("GruntRef.json"),
        
        availabletasks: {
            tasks: {
                options: {
                    groups: {
                        "Code quality": ["lint", "gendoc", "test"],
                        "Examples": ["prepare-examples"],
                        "Default": ["availabletasks"]
                    },
                    descriptions: {
                        "lint":
                        "Run eslint to detect errors and potential problems in our JavaScript code.",
                        "gendoc":
                        "Generates html documentation.",
                        "test":
                        "Run Tests.",
                        "prepare-examples":
                        "Copy oui5lib for examples",
                        "availabletasks":
                        "List available tasks."
                    },
                    hideUngrouped: true
                }
            }
        },
        eslint: {
            options: {
                configFile: ".eslintrc.json"
            },
            target: [
                "<%= dirs.webroot %>/*.js",
                "<%= dirs.lib %>/*.js",
                "<%= dirs.view %>/**/*.js",
                "<%= dirs.controller %>/**/*.js",
                "<%= dirs.fragment %>/**/*.js"
            ]
        },
        jasmine: {
            src: [
                "<%= dirs.spec %>/helpers/setup.js",
                "<%= dirs.lib %>/listHelper.js",
                "<%= dirs.webroot %>/request.js",
                "<%= dirs.webroot %>/configuration.js",
                "<%= dirs.webroot %>/logger.js",
                "<%= dirs.webroot %>/util.js",
                "<%= dirs.webroot %>/listBase.js",
                "<%= dirs.webroot %>/itemBase.js",
                "<%= dirs.webroot %>/mapping.js",
                "<%= dirs.webroot %>/validation.js",
                "<%= dirs.webroot %>/formatter.js"
            ],
            options: {
                outfile: "specrunner.html",
                vendor: [
                    "<%= dirs.ui5resources %>/sap-ui-core.js"
                ],
                specs: [
                    "<%= dirs.spec %>/*.js"
                ]
            }
        },
        clean: {
            doc: {
                src: [
                    "doc"
                ]
            },
            examples: {
                src: [
                    "<%= dirs.examples %>/DomainObjects/oui5lib",
                    "<%= dirs.examples %>/ComponentTemplate/oui5lib",
                    "<%= dirs.examples %>/FormPage/oui5lib"
                ]
            }
        },
        jsdoc: {
            dist: {
                src: [
                    "<%= dirs.webroot %>/*.js",
                    "<%= dirs.lib %>/*.js",
                    "<%= dirs.controller %>/**/*.js",
                    "<%= dirs.fragment %>/**/*.js"
                ],
                dest: "doc"
            }
        },
        copy: {
            oui5lib: {
                files: [
                    {
                        expand: true,
                        cwd: "<%= dirs.webroot %>",
                        src: [
                            "init.js",
                            "request.js",
                            "configuration.js",
                            "logger.js",
                            "util.js",
                            "mapping.js",
                            "lib/listHelper.js",
                            "listBase.js",
                            "itemBase.js"
                        ],
                        dest: "<%= dirs.examples %>/DomainObjects/oui5lib/"
                    },
                    {
                        expand: true,
                        cwd: "<%= dirs.webroot %>",
                        src: "*.js",
                        dest: "<%= dirs.examples %>/ComponentTemplate/oui5lib/"
                    },
                    {
                        expand: true,
                        cwd: "<%= dirs.webroot %>/lib",
                        src: "*.js",
                        dest: "<%= dirs.examples %>/ComponentTemplate/oui5lib/lib/"
                    },
                    {
                        expand: true,
                        cwd: "<%= dirs.i18n %>",
                        src: "*.properties",
                        dest: "<%= dirs.examples %>/ComponentTemplate/oui5lib/i18n/"
                    },
                    {
                        expand: true,
                        cwd: "<%= dirs.controller %>",
                        src: "*.js",
                        dest: "<%= dirs.examples %>/ComponentTemplate/oui5lib/controller/"
                    },
                    {
                        expand: true,
                        cwd: "<%= dirs.fragment %>",
                        src: "**",
                        dest: "<%= dirs.examples %>/ComponentTemplate/oui5lib/fragment/"
                    },
                    {
                        expand: true,
                        cwd: "<%= dirs.view %>",
                        src: "**",
                        dest: "<%= dirs.examples %>/ComponentTemplate/oui5lib/view/"
                    },
                    {
                        expand: true,
                        cwd: "<%= dirs.webroot %>",
                        src: "*.js",
                        dest: "<%= dirs.examples %>/FormPage/oui5lib/"
                    },
                    {
                        expand: true,
                        cwd: "<%= dirs.webroot %>/lib",
                        src: "*.js",
                        dest: "<%= dirs.examples %>/FormPage/oui5lib/lib/"
                    },
                    {
                        expand: true,
                        cwd: "<%= dirs.i18n %>",
                        src: "*.properties",
                        dest: "<%= dirs.examples %>/FormPage/oui5lib/i18n/"
                    },
                    {
                        expand: true,
                        cwd: "<%= dirs.controller %>",
                        src: "*.js",
                        dest: "<%= dirs.examples %>/FormPage/oui5lib/controller/"
                    },
                    {
                        expand: true,
                        cwd: "<%= dirs.fragment %>",
                        src: "**",
                        dest: "<%= dirs.examples %>/FormPage/oui5lib/fragment/"
                    },
                    {
                        expand: true,
                        cwd: "<%= dirs.view %>",
                        src: "**",
                        dest: "<%= dirs.examples %>/FormPage/oui5lib/view/"
                    }
                ]
            }
        }
    });
    grunt.loadNpmTasks("grunt-available-tasks");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-jsdoc");
    grunt.loadNpmTasks("grunt-eslint");
    grunt.loadNpmTasks("grunt-contrib-jasmine");

    grunt.registerTask("default", ["availabletasks"]);
    grunt.registerTask("lint", ["eslint"]);
    grunt.registerTask("test", ["jasmine"]);
    grunt.registerTask("gendoc", ["clean:doc", "jsdoc"]);
    grunt.registerTask("prepare-examples", ["clean:examples", "copy:oui5lib"]);

};
