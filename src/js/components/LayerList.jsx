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
  	var LayerList = React.createClass({

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
  				<div className={this.props.class || 'national-level-layer-list'}>
  					{this.props.data.map(this.dataMapper, this)}
  				</div>
  			);
  		},

  		dataMapper: function (item, index) {

  			var active = (this.state.active === item.id);
  			var subTitle = item.subTitle;
  			var subLayer = item.subLayer;
  			var layer = item.layer;
  			var comingSoon = item.comingSoon;
				// var removeClass = this.props.class === 'percent-indigenous-tree' ? 'close-active-layer-prop' : 'close-active-layer-indicator'

				// <div className={'national-layer-list-item ' + (active ? 'active' : '') + (subTitle ? 'subTitle' : '') + (subLayer ? 'subLayer' : '') + (comingSoon ? ' comingSoon' : '')} key={item.id} onClick={layer != undefined && !comingSoon ? this.setActiveLayer.bind(this, item.id, item.layer) : null}>
				// <div className='national-layer-list-item-label' onClick={layer != undefined && !comingSoon ? this.setActiveLayer.bind(this, item.id, item.layer) : null}>{item.label}</div>
  			return (
  				<div className={'national-layer-list-item ' + (comingSoon ? ' comingSoon' : '')} key={item.id} >
  					<div className={'national-layer-list-item-label ' + (active && this.props.layerActive != 'none' ? 'active' : '') + (subTitle ? 'subTitle' : '') + (subLayer ? 'subLayer' : '') } onClick={layer != undefined && !comingSoon ? this.setActiveLayer.bind(this, item.id, item.layer) : null}>{item.label}</div>
  					{
  						item.question ?
  						<div className={'national-layer-list-item-question' + (active && this.props.layerActive != 'none' ? 'question-visible' : '' )}>{item.question}</div> :
  						null
  					}
  				</div>
  			);
  		},
  		/* jshint ignore:end */
  		setActiveLayer: function (key, layer) {
  			this.setState({
  				'active': key
  			});

  			// Notify Parent and let parent dispatch updates
  			this.props.change(key, layer);

  		},

			removeLayer: function () {
				console.log('removed');
			}

  	});

		return LayerList;

  });
