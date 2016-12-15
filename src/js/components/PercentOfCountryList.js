/** @jsx React.DOM */
define([
	'react',
	'map/MapConfig',
	'map/LayerController',
  'components/PercentLegend'
], function (React, MapConfig, LayerController, PercentLegend) {
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
	var LayerList = React.createClass({displayName: "LayerList",

		getInitialState: function () {

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

	/**
	* Main Controlling List
	*/

	var PercentOfCountryList = React.createClass({displayName: "PercentOfCountryList",

		// If changing defaults, changing landTenureCategory to LandTenureCom requires
		// you to change the layer as well, see below:
		// LandTenureCom needs LandTenureLayer = 0
		// LandTenureInd needs LandTenureLayer = 2
		// By Default, the first item in every list is the active
		// So activePercentIndigenousLayer = 1 represents first item, if default is changed
		// activePercentIndigenousLayer must change, 2 for first item, 3 for second, 4 for third

	getInitialState: function () {

      return {
        active: "none",
        landTenureCategory: LandTenureInd,
        landTenureLayer: 2,
        activePercentIndigenousLayer: 1,
        activeCommunityKey: MapConfig.landTenureCommunityLayers[0].id,
        activeIndigenousKey: MapConfig.landTenureIndigenousLayers[0].id
      };
    },

    componentDidMount: function () {
    	// If we need to set the state based on the url, do so here, but also set up global defaults for other
    	// parts of the app to use, such as currentLayer

    	brApp.currentLayer = (
    		this.state.landTenureCategory === LandTenureInd ?
    			this.state.activeIndigenousKey :
    			this.state.activeCommunityKey
    	);
      this.setState({active: PercentIndigenous});
    },

    setToNone: function () {

        if (this.state.active !== 'none') {
            this.setState({ active: 'none' });
        }
    },

    componentDidUpdate: function () {
    	var visibleLayers,
    			state = this.state;

			console.log(state.active)

    	switch (state.active) {
    		case 'none':
    			visibleLayers = [-1];
    			break;
    		case LandTenure:
					if (this.state.landTenureCategory === LandTenureInd) {
						console.log('activeIndigenousKey',this.state.activeIndigenousKey)
						if (this.state.activeIndigenousKey === "averageScoreTenure") {
							visibleLayers = [2];
						} else {
							visibleLayers = [3];
						}
					} else {
						console.log('activeCommunityKey',this.state.activeCommunityKey)
						if (this.state.activeCommunityKey === "averageScoreTenure") {
							visibleLayers = [0];
						} else {
							visibleLayers = [1];
						}

					}
					brApp.currentLayer = (state.landTenureCategory === LandTenureInd ? state.activeIndigenousKey : state.activeCommunityKey);
    			// // If Current Category is Land Tenure Indigenous, visible layers is [0], else, its [2]
    			// visibleLayers = (this.state.landTenureCategory === LandTenureInd ? [0] : [2]);
    			break;
    		case PercentIndigenous:
    			visibleLayers = [state.activePercentIndigenousLayer];
					brApp.currentLayer = 'percentIndigenousLayers';
    			break;
    	}

			console.log(visibleLayers)

    	// Update the currentLayer in brApp, Our popup needs to know the selection so it can format the content correctly


    	// The true signifies that this is the national layer being updated
    	LayerController.updateVisibleLayers(visibleLayers, true);

    },

		changePercentIndigenousLayer: function (key, layer) {
			if (!layer) {
				return;
			}
    	this.setState({
    		activePercentIndigenousLayer: layer
    	});
    },

    /* jshint ignore:start */
    render: function () {

			var legendObject = {
        name: 'percentLands',
        layerIdValue: 1
      }

    	return (
				React.createElement("div", {className: "percent-indigenous-layer-list"}, 
					React.createElement(LayerList, {class: "percent-indigenous-tree", data: MapConfig.percentIndigenousLayersCombined, change: this.changePercentIndigenousLayer}), 
					React.createElement(PercentLegend, {openTab: this.props.openTab, legendObject: legendObject})
				)
    	);
    }
    /* jshint ignore:end */

	});

	return PercentOfCountryList;

});
