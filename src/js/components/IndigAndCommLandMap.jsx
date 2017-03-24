/** @jsx React.DOM */
define([
	'react',
	'map/MapConfig',
	'map/LayerController'
], function (React, MapConfig, LayerController) {
	

	var IndigAndCommLandMap = React.createClass({
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
    		<div className='national-level-layer-lists'>
    			<div className='land-tenure-layer-list'>
            <div className={'national-layer-selection-label'}>
              <div className='community-layer-type'>
                <div className='community-layer-type-label' id='indigenousLands'><span className={'indig-land-parent ' + (visibleIndigenousLands > 0 ? 'parent-layer-checked-true' : 'parent-layer-checked-false')} onClick={this.props.parentClicked}></span>Indigenous Lands - traditional or customary rights<span id='indigenous-lands-help' className='parent-layer-help' onClick={this.props.showHelp}></span></div>
                {this.props.data.map(this.props.layerMapper('indigenousLands'), this)}
              </div>
              <div className='national-layer-selection-label'>
                <div className='community-layer-type-label' id='communityLands'><span className={'comm-land-parent ' + (visibleCommunityLands > 0 ? 'parent-layer-checked-true' : 'parent-layer-checked-false')} onClick={this.props.parentClicked}></span>Community Lands - traditional or customary rights<span id='community-lands-help' className='parent-layer-help' onClick={this.props.showHelp}></span></div>
                {this.props.data.map(this.props.layerMapper('communityLands'), this)}
              </div>
            </div>
    		  </div>
        </div>
    	);
    }
    /* jshint ignore:end */

	});

	return IndigAndCommLandMap;

});
