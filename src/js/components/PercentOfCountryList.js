/** @jsx React.DOM */
define([
	'react',
	'map/MapConfig',
	'map/LayerController',
  'components/PercentLegend',
	'components/LayerList'
], function (React, MapConfig, LayerController, PercentLegend, LayerList) {
	'use strict';

	// CONSTANTS
	var LandTenureInd = 'land-tenure-indigenous';
	var LandTenureCom = 'land-tenure-community';
	var LandTenure = 'land-tenure';
	var PercentIndigenous = 'percent-indigenous';

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
        active: 'none',
        landTenureCategory: LandTenureInd,
        landTenureLayer: 2,
        activePercentIndigenousLayer: 2,
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
				this.props.setActiveTab(this.props.activeSelection)
    },

    setToNone: function () {

        if (this.state.active !== 'none') {
            this.setState({ active: 'none' });
        }
    },

    componentDidUpdate: function () {
    	var visibleLayers,
    			state = this.state;


    	switch (state.active) {
    		case 'none':
    			visibleLayers = [-1];
    			break;
    		case LandTenure:
					if (this.state.landTenureCategory === LandTenureInd) {
						if (this.state.activeIndigenousKey === "averageScoreTenure") {
							visibleLayers = [2];
						} else {
							visibleLayers = [3];
						}
					} else {
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


    	// Update the currentLayer in brApp, Our popup needs to know the selection so it can format the content correctly


    	// The true signifies that this is the national layer being updated
    	LayerController.updateVisibleLayers(visibleLayers, true);

    },

		changePercentIndigenousLayer: function (key, layer) {
			if (!layer) {
				return;
			}
			if (layer !== -1) {
				this.props.setActiveTab(this.props.activeSelection)
			}
    	this.setState({
    		activePercentIndigenousLayer: layer,
				active: PercentIndigenous
    	});
    },

    /* jshint ignore:start */
    render: function () {

			var legendObject = {
        name: 'percentLands',
        layerIdValue: this.state.activePercentIndigenousLayer
      }

    	return (
				React.createElement("div", {className: "percent-indigenous-layer-list"}, 
					React.createElement(LayerList, {class: "percent-indigenous-tree", activeTab: this.props.activeTab, data: MapConfig.percentIndigenousLayersCombined, change: this.changePercentIndigenousLayer, layerActive: this.state.active}), 
					React.createElement(PercentLegend, {legendObject: legendObject})
				)
    	);
    }
    /* jshint ignore:end */

	});

	return PercentOfCountryList;

});
