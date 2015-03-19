/** @jsx React.DOM */
define([
	'react',
	'map/MapConfig'
], function (React, MapConfig) {
	'use strict';

	// CONSTANTS
	var LandTenureInd = 'land-tenure-indigenous';
	var LandTenureCom = 'land-tenure-community';

	// Small Sub Class to render the lists, needs to keep track of active list item
	// Shows Question onClick
	/** Requirements: 
		data: array of data
		each item in the array must have id, label, and question properties
	*/
	var LayerList = React.createClass({displayName: "LayerList",
		/* jshint ignore:start */
		render: function () {
			return (
				React.createElement("div", {className: this.props.class || 'national-level-layer-list'}, 
					this.props.data.map(this.dataMapper, this)
				)
			);
		},

		dataMapper: function (item, index) {
			return (
				React.createElement("div", {className: "national-layer-list-item", key: index + ':' + item.id}, 
					React.createElement("div", {className: "national-layer-list-item-label"}, item.label), 
					React.createElement("div", {className: ""}, item.question)
				)
			);
		}
		/* jshint ignore:end */

	});

	var NationalLayerList = React.createClass({displayName: "NationalLayerList",

		getInitialState: function () {
      return {
        active: 'land-tenure',
        landTenureCategory: LandTenureInd
      };
    },

    handleChange: function (evt) {
    	this.setState({
    		active: evt.target.value
    	});
    },

    changeLandTenureCategory: function (evt) {
    	this.setState({
    		landTenureCategory: evt.target.id
    	});
    },

    /* jshint ignore:start */
    render: function () {
    	return (
    		React.createElement("div", {className: "national-level-layer-lists"}, 
    			React.createElement("div", {className: "radio-button-container"}, 
    				React.createElement("label", null, 
    					React.createElement("input", {name: "national-layer-selection", type: "radio", value: "none", onChange: this.handleChange}), 
    					React.createElement("span", {className: "national-layer-selection-label"}, "None")
    				)
    			), 
    			React.createElement("div", {className: "radio-button-container"}, 
    				React.createElement("label", null, 
    					React.createElement("input", {name: "national-layer-selection", defaultChecked: true, type: "radio", value: "land-tenure", onChange: this.handleChange}), 
    					React.createElement("span", {className: "national-layer-selection-label"}, "Land Tenure Security Indicators, as stated by law")
    				)
    			), 
    			React.createElement("div", {className: "land-tenure-layer-list", 
    					 style: {'display': (this.state.active === 'land-tenure' ? 'block' : 'none')}}, 
    					 React.createElement("div", {className: "land-tenure-menu-controls"}, 
    					   React.createElement("span", {id: LandTenureInd, onClick: this.changeLandTenureCategory, 
    					   			 className: 'land-tenure-menu-button ' + (this.state.landTenureCategory === LandTenureInd ? 'active' : '')
    					   }, "Indigenous"), 
    					   React.createElement("span", {id: LandTenureCom, onClick: this.changeLandTenureCategory, 
    					   			 className: 'land-tenure-menu-button ' + (this.state.landTenureCategory === LandTenureCom ? 'active' : '')
    					   }, "Community")
    					 ), 
    					 React.createElement("div", {className: (this.state.landTenureCategory === LandTenureInd ? '' : 'hidden')}, 
    					   React.createElement(LayerList, {data: MapConfig.landTenureIndigenousLayers})
    					 ), 
    					 React.createElement("div", {className: (this.state.landTenureCategory === LandTenureCom ? '' : 'hidden')}, 
    					   React.createElement(LayerList, {data: MapConfig.landTenureCommunityLayers})
    					 )
    			), 
    			React.createElement("div", {className: "radio-button-container"}, 
    				React.createElement("label", null, 
    					React.createElement("input", {name: "national-layer-selection", type: "radio", value: "percent-indigenous", onChange: this.handleChange}), 
    					React.createElement("span", {className: "national-layer-selection-label"}, "Percent of Indigenous and Community Lands")
    				)
    			), 
    			React.createElement("div", {className: "percent-indigenous-layer-list", 
    					 style: {'display': (this.state.active === 'percent-indigenous' ? 'block' : 'none')}}, 
    					 "Percent Indigenous"
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