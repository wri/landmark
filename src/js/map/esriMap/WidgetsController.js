define([
	'dojo/_base/fx',
	'dojo/dom-class'
], function (Fx, domClass) {
	'use strict';

	var DURATION = 300;

	var Controller = {
		/**
		* Toggle the legend container open or close
		*/
		toggleLegend: function () {
			brApp.debug('WidgetsController >>> toggleLegend');
			var node = document.getElementById('legend'),
					legendNode = document.querySelector('.brMap .legend-content'),
					active = domClass.contains(legendNode, 'active'),
					height = active ? 0 : node.scrollHeight;

			domClass.toggle(legendNode, 'active');

			Fx.animateProperty({
				node: node,
				properties: {
					height: height
				},
				duration: DURATION,
				onEnd: function () {
					if (height !== 0) {
						// Update the size of the legend as it grows so no scrollbars
						node.style.height = 'auto';
					}
				}
			}).play();
		},

		/**
		* Toggle the basemap gallery container open or close
		*/
		toggleBasemapGallery: function () {
			brApp.debug('WidgetsController >>> toggleBasemapGallery');
			var connector = document.querySelector('.brMap .basemap-container'),
					container = document.querySelector('.brMap .basemap-connector');

			if (connector && container) {
				domClass.toggle(connector, 'hidden');
				domClass.toggle(container, 'hidden');
			}

		},

		/**
		* Toggle the tree widget container open or close
		*/
		toggleTreeContainer: function () {
			brApp.debug('WidgetsController >>> toggleTreeContainer');
			var labelNode = document.getElementById('tree-container-toggle'),
					node = document.getElementById('tree-content'),
					active = domClass.contains(node, 'active'),
					height = active ? 0 : node.scrollHeight;

			labelNode.innerHTML = active ? '&plus;' : '&minus;';
			domClass.toggle(node, 'active');			

			Fx.animateProperty({
				node: node,
				properties: {
					height: height
				},
				duration: DURATION,
				onEnd: function () {
					if (height !== 0) {
						// Update the size of the legend as it grows so no scrollbars
						node.style.height = 'auto';
					}
				}
			}).play();

		}

	};

	return Controller;

});