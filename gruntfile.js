module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          port: 1337,
          open: true,
          base: 'dist',
          livereload: true,
          hostname: 'localhost'
        }
      }
    },

    clean: {
      dest: ['dist/*']
    },

    concat: {
      dist: {
        src: [
          'node_modules/jquery/dist/jquery.min.js',
          'node_modules/popper.js/dist/umd/popper.min.js',
          'node_modules/bootstrap/dist/js/bootstrap.min.js',
          'node_modules/showdown/dist/showdown.min.js',
          'node_modules/fireworks-canvas/fireworks.min.js',
          'src/scripts/utilities.js',
          'src/scripts/app.js'
        ],
        dest: 'dist/scripts/scripts.min.js'
      }
    },

    uglify: {
      build: {
        options: {
          mangle: true,
          compress: true
        },
        src: 'dist/scripts/*.js',
        dest: 'dist/scripts/scripts.min.js'
      }
    },

    imagemin: {
      dynamic: {
        options: {
          optimizationLevel: 5
        },
        files: [{
          expand: true,
          cwd: 'src/assets/',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: 'dist/assets/'
        }]
      }
    },

    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({ browsers: 'last 2 versions' }),
          require('cssnano')()
        ]
      },
      dist: {
        src: 'dist/css/styles.min.css'
      }
    },

    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'dist/styles/styles.min.css': 'src/styles/styles.scss'
        }
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.html'],
          dest: 'dist/'
        }]
      }
    },

    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['concat', 'uglify']
      },
      css: {
        files: ['src/**/*.scss'],
        tasks: ['sass', 'postcss']
      },
      html: {
        files: ['src/*.html'],
        tasks: ['htmlmin']
      },
      livereload: {
        options: {
          livereload: 35729
        },
        files: ['dist/**/*']
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-imagemin')
  grunt.loadNpmTasks('grunt-postcss')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-htmlmin')

  grunt.registerTask('dist', [
    'clean',
    'concat',
    'uglify',
    'sass',
    'imagemin',
    'htmlmin'
  ])

  grunt.registerTask('start', [
    'dist',
    'connect',
    'watch'
  ])
}
