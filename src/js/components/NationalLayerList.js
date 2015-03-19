/** @jsx React.DOM */
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
	var LayerList = React.createClass({displayName: "LayerList",

		getInitialState: function () {
			return {
				active: this.props.data[0].id
			};
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

			return (
				React.createElement("div", {className: 'national-layer-list-item ' + (active ? 'active' : ''), 
					key: item.id, 
					onClick: this.setActiveLayer.bind(this, item.id, item.layer)
				}, 
					React.createElement("div", {className: "national-layer-list-item-label"}, item.label), 
					
						item.question ?
						React.createElement("div", {className: "national-layer-list-item-question"}, item.question) :
						null
					
				)
			);
		},
		/* jshint ignore:end */
		setActiveLayer: function (id, layer) {
			
			this.setState({
				'active': id
			});

			// Notify Parent and let parent dispatch updates
			this.props.change(layer);

		}

	});

	/**
	* Main Controlling List
	*/

	var NationalLayerList = React.createClass({displayName: "NationalLayerList",

		// If changing defaults, changing landTenureCategory to LandTenureCom requires 
		// you to change the layer as well, see below:
		// LandTenureCom needs LandTenureLayer = 0
		// LandTenureInd needs LandTenureLayer = 1
		// By Default, the first item in every list is the active
		// So activePercentIndigenousLayer = 2 represents first item, if default is changed
		// activePercentIndigenousLayer must change, 2 for first item, 3 for second, 4 for third

		getInitialState: function () {
      return {
        active: LandTenure,
        landTenureCategory: LandTenureInd,
        landTenureLayer: 1,
        activePercentIndigenousLayer: 2
      };
    },

    componentDidUpdate: function () {
    	var visibleLayers;

    	switch (this.state.active) {
    		case 'none':
    			visibleLayers = [-1];
    		break;
    		case LandTenure:
    			// If Current Category is Land Tenure Indigenous, visible layers is [1], else, its [0]
    			visibleLayers = (this.state.landTenureCategory === LandTenureInd ? [1] : [0]);
    		break;
    		case PercentIndigenous:
    			visibleLayers = [this.state.activePercentIndigenousLayer];
    		break;
    	}

    	// The true signifies that this is the national layer being updated
    	// This needs 
    	LayerController.updateVisibleLayers(visibleLayers, true);

    },

    changeLandTenureCategory: function (evt) {
    	this.setState({
    		landTenureCategory: evt.target.id
    	});
    },

    changePercentIndigenousLayer: function (layer) {
    	this.setState({
    		activePercentIndigenousLayer: layer
    	});
    },

    changeLandTenureLayer: function (layer) {
    	this.setState({
    		landTenureLayer: layer
    	});
    },

    handleRadioChange: function (evt) {
    	this.setState({
    		active: evt.target.value
    	});
    },

    /* jshint ignore:start */
    render: function () {
    	return (
    		React.createElement("div", {className: "national-level-layer-lists"}, 

    			React.createElement("div", {className: "radio-button-container"}, 
    				React.createElement("label", null, 
    					React.createElement("input", {name: "national-layer-selection", type: "radio", value: "none", onChange: this.handleRadioChange}), 
    					React.createElement("span", {className: "national-layer-selection-label"}, "None")
    				)
    			), 

    			React.createElement("div", {className: "radio-button-container"}, 
    				React.createElement("label", null, 
    					React.createElement("input", {name: "national-layer-selection", defaultChecked: true, type: "radio", value: LandTenure, onChange: this.handleRadioChange}), 
    					React.createElement("span", {className: "national-layer-selection-label"}, "Land Tenure Security Indicators, as stated by law")
    				)
    			), 

    			React.createElement("div", {className: "land-tenure-layer-list", 
    					 style: {'display': (this.state.active === LandTenure ? 'block' : 'none')}}, 
    					 
    					 React.createElement("div", {className: "land-tenure-menu-controls"}, 
    					   React.createElement("span", {id: LandTenureInd, onClick: this.changeLandTenureCategory, 
    					   			 className: 'land-tenure-menu-button ' + (this.state.landTenureCategory === LandTenureInd ? 'active' : '')
    					   }, "Indigenous"), 
    					   React.createElement("span", {id: LandTenureCom, onClick: this.changeLandTenureCategory, 
    					   			 className: 'land-tenure-menu-button ' + (this.state.landTenureCategory === LandTenureCom ? 'active' : '')
    					   }, "Community")
    					 ), 


    					 React.createElement("div", {className: (this.state.landTenureCategory === LandTenureInd ? '' : 'hidden')}, 
    					   React.createElement(LayerList, {data: MapConfig.landTenureIndigenousLayers, change: this.changeLandTenureLayer})
    					 ), 

    					 React.createElement("div", {className: (this.state.landTenureCategory === LandTenureCom ? '' : 'hidden')}, 
    					   React.createElement(LayerList, {data: MapConfig.landTenureCommunityLayers, change: this.changeLandTenureLayer})
    					 )

    			), 

    			React.createElement("div", {className: "radio-button-container"}, 
    				React.createElement("label", null, 
    					React.createElement("input", {name: "national-layer-selection", type: "radio", value: PercentIndigenous, onChange: this.handleRadioChange}), 
    					React.createElement("span", {className: "national-layer-selection-label"}, "Percent of Indigenous and Community Lands")
    				)
    			), 

    			React.createElement("div", {className: "percent-indigenous-layer-list", 
    					 style: {'display': (this.state.active === PercentIndigenous ? 'block' : 'none')}}, 
    					 React.createElement(LayerList, {data: MapConfig.percentIndigenousLayers, change: this.changePercentIndigenousLayer})
    			)

    		)
    	);
    }
    /* jshint ignore:end */

	});

	/* jshint ignore:start */
	return function (node) {
    return React.render(React.createElement(NationalLayerList, null), document.getElementById(node));
  }
  /* jshint ignore:end */

});