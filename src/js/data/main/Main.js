define([
    'data/main/config',
    'data/main/Dispatcher',
    'data/main/AppController'
], function(AppConfig, Dispatcher, AppController) {
    'use strict';

    var Main = {

        /**
         * Initialize the mapping page from here
         */
        init: function() {
            // Store Globals in brApp if you must have a global
            window.brApp = {
                debugEnabled: false,
                debug: function(msg) {
                    if (this.debugEnabled) {
                        if (typeof msg === 'string') {
                            console.log(msg);
                        } else {
                            console.dir(msg);
                        }
                    }
                }
            };

            this.configureApp();
            this.launchApp();
        },

        /**
         * Configure the app here with proxy urls or cors enabled servers or any global settings
         */
        configureApp: function() {
            brApp.debug('Main.js >>> configureApp');
            // AppConfig.corsEnabledServers.forEach(function(server) {
            //     esriConfig.defaults.io.corsEnabledServers.push(server);
            // });
        },

        /**
         * Launch the app here or run some browser compatability checks here before initializing the map
         */
        launchApp: function() {
            brApp.debug('Main.js >>> launchApp');
            var queryString = location.href.split('?')[1],
                params;

            if (queryString) {
                params = ioQuery.queryToObject(queryString);
            }


            // Have the dispatcher start listnening for events
            Dispatcher.listen();
            // Init the AppController, Override Events, General Events, and Changing App State are in AppController
            AppController.init();
            // Show Home Page/ Welcome Dialog if params.intro is not no, if it is, just return
            if (params && params.intro === "no") {
                return;
            }

        }

    };

    return Main;

});