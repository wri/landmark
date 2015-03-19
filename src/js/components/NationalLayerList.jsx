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
	var LayerList = React.createClass({
		/* jshint ignore:start */
		render: function () {
			return (
				<div className={this.props.class || 'national-level-layer-list'}>
					{this.props.data.map(this.dataMapper, this)}
				</div>
			);
		},

		dataMapper: function (item, index) {
			return (
				<div className='national-layer-list-item' key={index + ':' + item.id}>
					<div className='national-layer-list-item-label'>{item.label}</div>
					<div className=''>{item.question}</div>
				</div>
			);
		}
		/* jshint ignore:end */

	});

	var NationalLayerList = React.createClass({

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
    		<div className='national-level-layer-lists'>
    			<div className='radio-button-container'>
    				<label>
    					<input name='national-layer-selection' type='radio' value='none' onChange={this.handleChange} />
    					<span className='national-layer-selection-label'>None</span>
    				</label>
    			</div>
    			<div className='radio-button-container'>
    				<label>
    					<input name='national-layer-selection' defaultChecked={true} type='radio' value='land-tenure' onChange={this.handleChange} />
    					<span className='national-layer-selection-label'>Land Tenure Security Indicators, as stated by law</span>
    				</label>
    			</div>
    			<div className='land-tenure-layer-list' 
    					 style={{'display': (this.state.active === 'land-tenure' ? 'block' : 'none')}}>
    					 <div className='land-tenure-menu-controls'>
    					   <span id={LandTenureInd} onClick={this.changeLandTenureCategory}
    					   			 className={'land-tenure-menu-button ' + (this.state.landTenureCategory === LandTenureInd ? 'active' : '')}
    					   >Indigenous</span>
    					   <span id={LandTenureCom} onClick={this.changeLandTenureCategory}
    					   			 className={'land-tenure-menu-button ' + (this.state.landTenureCategory === LandTenureCom ? 'active' : '')}
    					   >Community</span>
    					 </div>
    					 <div className={(this.state.landTenureCategory === LandTenureInd ? '' : 'hidden')}>
    					   <LayerList data={MapConfig.landTenureIndigenousLayers} />
    					 </div>
    					 <div className={(this.state.landTenureCategory === LandTenureCom ? '' : 'hidden')}>
    					   <LayerList data={MapConfig.landTenureCommunityLayers} />
    					 </div>
    			</div>
    			<div className='radio-button-container'>
    				<label>
    					<input name='national-layer-selection' type='radio' value='percent-indigenous' onChange={this.handleChange} />
    					<span className='national-layer-selection-label'>Percent of Indigenous and Community Lands</span>
    				</label>
    			</div>
    			<div className='percent-indigenous-layer-list' 
    					 style={{'display': (this.state.active === 'percent-indigenous' ? 'block' : 'none')}}>
    					 Percent Indigenous
    			</div>
    		</div>
    	);
    }
    /* jshint ignore:end */

	});

	/* jshint ignore:start */
	return function (node) {
    return React.render(<NationalLayerList />, document.getElementById(node));
  }
  /* jshint ignore:end */

});