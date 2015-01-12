define([
	"map/MapAssets",
	"map/WidgetsController",
	"esri/graphic",
	"dijit/registry",
	"esri/toolbars/draw",
	"esri/geometry/Polygon"
], function (MapAssets, WidgetsController, Graphic, registry, Draw, Polygon) {
	'use strict';

	var isActive,
			toolbar;

	var DrawTools = {

		/**
		* Initialize the draw toolbar but does not activate it
		*/
		init: function () {
			isActive = false;
			toolbar = new Draw(brApp.map);
			toolbar.on('draw-end', this.complete.bind(this));
		},

		/**
		* Draw completed, handle the drawn feature here or pass on to someone else
		* @param {object} evt - event emitted from draw toolbar which should contain the geometry drawn
		*/
		complete: function (evt) {
			this.deactivate();

			if (!evt.geometry) {
				return;
			}

			var symbol = MapAssets.getDrawUploadSymbol(),
					graphicsLayer = brApp.map.graphics,
					attributes = {},
					graphic,
					polygon;

			// Add Custom Attributes if needed or some unique Id, which can help
			// in deleting features from popups

			polygon = new Polygon(evt.geometry);
			graphic = new Graphic(polygon, symbol, attributes);
			graphicsLayer.add(graphic);

		},

		/**
		* Activate the Toolbar
		*/
		activate: function () {
			toolbar.activate(Draw.FREEHAND_POLYGON);
			isActive = true;
			// Close containers if they are open
			registry.byId('analysis-dialog').hide();
			if (WidgetsController.mobileMenuIsOpen()) {
				WidgetsController.toggleMobileMenu();
			}
		},

		/**
		* Deactivate the Toolbar
		*/
		deactivate: function () {
			toolbar.deactivate();
			isActive = false;
		},

		/**
		* @return {boolean} isActive - is the toolbar active or not
		*/
		isActive: function () {
			return isActive;
		}

	};

	return DrawTools;

});