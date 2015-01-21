define([
	'esri/config',
	'main/config',
	'utils/Helper',
	'main/Dispatcher',
	'map/MapController',
	'main/AppController'
], function (esriConfig, AppConfig, Helper, Dispatcher, MapController, AppController) {
	'use strict';

	var Main = {

		/**
		* Initialize the mapping page from here
		*/
		init: function () {
			// Store Globals in brApp if you must have a global
			window.brApp = {
				debugEnabled: true,
				debug: function (msg) {
					if (this.debugEnabled) { 
						if (typeof msg === 'string') { console.log(msg); } 
						else { console.dir(msg); }
					}
				}
			};
			this.configureApp();
			this.launchApp();
		},

		/**
		* Configure the app here with proxy urls or cors enabled servers or any global settings
		*/
		configureApp: function () {
			brApp.debug('Main.js >>> configureApp');
			AppConfig.corsEnabledServers.forEach(function (server) {
				esriConfig.defaults.io.corsEnabledServers.push(server);
			});
		},

		/**
		* Launch the app here or run some browser compatability checks here before initializing the map
		*/
		launchApp: function () {
			brApp.debug('Main.js >>> launchApp');
			// Enable Responsive Layout
			Helper.enableLayout();
			// Have the dispatcher start listnening for events
			Dispatcher.listen();
			// Init the Map
			MapController.init();
			// Init the AppController, Override Events, General Events, and Changing App State are in AppController
			AppController.init();
		}

	};

	return Main;

});