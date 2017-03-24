/** @jsx React.DOM */
define([
  'react',
  'dojo/topic',
  'map/MapConfig'
], function (React, topic, MapConfig) {



  var IndicatorsLegend = React.createClass({displayName: "IndicatorsLegend",

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
      if (prevProps.legendObject.layerIdValue !== this.props.legendObject.layerIdValue) {
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
      }
    },

    dataMapper: function(data) {
        if (data.label === 'Not applicable') {
          data.label = 'n/a'
        }
        return React.createElement("div", {className: (this.props.legendObject.layerIdValue === 0 ? 'indicator-legend' : 'special-indicator-legend')}, 
        React.createElement("div", {className: (this.props.legendObject.layerIdValue === 0 ? 'legend--item-image-container' : 'special-legend--item-image-container')}, 
          React.createElement("img", {className: "legend-item-img", src: 'data:image/png;base64,'+data.imageData})
        ), 
        React.createElement("div", {className: (this.props.legendObject.layerIdValue === 0 ? 'legend-item-text-container' : 'special-legend-item-text-container') + (data.label === 'n/a' ? ' not-app-label' : '')}, 
          data.label
        )
        )
    },

    render: function () {

      return (

        React.createElement("div", {className: (this.props.legendObject.layerIdValue === 0 ? 'legend-component-container' : 'special-legend-component-container')}, 
          this.state.legendInfos.length === 0 ? null :
            React.createElement("div", {id: "legend-component-content", className: (this.props.legendObject.layerIdValue === 0 ? 'legend-component-content' : 'special-legend-component-content')}, 
              React.createElement("div", {className: (this.props.legendObject.layerIdValue === 0 ? 'legend-container' : 'special-legend-container')}, 
                this.state.legendInfos.map(this.dataMapper, this)
              )
            )
          
        )
      );
    }

  });

  return IndicatorsLegend;

});
