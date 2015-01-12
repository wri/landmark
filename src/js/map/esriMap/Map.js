/* global define */
define([
	'dojo/Evented',
	'dojo/_base/declare',
	// My Modules
	'map/MapConfig',
	// Dojo Modules
	'dojo/on',
	'dijit/registry',
	// Esri Modules
	'esri/map',
	'esri/layers/ImageParameters',
	'esri/layers/ArcGISDynamicMapServiceLayer'
], function (Evented, declare, MapConfig, on, registry, Map, ImageParameters, ArcGISDynamicMapServiceLayer) {
	'use strict';

	var _map = declare([Evented], {

		element: 'brMap',

		/**
		* @param {object} options - Map options like center, default zoom, basemap, etc.
		*/
		constructor: function (options, mapElement) {
			declare.safeMixin(this, options);
			if (mapElement) this.element = mapElement;
			this.createMap();
		},


		/**
		* Create the map with the map options, then on load, resize, and start adding layers and widgets
		*/
		createMap: function () {
			var self = this;

			self.map = new Map(this.element, {
				basemap: this.basemap,
				center: [this.centerX, this.centerY],
				sliderPosition: this.sliderPosition,
				zoom: this.zoom
			});

      self.map.on('load', function () {
      	self.emit('map-ready', {});
      	// Clear out Phantom Graphics thanks to esri's graphics layer
				self.map.graphics.clear();
				self.map.resize();
				self.addLayers();
			});

		},

		/**
		* Loop over the MapConfg.layers, for each key, add a layer to the map
		* This function will check the layer type and hand it off to a specific function to add that layer type
		* Once layers have been created add them
		*/
		addLayers: function () {
			var layerConfig = MapConfig.layers,
					self = this,
					layers = [],
					key;

			for (key in layerConfig) {
				switch(layerConfig[key].type) {
					case 'dynamic': 
						layers.push(self.addDynamicLayer(key, layerConfig[key]));
					break;
					default:
					break;
				}
			}

			on.once(this.map, 'layers-add-result', function (response) {
				self.emit('layers-loaded', response);				
				
				var layerInfos = response.layers.map(function (item) {
					return { layer: item.layer };
				});
				
				registry.byId("legend").refresh(layerInfos);
			});

			this.map.addLayers(layers);
		},

		/**
		* @param {string} key - Layer ID
		* @param {object} layerConfig - See map/config.js in the layers object for an example
		* @return {object} newly created dynamic layer
		*/
		addDynamicLayer: function (key, layerConfig) {
			var params = new ImageParameters(),
					layer;

			params.layerOption = ImageParameters.LAYER_OPTION_SHOW;
			params.layerIds = layerConfig.defaultLayers;
			params.format = 'png32';

			layer = new ArcGISDynamicMapServiceLayer(layerConfig.url, {
				visible: layerConfig.visible || false,
				imageParameters: params,
				id: key
			});

			layer.on('error', this.addLayerError.bind(this));
			return layer;
		},

		/**
		* @param {object} err - Error from adding the layer
		*/
		addLayerError: function (err) {
			this.emit('layer-error', err.target.id);
		}

	});

	return _map;

});