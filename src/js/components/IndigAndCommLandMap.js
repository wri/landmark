/** @jsx React.DOM */
define([
	'react',
	'map/MapConfig',
	'map/LayerController'
], function (React, MapConfig, LayerController) {
	

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

			var visibleIndigenousLands = 0;
			var visibleCommunityLands = 0;

			MapConfig.communityLevelLayers.forEach(function(layer) {
				if (layer.id) {
					var mapLayer = brApp.map.getLayer(layer.id);
					if (mapLayer.visible && layer.group === 'communityLands') {
						visibleCommunityLands += 1
					} else if (mapLayer.visible && layer.group === 'indigenousLands') {
						visibleIndigenousLands += 1
					}
				}
			})

    	return (
    		React.createElement("div", {className: "national-level-layer-lists"}, 
    			React.createElement("div", {className: "land-tenure-layer-list"}, 
            React.createElement("div", {className: 'national-layer-selection-label'}, 
              React.createElement("div", {className: "community-layer-type"}, 
                React.createElement("div", {className: "community-layer-type-label", id: "indigenousLands"}, React.createElement("span", {className: 'indig-land-parent ' + (visibleIndigenousLands > 0 ? 'parent-layer-checked-true' : 'parent-layer-checked-false'), onClick: this.props.parentClicked}), "Indigenous Lands - traditional or customary rights", React.createElement("span", {id: "indigenous-lands-help", className: "parent-layer-help", onClick: this.props.showHelp})), 
                this.props.data.map(this.props.layerMapper('indigenousLands'), this)
              ), 
              React.createElement("div", {className: "national-layer-selection-label"}, 
                React.createElement("div", {className: "community-layer-type-label", id: "communityLands"}, React.createElement("span", {className: 'comm-land-parent ' + (visibleCommunityLands > 0 ? 'parent-layer-checked-true' : 'parent-layer-checked-false'), onClick: this.props.parentClicked}), "Community Lands - traditional or customary rights", React.createElement("span", {id: "community-lands-help", className: "parent-layer-help", onClick: this.props.showHelp})), 
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
