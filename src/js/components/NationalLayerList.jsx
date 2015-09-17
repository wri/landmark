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
	var LayerList = React.createClass({

		getInitialState: function () {
			return {
				active: this.props.data[0].id
			};
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

			return (
				<div className={'national-layer-list-item ' + (active ? 'active' : '')} key={item.id} onClick={this.setActiveLayer.bind(this, item.id, item.layer)}>
					<div className='national-layer-list-item-label'>{item.label}</div>
					{
						item.question ?
						<div className='national-layer-list-item-question'>{item.question}</div> :
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

		}

	});

	/**
	* Main Controlling List
	*/

	var NationalLayerList = React.createClass({

		// If changing defaults, changing landTenureCategory to LandTenureCom requires 
		// you to change the layer as well, see below:
		// LandTenureCom needs LandTenureLayer = 0
		// LandTenureInd needs LandTenureLayer = 1
		// By Default, the first item in every list is the active
		// So activePercentIndigenousLayer = 2 represents first item, if default is changed
		// activePercentIndigenousLayer must change, 2 for first item, 3 for second, 4 for third

	getInitialState: function () {
      return {
        active: "none",
        landTenureCategory: LandTenureInd,
        landTenureLayer: 1,
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
    			// If Current Category is Land Tenure Indigenous, visible layers is [0], else, its [1]
    			visibleLayers = (this.state.landTenureCategory === LandTenureInd ? [0] : [1]);
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
    		<div className='national-level-layer-lists'>	

                <div className='radio-button-container'>
                    <label>
                        <input 
                            name='national-layer-selection' 
                            type='radio' 
                            value={PercentIndigenous}
                            checked={this.state.active === PercentIndigenous}
                            onChange={this.handleRadioChange} />
                        <span className='national-layer-selection-label'>Percent of Indigenous and Community Lands</span>
                    </label>
                </div>

                <div className='percent-indigenous-layer-list' 
                         style={{'display': (this.state.active === PercentIndigenous ? 'block' : 'none')}}>
                         <LayerList data={MapConfig.percentIndigenousLayers} change={this.changePercentIndigenousLayer} />
                </div>

    			<div className='radio-button-container'>
    				<label>
    					<input 
                            name='national-layer-selection' 
                            type='radio' 
                            value={LandTenure}
                            checked={this.state.active === LandTenure}
                            onChange={this.handleRadioChange} />
    					<span className='national-layer-selection-label'>Land Tenure Security Indicators, as stated by law</span>
                        
    				</label>
    			</div>

    			

    			<div className='land-tenure-layer-list' 
    					 style={{'display': (this.state.active === LandTenure ? 'block' : 'none')}}>
    					 
    					 <div className='land-tenure-menu-controls'>
    					   <span id={LandTenureInd} onClick={this.changeLandTenureCategory}
    					   			 className={'land-tenure-menu-button ' + (this.state.landTenureCategory === LandTenureInd ? 'active' : '')}
    					   >Indigenous</span>
    					   <span id={LandTenureCom} onClick={this.changeLandTenureCategory}
    					   			 className={'land-tenure-menu-button ' + (this.state.landTenureCategory === LandTenureCom ? 'active' : '')}
    					   >Community</span>
    					 </div>


    					 <div className={(this.state.landTenureCategory === LandTenureInd ? '' : 'hidden')}>
    					   <LayerList data={MapConfig.landTenureIndigenousLayers} change={this.changeLandTenureLayer} />
    					 </div>

    					 <div className={(this.state.landTenureCategory === LandTenureCom ? '' : 'hidden')}>
    					   <LayerList data={MapConfig.landTenureCommunityLayers} change={this.changeLandTenureLayer} />
    					 </div>

    			</div>

                <div className='radio-button-container'>
                    <label>
                        <input 
                            id='nationalLevelNone' 
                            name='national-layer-selection' 
                            type='radio' defaultChecked={true} 
                            value='none'
                            checked={this.state.active === 'none'}
                            onChange={this.handleRadioChange} />
                        <span className='national-layer-selection-label'>None</span>
                    </label>
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