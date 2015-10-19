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


			return (
				React.createElement("div", {className: 'national-layer-list-item ' + (active ? 'active' : '') + (subTitle ? 'subTitle' : '') + (subLayer ? 'subLayer' : ''), key: item.id, onClick: layer ? this.setActiveLayer.bind(this, item.id, item.layer) : null}, 
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
					// debugger
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

    changeLandTenureCategory: function (evt) {
    	this.setState({
    		landTenureCategory: evt.target.id
    	});
    },

    changePercentIndigenousLayer: function (key, layer) {
			if (!layer) {
				return;
			}
    	this.setState({
    		activePercentIndigenousLayer: layer
    	});
    },

    changeLandTenureLayer: function (key, layer) {
    	// If layer === 0, update Active Community Key, else, update Active Indigenous Key
    	if (layer === 0 || layer === 1) {
				this.setState({
	    		activeCommunityKey: key
	    	});
    	} else {
				this.setState({
	    		activeIndigenousKey: key
	    	});
    	}

    },

    handleRadioChange: function (evt) {
			var value = evt.target.getAttribute('value');
    	this.setState({
    		active: value
    	});
    },

    /* jshint ignore:start */
    render: function () {
//<LayerList class='percent-indigenous-tree' data={MapConfig.percentIndigenousLayersCombined} change={this.changePercentIndigenousLayer} />
//<LayerList class='percent-indigenous-tree' data={MapConfig.percentIndigenousLayersCombined} change={this.layer ? this.changePercentIndigenousLayer : ''} />

    	return (
    		React.createElement("div", {className: "national-level-layer-lists"}, 

                React.createElement("div", {className: "radio-button-container"}, 
                    React.createElement("label", null, 
                        React.createElement("span", {
														id: "nationalLevelPercent", 
                            name: "national-layer-selection", 
                            type: "radio", 
                            value: PercentIndigenous, 
														className: this.state.active === PercentIndigenous ? 'checked' : 'unchecked', 
                            checked: this.state.active === PercentIndigenous, 
                            onClick: this.handleRadioChange}), 
                        React.createElement("span", {className: "national-layer-selection-label"}, "Percent of Indigenous and Community Lands")
                    )
                ), 

                React.createElement("div", {className: "percent-indigenous-layer-list", 
                         style: {'display': (this.state.active === PercentIndigenous ? 'block' : 'none')}}, 

												 React.createElement(LayerList, {class: "percent-indigenous-tree", data: MapConfig.percentIndigenousLayersCombined, change: this.changePercentIndigenousLayer})

                ), 

    			React.createElement("div", {className: "radio-button-container"}, 
    				React.createElement("label", null, 
    					React.createElement("span", {
									id: "nationalLevelIndicators", 
                  name: "national-layer-selection", 
                  type: "radio", 
                  value: LandTenure, 
									className: this.state.active === LandTenure ? 'checked' : 'unchecked', 
                  checked: this.state.active === LandTenure, 
                  onClick: this.handleRadioChange}), 
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
                        React.createElement("span", {
                            id: "nationalLevelNone", 
                            name: "national-layer-selection", 
                            type: "radio", defaultChecked: true, 
                            value: "none", 
														className: this.state.active === 'none' ? 'checked' : 'unchecked', 
                            checked: this.state.active === 'none', 
                            onClick: this.handleRadioChange}), 
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
