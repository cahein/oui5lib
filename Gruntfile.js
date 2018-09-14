module.exports = function (grunt) {
    "use strict";
    
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        dirs: grunt.file.readJSON("GruntRef.json"),
        
        availabletasks: {
            tasks: {
                options: {
                    groups: {
                        "Code quality": ["lint", "gendoc"],
                        "Distribution": ["dist"],
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
                        "dist":
                        "Generate oui5lib distribution package",
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
        concat: {
            options: {},
            oui5lib: {
                src: [
                    "<%= dirs.webroot %>/init-preload.js",
                    "<%= dirs.lib %>/listHelper.js",
                    "<%= dirs.webroot %>/configuration.js",
                    "<%= dirs.webroot %>/logger.js",
                    "<%= dirs.webroot %>/util.js",
                    "<%= dirs.webroot %>/formatter.js",
                    "<%= dirs.webroot %>/messages.js",
                    "<%= dirs.webroot %>/event.js",
                    "<%= dirs.webroot %>/request.js",
                    "<%= dirs.webroot %>/currentuser.js",
                    "<%= dirs.webroot %>/mapping.js",
                    "<%= dirs.webroot %>/validation.js",
                    "<%= dirs.webroot %>/messages.js",
                    "<%= dirs.webroot %>/ui.js",
                    "<%= dirs.webroot %>/listBase.js",
                    "<%= dirs.webroot %>/itemBase.js"
                ],
                dest: "<%= dirs.dist %>/oui5lib.concat.js"
            }
        },
        uglify: {
            options: {},
            oui5lib: {
                src: "<%= dirs.dist %>/oui5lib.concat.js",
                dest: "<%= dirs.dist %>/oui5lib.min.js"
            }
        },
        copy: {
            oui5lib: {
                files: [
                    {
                        expand: true,
                        src: "oui5lib.json",
                        dest: "<%= dirs.dist %>"
                    },
                    {
                        expand: true,
                        cwd: "<%= dirs.i18n %>",
                        src: "*.properties",
                        dest: "<%= dirs.dist %>/oui5lib/i18n/"
                    },
                    {
                        expand: true,
                        cwd: "<%= dirs.controller %>",
                        src: "*.js",
                        dest: "<%= dirs.dist %>/oui5lib/controller/"
                    },
                    {
                        expand: true,
                        cwd: "<%= dirs.fragment %>",
                        src: "**",
                        dest: "<%= dirs.dist %>/oui5lib/fragment/"
                    },
                    {
                        expand: true,
                        cwd: "<%= dirs.view %>",
                        src: "**",
                        dest: "<%= dirs.dist %>/oui5lib/view/"
                    }
                ]
            },
            examples: {
                files: [
                    {
                        expand: true,
                        cwd: "<%= dirs.webroot %>",
                        src: [
                            "init-preload.js",
                            "lib/listHelper.js",
                            "configuration.js",
                            "logger.js",
                            "util.js",
                            "event.js",
                            "formatter.js",
                            "request.js",
                            "mapping.js",
                            "listBase.js",
                            "itemBase.js"
                        ],
                        dest: "<%= dirs.examples %>/DomainObjects/oui5lib/"
                    },
                    {
                        src: "<%= dirs.dist %>/oui5lib.min.js",
                        dest: "<%= dirs.examples %>/ComponentTemplate/oui5lib.js"
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
                        src: [
                            "configuration.js",
                            "logger.js"
                        ],
                        dest: "<%= dirs.examples %>/ComponentTemplate/oui5lib/"
                    },
                    {
                        src: "<%= dirs.dist %>/oui5lib.min.js",
                        dest: "<%= dirs.examples %>/FormPage/oui5lib.js"
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
                    },
                    {
                        expand: true,
                        cwd: "<%= dirs.webroot %>",
                        src: [
                            "configuration.js",
                            "logger.js"
                        ],
                        dest: "<%= dirs.examples %>/FormPage/oui5lib/"
                    }
                ]
            }
        }
    });
    grunt.loadNpmTasks("grunt-available-tasks");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify-es");
    grunt.loadNpmTasks("grunt-jsdoc");
    grunt.loadNpmTasks("grunt-eslint");
    
    grunt.registerTask("default", ["availabletasks"]);
    grunt.registerTask("lint", ["eslint"]);
    grunt.registerTask("gendoc", ["clean:doc", "jsdoc"]);
    grunt.registerTask("dist", [ "concat:oui5lib",
                                 "uglify:oui5lib",
                                 "copy:oui5lib" ]);

    grunt.registerTask("prepare-examples", ["clean:examples",
                                            "dist",
                                            "copy:examples"]);
};
