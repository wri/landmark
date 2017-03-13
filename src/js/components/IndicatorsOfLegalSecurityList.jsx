/** @jsx React.DOM */
define([
	'react',
	'map/MapConfig',
	'map/LayerController',
  'components/IndicatorsLegend',
	'components/LayerList'
], function (React, MapConfig, LayerController, IndicatorsLegend, LayerList) {


	// CONSTANTS
	var LandTenureInd = 'land-tenure-indigenous';
	var LandTenureCom = 'land-tenure-community';
	var LandTenure = 'land-tenure';
	var PercentIndigenous = 'percent-indigenous';

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
        active: 'none',
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
			brApp.activeKey = 'initialIndicator';
    	brApp.currentLayer = (
    		this.state.landTenureCategory === LandTenureInd ?
    			this.state.activeIndigenousKey :
    			this.state.activeCommunityKey
    	);
      this.setState({active: LandTenure});
			this.props.setActiveTab(this.props.activeSelection)
    },

    componentDidUpdate: function (prevProps, prevState) {
    	var visibleLayers,
    			state = this.state;

    	switch (state.active) {
    		case 'none':
    			visibleLayers = [-1];
    			break;
    		case LandTenure:
					if (this.state.landTenureCategory === LandTenureInd) {
						if (this.state.activeIndigenousKey === "averageScoreTenure") {
							visibleLayers = [2];
						} else if (this.state.activeIndigenousKey === 'none') {
							visibleLayers = [-1];
						} else {
							visibleLayers = [3];
						}
					} else {
						if (this.state.activeCommunityKey === "averageScoreTenure") {
							visibleLayers = [0];
						} else if (this.state.activeCommunityKey === 'none') {
							visibleLayers = [-1];
						} else {
							visibleLayers = [1];
						}

					}

          if (this.props.activeTab === PercentIndigenous) {
            visibleLayers = [-1];
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
			if (layer !== -1) {
				this.props.setActiveTab(this.props.activeSelection);
			}
    	// If layer === 0, update Active Community Key, else, update Active Indigenous Key
    	if (layer === 0 || layer === 1) {
				this.setState({
	    		activeCommunityKey: key,
					active: LandTenure
	    	});
    	} else {
				this.setState({
	    		activeIndigenousKey: key,
					active: LandTenure
	    	});
    	}

    },

    /* jshint ignore:start */
    render: function () {
			var layerIdValue;
			if (this.state.activeIndigenousKey === 'averageScoreTenure' && this.state.landTenureCategory === 'land-tenure-indigenous') {
				layerIdValue = 0;
			} else if (this.state.activeCommunityKey === 'averageScoreTenure' && this.state.landTenureCategory === 'land-tenure-community') {
				layerIdValue = 0;
			} else {
				layerIdValue = 1;
			}
      var legendObject = {
        name: 'landTenure',
        layerIdValue: layerIdValue
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

               <IndicatorsLegend legendObject={legendObject} />

    					 <div className={'indigenous-national-list' + (this.state.landTenureCategory === LandTenureInd ? '' : ' hidden')}>
    					   <LayerList activeTab={this.props.activeTab} setActiveTab={this.props.setActiveTab} data={MapConfig.landTenureIndigenousLayers} change={this.changeLandTenureLayer} layerActive={this.state.active} />
    					 </div>

    					 <div className={'community-national-list' + (this.state.landTenureCategory === LandTenureCom ? '' : ' hidden')}>
    					   <LayerList activeTab={this.props.activeTab} setActiveTab={this.props.setActiveTab} data={MapConfig.landTenureCommunityLayers} change={this.changeLandTenureLayer} layerActive={this.state.active} />
    					 </div>

    			</div>
    		</div>
    	);
    }
    /* jshint ignore:end */

	});

	return IndicatorsOfLegalSecurityList;

});
