/** @jsx React.DOM */
define([
	'react',
	'map/MapConfig',
	'map/LayerController',
  'components/IndicatorsLegend',
], function (React, MapConfig, LayerController, IndicatorsLegend) {
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


			return (
				<div className={'national-layer-list-item ' + (active ? 'active' : '') + (subTitle ? 'subTitle' : '') + (subLayer ? 'subLayer' : '') + (comingSoon ? ' comingSoon' : '')} key={item.id} onClick={layer != undefined && !comingSoon ? this.setActiveLayer.bind(this, item.id, item.layer) : null}>
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

	var IndicatorsOfLegalSecurityList = React.createClass({

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
      this.setState({active: LandTenure});
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


    	// Update the currentLayer in brApp, Our popup needs to know the selection so it can format the content correctly


    	// The true signifies that this is the national layer being updated
    	LayerController.updateVisibleLayers(visibleLayers, true);

    },

    changeLandTenureCategory: function (evt) {
    	this.setState({
    		landTenureCategory: evt.target.id
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

    /* jshint ignore:start */
    render: function () {

      var legendObject = {
        name: 'landTenure',
        layerIdValue: 0
      }

    	return (
    		<div className='national-level-layer-lists'>
    			<div className='land-tenure-layer-list'>
							 <div className='land-tenure-menu-explanation'>Choose Indicators for Indigenous or Community land:</div>

    					 <div className='land-tenure-menu-controls'>
    					   <span id={LandTenureInd} onClick={this.changeLandTenureCategory}
    					   			 className={'land-tenure-menu-button ' + (this.state.landTenureCategory === LandTenureInd ? 'active' : '')}
    					   >Indigenous</span>
    					   <span id={LandTenureCom} onClick={this.changeLandTenureCategory}
    					   			 className={'land-tenure-menu-button ' + (this.state.landTenureCategory === LandTenureCom ? 'active' : '')}
    					   >Community</span>
    					 </div>

               <IndicatorsLegend openTab={this.props.openTab} legendObject={legendObject} />

    					 <div className={'indigenous-national-list' + (this.state.landTenureCategory === LandTenureInd ? '' : ' hidden')}>
    					   <LayerList data={MapConfig.landTenureIndigenousLayers} change={this.changeLandTenureLayer} />
    					 </div>

    					 <div className={'community-national-list' + (this.state.landTenureCategory === LandTenureCom ? '' : ' hidden')}>
    					   <LayerList data={MapConfig.landTenureCommunityLayers} change={this.changeLandTenureLayer} />
    					 </div>

    			</div>
    		</div>
    	);
    }
    /* jshint ignore:end */

	});

	return IndicatorsOfLegalSecurityList;

});
