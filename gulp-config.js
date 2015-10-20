module.exports = {
    appVersion: '1.0.5', //todo: match this version with the appVersion in dojoBootstrap.js before build
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
        src: 'src/**/*.{png,jpg,gif,svg}',
        dest: 'build'
    },
    browserSyncSrc: ['src/**/*.html', 'src/**/*.js', 'src/**/*.css'],
    stylus: {
        base: 'src/css',
        watch: 'src/css/**/*.styl',
        src: ['src/css/base.styl', 'src/css/map.styl'],
        devOut: 'src/css',
        buildOut: 'build/css'
    },
    jade: {
        base: 'src',
        watch: 'src/**/*.jade',
        src: ['src/map.jade'],
        devOut: 'src',
        buildOut: 'build'
    },
    react: {
        src: 'src/js/**/*.jsx',
        out: 'src/js'
    },
    uglify: {
        src: 'src/js/dojoBootstrap.js',
        dest: 'build/js'
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
                    'main': 'js/main',
                    'map': 'js/map',
                    'utils': 'js/utils',
                    'components': 'js/components'
                },
                name: 'js/loader',
                out: 'build/js/loader.js'
            }
        }
    }
};
