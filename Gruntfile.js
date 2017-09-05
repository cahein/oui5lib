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
                "<%= dirs.view %>/**/*.js",
                "<%= dirs.controller %>/**/*.js",
                "<%= dirs.fragment %>/**/*.js",
                "<%= dirs.lib %>/**/*.js"
            ]
        },
        clean: {
            doc: {
                src: [
                    "doc"
                ]
            }
        },
        jsdoc: {
            dist: {
                src: [
                    "<%= dirs.lib %>/**/*.js",
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
                        src: "*.js",
                        dest: "<%= dirs.examples %>/BusinessObjects/oui5lib/"
                    },
                    {
                        expand: true,
                        cwd: "<%= dirs.webroot %>",
                        src: "*.js",
                        dest: "<%= dirs.examples %>/ComponentTemplate/oui5lib/"
                    },
                    {
                        expand: true,
                        cwd: "<%= dirs.webroot %>",
                        src: "*.js",
                        dest: "<%= dirs.examples %>/FormPage/oui5lib/"
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
    grunt.loadNpmTasks("grunt-jsdoc");
    grunt.loadNpmTasks("grunt-eslint");

    grunt.registerTask("default", ["availabletasks"]);
    grunt.registerTask("lint", ["eslint"]);
    grunt.registerTask("gendoc", ["clean:doc", "jsdoc"]);
    grunt.registerTask("prepare-examples", ["copy:oui5lib"]);

};
