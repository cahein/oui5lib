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
                        "Default": ["availabletasks"]
                    },
                    descriptions: {
                        "lint":
                        "Run eslint to detect errors and potential problems in our JavaScript code.",
                        "gendoc":
                        "Generates html documentation.",
                        "dist":
                        "Generated distribution package",
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
                "<%= dirs.fragment %>/**/*.js",
                "!<%= dirs.webroot %>/oui5lib.js"
            ]
        },
        copy: {
            dist: {
                files: [
                    {
                        src: [
                            "<%= dirs.webroot %>/index.html",
                            "<%= dirs.webroot %>/Component.js",
                            "<%= dirs.webroot %>/Router.js",
                            "<%= dirs.webroot %>/*.json",
                            "<%= dirs.webroot %>/oui5lib.js",
                            "<%= dirs.webroot %>/oui5lib/**/*.*",
                            "<%= dirs.i18n %>/i18n*.properties",
                            "<%= dirs.controller %>/**/*.js",
                            "<%= dirs.fragment %>/**/*.js",
                            "<%= dirs.fragment %>/**/*.xml",
                            "<%= dirs.lib %>/**/*.js",
                            "<%= dirs.view %>/**/*.js",
                            "<%= dirs.view %>/**/*.xml",
                            "!~*"
                        ],
                        dest: "<%= dirs.build %>/"
                    }
                ]
            }
        },
        compress: {
            build: {
                options: {
                    archive: "<%= dirs.dist %>/ooooo-template." +
                        "<%= grunt.template.today('yyyymmdd-HHMMss') %>.zip",
                    mode: "zip"
                },
                files: [{
                    expand: true,
                    cwd: "<%= dirs.build %>/",
                    src: ["webapp/**/*"],
                    dest: "/"
                }]
            }
        },
        clean: {
            build: {
                src: [
                    "<%= dirs.build %>"
                ]
            },
            doc: {
                src: [
                    "doc"
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
        openui5_preload: {
            component: {
                options: {
                    resources: {
                        cwd: "<%= dirs.webroot %>",
                        prefix: "ooooo",
                        src: [
                            "Component.js",
                            "Router.js",
                            "controller/**",
                            "fragment/**",
                            "i18n/**",
                            "view/**",
                            "lib/**"
                        ]
                    },
                    dest: "<%= dirs.build %>/webapp"
                },
                components: "ooooo"
            }
        }
    });
    grunt.loadNpmTasks("grunt-available-tasks");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-jsdoc");
    grunt.loadNpmTasks("grunt-eslint");
    grunt.loadNpmTasks("grunt-openui5");

    grunt.registerTask("default", ["availabletasks"]);
    grunt.registerTask("lint", ["eslint"]);
    grunt.registerTask("gendoc", ["clean:doc", "jsdoc"]);
    grunt.registerTask("generatePreload", "openui5_preload");
    grunt.registerTask("dist", [
        "clean:build",
        "generatePreload",
        "copy:dist",
        "compress" ]);
};
