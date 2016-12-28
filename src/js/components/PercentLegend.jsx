/** @jsx React.DOM */
define([
  'react',
  'dojo/topic',
  'map/MapConfig'
], function (React, topic, MapConfig) {
  'use strict';


  var PercentLegend = React.createClass({

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

    componentDidUpdate: function (prevProps, prevState) {

      if (this.props.legendObject.layerIdValue === prevProps.legendObject.layerIdValue) {
        return;
      }
      var self = this;
      var mapLayer;
      var element = brApp.layerInfos;
      console.log(element.length);
      for (var i = 0; i < element.length; i++) {
        if (element[i].layerId === self.props.legendObject.name) {
          mapLayer = element[i].data;
          for (var k = 0; k < mapLayer.layers.length; k++) {
            if (mapLayer.layers[k].layerId === self.props.legendObject.layerIdValue) {
              self.setState({legendInfos: mapLayer.layers[k].legend});
            }
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
        <div className={'percent-legend-text-container' + (data.label === '0%' || data.label === '0.1-5%' || data.label === '5.1-20%' ? ' not-app-label' : '')}>
          {data.label}
        </div>
        </div>
    },

    render: function () {
      // <span className='best-text'>
      //   BEST
      // </span>
      // <span className='worst-text'>
      //   WORST
      // </span>
      return (

        <div className={'legend-component-container percent-legend-component-container' + (this.props.openTab ? '' : ' hidden')}>
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

  return PercentLegend;

});
