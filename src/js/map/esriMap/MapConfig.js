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
				// Not all the layers are present in the tree, when they are, include 0 - 9
				defaultLayers: [2,4,5,7,8,9], //[0,1,2,3,4,5,6,7,8,9]
				visible: true
			}
		},

		// If adding content to the tree, the ID must be unique and present, and the label must be present
		// Other Options
		// children: array of children objects
		// checked: true/false, default checked of the checkbox, default is false
		// collapsed: true/false, default state of the node containing children, default is false
		// disabled: true/false, should the node be disabled or not, default is false		
		communityLevelTreeData: [
			{ 
				label: 'Indigenous Lands (self recognized)', 
				id: 'indigenousLands',
				checked: true, 
				children: [
					{ 
						label: 'Officially recognized (by law or decree)', 
						id: 'indigenousOfficial',
						checked: true,
						children: [
							{ label: 'Formal Document/Title', id: 'indigenousFormalTitle', checked: true },
							{ label: 'In process of titling', id: 'indigenousInProcess', checked: true }
						]
					},
					{ 
						label: 'Not officially recognized',
						id: 'indigenousUnofficial',
						checked: true,
						children: [
							{ label: 'Formal land claim', id: 'indigenousLandClaim', checked: true },
							{ label: 'Occupied/used without formal land claim', id: 'indigenousNoLandClaim', disabled: true }
						]
					}
				]
			},
			{ 
				label: 'Community Lands',
				id: 'communityLands',
				collapsed: true,
				disabled: true,
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
		],

		layerMapping: {
			'indigenousLands': [2],
			'indigenousOfficial': [4],
			'indigenousUnofficial': [5],
			'indigenousFormalTitle': [7],
			'indigenousInProcess': [8],
			'indigenousLandClaim': [9]
		}

	};

	return MapConfig;

});