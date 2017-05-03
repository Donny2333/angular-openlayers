/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.company %>;' +
        ' Licensed <%= pkg.license %> */\n',
        // Task configuration.
        encase: {
            js: {
                separator: '\n',
                environment: 'browser',
                banner: '<%= banner %>',
                exports: ['aol'],
                src: [
                    'src/js/aol.js',
                    'src/js/collections.js',
                    'src/js/map.js',
                    'src/js/interactions.js',
                    'src/js/controls.js',
                    'src/js/view.js',
                    'src/js/layers.js',
                    'src/js/overlay.js',
                    'src/js/sources.js',
                    'src/js/feature.js',
                    'src/js/styles.js',
                    'src/js/geometries.js',
                    'src/js/projection.js',
                    'src/js/coordinate.js'
                ],
                dest: 'dist/angular-openlayers.js'
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>\n'
            },
            css: {
                src: ['src/css/angular-openlayers.css'],
                dest: 'dist/angular-openlayers.css'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= encase.js.dest %>',
                dest: 'dist/angular-openlayers.min.js'
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                devel: true,
                trailing: true,
                globals: {
                    aol: true,
                    ol: true,
                    angular: true,
                    define: true
                }
            },
            src: {
                src: '<%= encase.js.src %>'
            },
            dist: {
                src: '<%= encase.js.dest %>'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            }

        },
        jsdoc: {
            dist: {
                src: '<%= encase.js.src %>',
                options: {
                    destination: 'doc'
                }
            }
        },
        watch: {
            gruntfile: {
                files: '<%= encase.js.src %>',
                tasks: ['jshint:src']
            },
            src: {
                files: '<%= encase.js.src %>',
                tasks: ['jshint:src', 'jsdoc', 'encase:js', 'concat:css', 'jshint:dist', 'uglify']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-encase');
    grunt.loadNpmTasks('grunt-jsdoc');

    // Default task.
    grunt.registerTask('default', ['jshint:src', 'jsdoc', 'encase:js', 'concat:css', 'jshint:dist', 'uglify']);
    grunt.registerTask('watch', ['watch:src']);

};
