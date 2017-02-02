/** @jsx React.DOM */
define([
  'react',
  'dojo/topic',
  'map/MapConfig'
], function (React, topic, MapConfig) {
  'use strict';


  var IndicatorsLegend = React.createClass({

    getInitialState: function () {
      return {
        legendInfos: []
       };
    },

    componentDidMount: function () {
      var self = this;
      var mapLayer;
      function isLandTenure(element, index, array) {
        if (element.layerId === self.props.legendObject.name) {
          mapLayer = element.data;
          return element;
        }

      }

      if (brApp.layerInfos.some(isLandTenure)) {
        for (var j = 0; j < mapLayer.layers.length; j++) {
          if (mapLayer.layers[j].layerId === self.props.legendObject.layerIdValue) {
            this.setState({legendInfos: mapLayer.layers[j].legend});
          }
        }
      }

    },

    dataMapper: function(data) {
        if (data.label === 'Not applicable') {
          data.label = 'n/a'
        }
        return <div className='indicator-legend'>
        <div className='legend--item-image-container'>
          <img className='legend-item-img' src={'data:image/png;base64,'+data.imageData}></img>
        </div>
        <div className={'legend-item-text-container' + (data.label === 'n/a' ? ' not-app-label' : '')}>
          {data.label}
        </div>
        </div>
    },

    render: function () {
      // <span className='best-text-indicator'>
      //   BEST
      // </span>
      // <span className='worst-text-indicator'>
      //   WORST
      // </span>
      return (

        <div className={'legend-component-container'}>
          {this.state.legendInfos.length === 0 ? null :
            <div id='legend-component-content' className='legend-component-content'>
              <div className='legend-container'>
                {this.state.legendInfos.map(this.dataMapper, this)}
              </div>
            </div>
          }
        </div>
      );
    }

  });

  return IndicatorsLegend;

});
