module.exports = function(grunt){

    require('grunt-task-loader')(grunt);

    grunt.registerTask('default',['concurrent:dev']);
    grunt.registerTask('test',['concurrent:test']);
    grunt.registerTask('product',['concurrent:product']);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            options:{
                livereload:true
            },
            build:{
                files:['./controller/**', './app.js', './views/**'],
            },
            less:{
                files:['public/stylesheets/less/*.less'],
                tasks: ['less'],
                options:{
                    spawn: false
                }
            }
        },

        nodemon:{
            dev:{
                options:{
                    file:'./server/server.js',
                    args:['dev'],
                    ignore:['README.md','node_modules/**','DS_Store'],
                    watch:['./'],
                    ext:'js',
                    debug:true,
                    delay:1000,
                    env:{
                        PORT:3000
                    },
                    cwd:__dirname
                }
            }
        },

        less:{
            dev:{
                files: {
                    'public/stylesheets/css/main.css': ['public/stylesheets/less/*.less']
                }
            }

        },

        concurrent:{
            options:{
                logConcurrentOutput:true
            },
            dev: ['nodemon','watch','less'],
            test:['nodemon','watch','less'],
            product:['nodemon','watch','less']
        }
    });

    grunt.option('force',true);
};