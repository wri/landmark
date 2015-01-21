define([
	'dojo/topic',
	'map/MapConfig',
	'dojo/_base/array'
], function (topic, MapConfig, arrayUtils) {
	'use strict';


	var LayerController = {

		/**
		* Update the visible layers on a dynamic layer based on keys from the Checkbox Tree
		* @param {array} keys - Array of keys from the checkbox tree, these are mapped to layer numbers
		* 										- in the MapConfig.layerMapping (may add layer id's to config if needed).
		*/
		updateVisibleLayers: function (keys) {
			brApp.debug('LayerController >>> updateVisibleLayers');
			// Currently there is only one layer, as the app grows and more layers are added
			// add some data to the MapConfig.layerMapping so we know which layer id to use and
			// which sublayers to turn on
			var dynamicLayer = brApp.map.getLayer('indigenousLands'),
					visibleLayers = [];

			if (keys.length === 0) {
				visibleLayers.push(-1);
			} else {
				arrayUtils.forEach(keys, function (key) {
					visibleLayers = visibleLayers.concat(MapConfig.layerMapping[key]);
				});
			}

			dynamicLayer.setVisibleLayers(visibleLayers);
			topic.publish('refresh-legend');
		},

		setVisibleLayers: function (id, layers) {

		}

	};

	return LayerController;

});