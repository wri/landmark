/** @jsx React.DOM */
define([
	'react',
	'map/MapConfig',
	'map/LayerController'
], function (React, MapConfig, LayerController) {
	'use strict';

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

    	return (
    		<div className='national-level-layer-lists'>
    			<div className='land-tenure-layer-list'>
            <div className={'national-layer-selection-label' + (this.props.openTab ? '': ' hidden')}>
              <div className='community-layer-type'>
                <div className='community-layer-type-label' id='indigenousLands'><span className='parent-layer-checked-true' onClick={this.props.parentClicked}></span>Indigenous Lands<span id='indigenous-lands-help' className='parent-layer-help' onClick={this.props.showHelp}></span></div>
                {this.props.data.map(this.props.layerMapper('indigenousLands'), this)}
              </div>
              <div className='national-layer-selection-label'>
                <div className='community-layer-type-label' id='communityLands'><span className='parent-layer-checked-true' onClick={this.props.parentClicked}></span>Community Lands<span id='community-lands-help' className='parent-layer-help' onClick={this.props.showHelp}></span></div>
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
