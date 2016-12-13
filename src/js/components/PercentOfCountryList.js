define([
	'react',
	'map/MapConfig',
	'map/LayerController'
], function (React, MapConfig, LayerController) {
	'use strict';

	// CONSTANTS
	var LandTenureInd = 'land-tenure-indigenous';
	var LandTenureCom = 'land-tenure-community';
	var LandTenure = 'land-tenure';
	var PercentIndigenous = 'percent-indigenous';

	// Small Sub Class to render the lists, needs to keep track of active list item
	// Shows Question onClick
	/** Requirements:
		data: array of data
		each item in the array must have id, label properties, with an optional question property
	*/
	var PercentOfCountryList = React.createClass({displayName: "PercentOfCountryList",

		getInitialState: function () {
      console.log('get initial?');

			if (this.props.class === 'percent-indigenous-tree') {
				return {
					active: this.props.data[1].id
				};
			} else {
				return {
					active: this.props.data[0].id
				};
			}


		},

		/* jshint ignore:start */
		render: function () {
			return (
				React.createElement("div", {className: this.props.class || 'national-level-layer-list'}, 
					this.props.data.map(this.dataMapper, this)
				)
			);
		},

		dataMapper: function (item, index) {
			var active = (this.state.active === item.id);
			var subTitle = item.subTitle;
			var subLayer = item.subLayer;
			var layer = item.layer;
			var comingSoon = item.comingSoon;


			return (
				React.createElement("div", {className: 'national-layer-list-item ' + (active ? 'active' : '') + (subTitle ? 'subTitle' : '') + (subLayer ? 'subLayer' : '') + (comingSoon ? ' comingSoon' : ''), key: item.id, onClick: layer != undefined && !comingSoon ? this.setActiveLayer.bind(this, item.id, item.layer) : null}, 
					React.createElement("div", {className: "national-layer-list-item-label"}, item.label), 
					
						item.question ?
						React.createElement("div", {className: "national-layer-list-item-question"}, item.question) :
						null
					
				)
			);
		},
		/* jshint ignore:end */
		setActiveLayer: function (key, layer) {
			this.setState({
				'active': key
			});

			// Notify Parent and let parent dispatch updates
			this.props.change(key, layer);

		}

	});

  return PercentOfCountryList;
});
