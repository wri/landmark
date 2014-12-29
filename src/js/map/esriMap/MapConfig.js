define([], function () {

	var indigenousLandsUrl = 'http://gis-stage.wri.org/arcgis/rest/services/CommunityLands/CommunityLands/MapServer';

	var MapConfig = {

		options: {
			sliderPosition: 'top-right',
			basemap: 'gray',
			centerX: -19,
			centerY: 19,
			zoom: 3
		},

		layers: {
			'indigenousLands': {
				url: indigenousLandsUrl,
				type: 'dynamic',
				defaultLayers: [],
				visible: false
			}
		}

	};

	return MapConfig;

});