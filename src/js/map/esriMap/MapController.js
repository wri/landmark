define([
	'map/Map',
	'map/MapConfig',
	'map/WidgetsController',
	'dojo/on',	
	'dojo/query',
	'dojo/dom-class',
	'dojo/dom-construct',
	'esri/dijit/Legend',
	'esri/dijit/Geocoder',
	'esri/dijit/HomeButton',
	'esri/dijit/LocateButton',
	'esri/dijit/BasemapGallery'
], function (Map, MapConfig, WidgetsController, on, dojoQuery, domClass, domConstruct, Legend, Geocoder, HomeButton, LocateButton, BasemapGallery) {
	'use strict';

	var MapController = {

		/**
		*	Initialize the map with default options, register callbacks if necessary
		*/
		init: function () {
			brApp.debug('MapController >>> init');
			var self = this;
			// Show Home Page/ Welcome Dialog
			WidgetsController.showWelcomeDialog();
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
			on(document.getElementById('national-level-toggle'), 'change', WidgetsController.toggleDataContainer);
			on(document.getElementById('community-level-toggle'), 'change', WidgetsController.toggleDataContainer);

		},

		/**
		*	Render various components onto the map
		*/
		renderComponents: function () {
			brApp.debug('MapController >>> renderComponents');
			var basemapGallery,
					locateButton,
					homeWidget,
					geocoder,
					legend,
					node;

			// Build/Insert DOM nodes as Needed
			geocoder = new Geocoder({
				map: brApp.map,
				autoComplete: true,
      	arcgisGeocoder: { placeholder: "Enter address" }
			}, "geocoder");

			node = dojoQuery('.esriSimpleSliderIncrementButton')[0];
			domConstruct.create('div', {'id': 'homeButton'}, node, 'after');
			homeWidget = new HomeButton({ map: brApp.map }, 'homeButton');

			basemapGallery = new BasemapGallery({
				map: brApp.map,
				showArcGISBasemaps: true
			}, 'basemap-gallery');

			legend = new Legend({
        map: brApp.map,
        layerInfos: [],
        autoUpdate: true
      }, "legend");

      locateButton = new LocateButton({
				map: brApp.map,
				highlightLocation: false
			}, 'location-widget');

			locateButton.startup();

			// Start all widgets that need to be started
			basemapGallery.startup();
			homeWidget.startup();
			geocoder.startup();
			legend.startup();

			// remove hideOnLoad classes
			dojoQuery('body .hideOnLoad').forEach(function (node) {
				domClass.remove(node, 'hideOnLoad');
			});

		}

	};

	return MapController;

});