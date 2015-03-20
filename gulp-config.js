module.exports = {
    copy: {
        libs: {
            src: 'src/libs/**/*',
            out: 'build/libs'
        },
        access: {
            src: 'src/.htaccess',
            out: 'build'
        }
    },
    imagemin: {
        src: 'src/**/*.{png,jpg,gif}',
        dest: 'build'
    },
    stylus: {
        base: 'src/css',
        watch: 'src/css/**/*.styl',
        src: ['src/css/base.styl', 'src/css/map.styl', 'src/css/home.styl', 'src/css/about.styl', 'src/css/contact.styl', 'src/css/data.styl'],
        devOut: 'src/css',
        buildOut: 'build/css'
    },
    jade: {
        base: 'src',
        watch: 'src/**/*.jade',
        src: ['src/index.jade', 'src/about.jade', 'src/map.jade', 'src/data.jade', 'src/contact.jade'],
        devOut: 'src',
        buildOut: 'build'
    },
    react: {
        src: 'src/js/**/*.jsx',
        out: 'src/js'
    },
    uglify: {
        src: 'src/js/map/dojoBootstrap.js',
        dest: 'build/js/map'
    },
    optimizer: {
        map: {
            options: {
                baseUrl: 'src',
                paths: {
                    'dojo': 'empty:',
                    'esri': 'empty:',
                    'dijit': 'empty:',
                    'dojox': 'empty:',
                    'react': 'empty:',
                    'js': 'js',
                    'libs': 'libs',
                    'main': 'js/map/main',
                    'map': 'js/map/esriMap',
                    'utils': 'js/map/utils',
                    'components': 'js/components'
                },
                name: 'js/map/loader',
                out: 'build/js/map/loader.js'
            }
        },
        about: {
            options: {
                baseUrl: 'src',
                paths: {
                    'dojo': 'empty:',
                    'esri': 'empty:',
                    'dijit': 'empty:',
                    'dojox': 'empty:',
                    'react': 'empty:',
                    'js': 'js',
                    'libs': 'libs',
                    'about': 'js/about',
                    'components': 'js/components'
                },
                name: 'js/about/aboutLoader',
                out: 'build/js/about/aboutLoader.js'
            }
        },
        home: {
            options: {
                baseUrl: 'src',
                paths: {
                    'dojo': 'empty:',
                    'esri': 'empty:',
                    'dijit': 'empty:',
                    'dojox': 'empty:',
                    'react': 'empty:',
                    'js': 'js',
                    'libs': 'libs',
                    'home': 'js/home',
                    'components': 'js/components'
                },
                name: 'js/home/homeLoader',
                out: 'build/js/home/homeLoader.js'
            }
        }
    }
};