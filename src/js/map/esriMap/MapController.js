define([
	'map/Map',
	'map/MapConfig',
	'map/WidgetsController',
	'dojo/on',	
	'dojo/query',
	'dojo/dom-class',
	'dojo/dom-construct',
	'esri/dijit/HomeButton'
], function (Map, MapConfig, WidgetsController, on, dojoQuery, domClass, domConstruct, HomeButton) {
	'use strict';

	var MapController = {

		/**
		*	Initialize the map with default options, register callbacks if necessary
		*/
		init: function () {
			brApp.debug('MapController >>> init');
			var self = this;
			// mapObject is not esri/map, it is a wrapper for creating the map and layers
			var mapObject = new Map(MapConfig.options);
			// Make the esri/map available in the global context so other modules can access easily
			brApp.map = mapObject.map;
			// Bind Events now, Map Events then UI Events
			mapObject.on('map-ready', function () {
				self.renderComponents();
			});

			on(document.getElementById('legend-toggle'), 'click', WidgetsController.toggleLegend);
			on(document.getElementById('basemap-button'), 'click', WidgetsController.toggleBasemapGallery);
			on(document.getElementById('tree-container-toggle'), 'click', WidgetsController.toggleTreeContainer);

		},

		/**
		*	Render various components onto the map
		*/
		renderComponents: function () {
			brApp.debug('MapController >>> renderComponents');
			var homeWidget,
					legend,
					node;

			// Build/Insert DOM nodes as Needed
			node = dojoQuery('.esriSimpleSliderIncrementButton')[0];
			domConstruct.create('div', {'id': 'homeButton'}, node, 'after');
			homeWidget = new HomeButton({ map: brApp.map }, 'homeButton');

			// Start all widgets that need to be started
			homeWidget.startup();

			// remove hideOnLoad classes
			dojoQuery('body .hideOnLoad').forEach(function (node) {
				domClass.remove(node, 'hideOnLoad');
			});

		}

	};

	return MapController;

});