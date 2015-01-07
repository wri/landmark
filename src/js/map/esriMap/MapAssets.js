define([
	"esri/Color",
	"esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol"
], function (Color, SimpleFillSymbol, SimpleLineSymbol) {
	'use strict';

	/**
	* This Class is a good place to store popup templates and symbols that are used in more then one location
	* so we have an easy way to modify these in the future
	*/

	var Assets = {

		/**
		* Returns a symbol to be used for drawn or uploaded features
		* @return {object} returns a esri symbol for graphic objects
		*/
		getDrawUploadSymbol: function () {
			return new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
             new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0]), 2),
             new Color([255, 255, 255, 0.5]));
		}

	};

	return Assets;

});