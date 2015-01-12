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
				defaultLayers: [0,1,2,3,4,5,6,7,8,9],
				visible: true
			}
		},

		communityLevelTreeData: [
			{ 
				label: 'Indigenous Lands (self recognized)', 
				id: 'indigenousLands', 
				children: [
					{ label: 'Officially recognized (by law or decree)', id: 'indigenousOfficial' },
					{ label: 'Not officially recognized', id: 'indigenousUnofficial' }
				]
			},
			{ 
				label: 'Community Lands',
				id: 'communityLands',
				children: [
					{ 
						label: 'Officially recognized (by law or decree)',
						id: 'communityOfficial',
						children: [
							{ label: 'Formal Document/Title', id: 'communityFormalTitle' },
							{ label: 'In process of titling', id: 'communityInProcess' }
						]
					},
					{ 
						label: 'Not officially recognized',
						id: 'communityUnofficial',
						children: [
							{ label: 'Formal land claim', id: 'communityLandClaim' },
							{ label: 'Occupied/used without formal land claim', id: 'communityNoLandClaim' }
						]
					}
				]
			}
		]

	};

	return MapConfig;

});