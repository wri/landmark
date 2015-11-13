(function(win, doc) {
    'use strict';

    var base = location.pathname.replace(/\/[^/]+$/, ''),
        isWordpress = location.hostname.search('landmarkmap.org') > -1,
        base = isWordpress ? base.replace('map', 'map-app') : base,
        appVersion = '1.1.6',
        esriVersion = '3.13',
        js = [
            '//js.arcgis.com/' + esriVersion + '/init.js'
        ],
        css = [
            '//js.arcgis.com/' + esriVersion + '/esri/css/esri.css',
            '//js.arcgis.com/' + esriVersion + '/dijit/themes/tundra/tundra.css'
        ],
        config = {
            parseOnLoad: true,
            async: true,
            cacheBust: "v=" + appVersion,
            packages: [{
                name: 'js',
                location: base + '/js'
            }, {
                name: 'libs',
                location: base + '/libs'
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
                ['react', 'https://fb.me/react-0.13.0.min.js']
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
