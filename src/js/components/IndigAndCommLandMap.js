/** @jsx React.DOM */
define([
	'react',
	'map/MapConfig',
	'map/LayerController'
], function (React, MapConfig, LayerController) {
	'use strict';

	var IndigAndCommLandMap = React.createClass({displayName: "IndigAndCommLandMap",
  //
	// getInitialState: function () {
  //
  //     return {
  //       data: ,
  //       openTab:
  //     };
  //   },

    /* jshint ignore:start */
    render: function () {

    	return (
    		React.createElement("div", {className: "national-level-layer-lists"}, 
    			React.createElement("div", {className: "land-tenure-layer-list"}, 
            React.createElement("div", {className: 'national-layer-selection-label' + (this.props.openTab ? '': ' hidden')}, 
              React.createElement("div", {className: "community-layer-type"}, 
                React.createElement("div", {className: "community-layer-type-label", id: "indigenousLands"}, React.createElement("span", {className: "parent-layer-checked-true indig-land-parent", onClick: this.props.parentClicked}), "Indigenous Lands - traditional or customary rights", React.createElement("span", {id: "indigenous-lands-help", className: "parent-layer-help", onClick: this.props.showHelp})), 
                this.props.data.map(this.props.layerMapper('indigenousLands'), this)
              ), 
              React.createElement("div", {className: "national-layer-selection-label"}, 
                React.createElement("div", {className: "community-layer-type-label", id: "communityLands"}, React.createElement("span", {className: "parent-layer-checked-true comm-land-parent", onClick: this.props.parentClicked}), "Community Lands - traditional or customary rights", React.createElement("span", {id: "community-lands-help", className: "parent-layer-help", onClick: this.props.showHelp})), 
                this.props.data.map(this.props.layerMapper('communityLands'), this)
              )
            )
    		  )
        )
    	);
    }
    /* jshint ignore:end */

	});

	return IndigAndCommLandMap;

});
