define([
    'main/config',
    'map/ReportController'
], function(AppConfig, ReportController) {

    var Main = {

        /**
         * Initialize the mapping page from here
         */
        init: function() {
            // this.configureApp();
            this.launchApp();
        },

        /**
         * Configure the app here with proxy urls or cors enabled servers or any global settings
         */
        // configureApp: function() {
        //     brApp.debug('Main.js >>> configureApp');
        //     AppConfig.corsEnabledServers.forEach(function(server) {
        //         esriConfig.defaults.io.corsEnabledServers.push(server);
        //     });
        // },

        /**
         * Launch the app here or run some browser compatability checks here before initializing the map
         */
        launchApp: function() {
            var queryString = location.href.split('?')[1];
            var country = decodeURI(queryString.split('=')[1]);

            if (country.indexOf('#') > -1) {
              country = country.split('#')[0];
            }

            // Init the Map
            ReportController.init(country);

        }

    };

    return Main;

});
