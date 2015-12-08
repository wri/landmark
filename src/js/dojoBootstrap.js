(function(win, doc) {
    'use strict';

    var base = location.pathname.replace(/\/[^/]+$/, ''),
        isWordpress = location.hostname.search('landmarkmap.org') > -1,
        base = isWordpress ? base.replace('map', 'map-app') : base,
        appVersion = '1.1.11',
        // esriVersion = '3.13',
        js = [
            '/libs/esri_api/init.js'
        ],
        css = [
            '/libs/esri_api/esri/css/esri.css',
            '/libs/esri_api/dijit/themes/tundra/tundra.css'
        ],
        config = {
            parseOnLoad: true,
            async: true,
            baseUrl: base,
            cacheBust: "v=" + appVersion,
            packages: [{
                name: 'js',
                location: base + '/js'
            }, {
                name: 'libs',
                location: base + '/libs'
            }, {
                name: 'esri',
                location: base + '/libs/esri_api/esri'
              }, {
                name: 'dojox',
                location: base + '/libs/esri_api/dojox'
              }, {
                name: 'dojo',
                location: base + '/libs/esri_api/dojo'
              }, {
                name: 'dgrid',
                location: base + '/libs/esri_api/dgrid'
              }, {
                name: 'dstore',
                location: base + '/libs/esri_api/dstore'
              }, {
                name: 'put-selector',
                location: base + '/libs/esri_api/put-selector'
              }, {
                name: 'xstyle',
                location: base + '/libs/esri_api/xstyle'
          }, {
            name: 'dijit',
            location: base + '/libs/esri_api/dijit'
        }, {
                name: 'main',
                location: base + '/js/main'
            }, {
                name: 'map',
                location: base + '/js/map'
            }, {
                name: 'utils',
                location: base + '/js/utils'
            }, {
                name: 'components',
                location: base + '/js/components'
            }],
            aliases: [
                ['react', 'libs/react/dist/react.min.js']
            ],
            deps: [
                "dojo/domReady!"
            ],
            callback: function() {
              if (isWordpress) {
                loadScript('/map-app/js/loader.js');
              } else {
                loadScript('js/loader.js');
              }
            }
        };

    var loadScript = function(src) {
        var s = doc.createElement('script'),
            h = doc.getElementsByTagName('head')[0];
        s.src = src;
        s.async = true;
        h.appendChild(s);
    };

    var loadStyle = function(src) {
        var l = doc.createElement('link'),
            h = doc.getElementsByTagName('head')[0];
        l.rel = 'stylesheet';
        l.type = 'text/css';
        l.href = src;
        h.appendChild(l);
    };

    win.requestAnimationFrame = (function() {
        return win.requestAnimationFrame ||
            win.webkitRequestAnimationFrame ||
            win.mozRequestAnimationFrame ||
            win.oRequestAnimationFrame ||
            win.msRequestAnimationFrame;
    })();

    var launch = function() {
        win.dojoConfig = config;
        for (var i = 0; i < css.length; i++) {
            loadStyle(css[i]);
        }
        for (var j = 0; j < js.length; j++) {
            loadScript(js[j]);
        }
    };


    if (win.requestAnimationFrame) {
        win.requestAnimationFrame(launch);
    } else if (doc.readyState === "complete") {
        launch();
    } else {
        win.onload = launch;
    }

})(this, document);
