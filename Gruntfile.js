module.exports = function (grunt) {

    // Project configuration
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            release: ['dist/css', 'dist/js']
        },

        concat: {
            options: {
                seperator: ';'
            },
            dist: {
                src: ['src/**/*.js'], // files to concatenate
                dest: 'dist/js/<%= pkg.name %>-<%=pkg.version %>.js' // the location of the resulting JS file
            }
        },

        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'dist/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/css',
                    ext: '.min.css'
                }]
            }
        },

        jshint: {
            options: '<%= pkg.jshintConfig %>',
            all: ['src/**/*js']
        },

        sass: {
            dist: {
                // Target options
                options: {
                    style: 'expanded',
                    trace: true,
                    lineNumbers: true,
                    sourceMap: true
                },
                // Dictionary of files
                files: [{
                    expand: true,
                    cwd: 'src/styles/',
                    src: ['*.scss'],
                    dest: 'dist/css/',
                    ext: '.css'
                }]
            }
        },

        scsslint: {
            allFiles: [
              'src/styles/**/*.scss',
            ],
            options: {
                config: '.scss-lint.yml',
                exclude: ['src/styles/_base.scss', 'src/styles/_print.scss', 'src/styles/vendor/**', 'src/styles/dev/**'],
                colorizeOutput: true
            },
        },

        svg_sprite: {
            complex: {

                // Target basics
                expand: true,
                cwd: 'dist/images/icons/',
                src: ['**/*.svg'],
                dest: 'dist/images/icons/sprite/',

                // Target options
                options: {
                    shape: {
                        dimension: {         // Set maximum dimensions
                            maxWidth: 32,
                            maxHeight: 32
                        },
                        spacing: {         // Add padding
                            padding: 0
                        }
                    },
                    mode: {
                        symbol: true
                    }
                }
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */' // the banner is inserted at the top of the output
            },
            dist: {
                files: {
                    'dist/js/<%= pkg.name %>-<%= pkg.version %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        watch: {
            css: {
                files: ['src/styles/*.scss', 'src/styles/**/*.scss'],
                tasks: ['scsslint', 'jshint', 'sass', 'cssmin', 'concat', 'uglify']
            },
            options: {
                livereload: true
            },
            scripts: {
                files: ['src/styles/**/*.js'],
                tasks: ['sass', 'concat', 'uglify'],
                options: {
                    spawn: false,
                    livereload: true,
                }
            }
        },

        express: {
            all: {
                options: {
                    bases: ['dist/'],
                    port: 9000,
                    hostname: "0.0.0.0",
                    livereload: true
                }
            }
        },

        open: {
            all: {
                path: 'http://localhost:9000'
            }
        }
    });

    // Load task(s)
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-svg-sprite');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-scss-lint');

    // Define task(s)
    grunt.registerTask('default', ['sass', 'scsslint', 'watch', 'concat', 'uglify', 'svg_sprite', 'cssmin', 'jshint']);
    grunt.registerTask('build', ['clean', 'sass', 'scsslint', 'jshint', 'concat', 'uglify', 'cssmin']);
    grunt.registerTask('serve', ['express', 'open', 'watch']);
};
