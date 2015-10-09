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
				React.createElement("div", {className: 'national-layer-list-item ' + (active ? 'active' : ''), key: item.id, onClick: this.setActiveLayer.bind(this, item.id, item.layer)}, 
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

	var NationalLayerList = React.createClass({displayName: "NationalLayerList",

		// If changing defaults, changing landTenureCategory to LandTenureCom requires
		// you to change the layer as well, see below:
		// LandTenureCom needs LandTenureLayer = 0
		// LandTenureInd needs LandTenureLayer = 2
		// By Default, the first item in every list is the active
		// So activePercentIndigenousLayer = 2 represents first item, if default is changed
		// activePercentIndigenousLayer must change, 2 for first item, 3 for second, 4 for third

	getInitialState: function () {
      return {
        active: "none",
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
    			// If Current Category is Land Tenure Indigenous, visible layers is [0], else, its [2]
    			visibleLayers = (this.state.landTenureCategory === LandTenureInd ? [0] : [2]);
    		break;
    		case PercentIndigenous:
    			visibleLayers = [state.activePercentIndigenousLayer];
    		break;
    	}

    	// Update the currentLayer in brApp, Our popup needs to know the selection so it can format the content correctly
    	brApp.currentLayer = (state.landTenureCategory === LandTenureInd ? state.activeIndigenousKey : state.activeCommunityKey);

    	// The true signifies that this is the national layer being updated
    	LayerController.updateVisibleLayers(visibleLayers, true);

    },

    changeLandTenureCategory: function (evt) {
    	this.setState({
    		landTenureCategory: evt.target.id
    	});
    },

    changePercentIndigenousLayer: function (key, layer) {
    	this.setState({
    		activePercentIndigenousLayer: layer
    	});
    },

    changeLandTenureLayer: function (key, layer) {
    	var newState = {
    		landTenureLayer: layer
    	};

    	// If layer === 0, update Active Community Key, else, update Active Indigenous Key
    	if (layer === 0) {
    		newState.activeCommunityKey = key;
    	} else {
    		newState.activeIndigenousKey = key;
    	}

    	this.setState(newState);

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
                        React.createElement("input", {
                            name: "national-layer-selection", 
                            type: "radio", 
                            value: PercentIndigenous, 
                            checked: this.state.active === PercentIndigenous, 
                            onChange: this.handleRadioChange}), 
                        React.createElement("span", {className: "national-layer-selection-label"}, "Percent of Indigenous and Community Lands")
                    )
                ), 

                React.createElement("div", {className: "percent-indigenous-layer-list", 
                         style: {'display': (this.state.active === PercentIndigenous ? 'block' : 'none')}}, 
                         React.createElement(LayerList, {data: MapConfig.percentIndigenousLayers, change: this.changePercentIndigenousLayer})
                ), 

    			React.createElement("div", {className: "radio-button-container"}, 
    				React.createElement("label", null, 
    					React.createElement("input", {
                            name: "national-layer-selection", 
                            type: "radio", 
                            value: LandTenure, 
                            checked: this.state.active === LandTenure, 
                            onChange: this.handleRadioChange}), 
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
                        React.createElement("input", {
                            id: "nationalLevelNone", 
                            name: "national-layer-selection", 
                            type: "radio", defaultChecked: true, 
                            value: "none", 
                            checked: this.state.active === 'none', 
                            onChange: this.handleRadioChange}), 
                        React.createElement("span", {className: "national-layer-selection-label"}, "None")
                    )
                )



    		)
    	);
    }
    /* jshint ignore:end */

	});

	return NationalLayerList;

});
