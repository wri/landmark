/** @jsx React.DOM */
define([
  'react',
  'dojo/topic',
  'map/MapConfig'
], function (React, topic, MapConfig) {
  'use strict';

  var LayerGroup = React.createClass({displayName: "LayerGroup",

    getInitialState: function () {
      var visLayersInfo = this.dataGrabber();

      return {
        layerInfos: brApp.layerInfos,
        visibleLayersInfo: visLayersInfo,
        map: brApp.map,
        active: true
       };

    },
    componentDidMount: function() {
      topic.subscribe('refresh-legend', this.handleMapUpdate);
    },

    handleMapUpdate: function() {

      var visLayersInfo = this.dataGrabber();

      this.setState({
				'visibleLayersInfo': visLayersInfo
			});

    },

    render: function () {

      return (
				React.createElement("div", {className: "legend-container"}, 
          this.state.visibleLayersInfo.map(this.dataMapper, this)
				)
			);

		},

    dataMapper: function (item, index) {

      //todo: I need a way to sort theese layers by group, so all of the officiallyRecognized
      // layers go together, but do this in a way where sorting by Family takes precedence;
      // so sort by family, and then intra-family by group
      var layersToRender = [];

      for (var k = 0; k < item.layers.length; k++) {
        if (item.visibleLayers.indexOf(item.layers[k].layerId) > -1) {
          //todo: the above if statement doesnt work with landTenure (& prolly & either!)
          //item.layers[k].layerId doesnt match with the visibleLayer in there!

          var legendItem = {};

          legendItem.group = item.group;
          legendItem.layerName = item.layers[k].layerName;
          legendItem.layerId = item.layers[k].layerId;
          legendItem.legend = item.layers[k].legend;

          if (item.layer.indexOf('indigenous') > -1) {
            legendItem.family = 'Indigenous Lands';
          } else if (item.layer.indexOf('community') > -1) {
            legendItem.family = 'Community Lands';
          } else if (item.layer === 'percentLands') {
            //if (legendItem.layerId < 4) { //this is for percentLands group!
            legendItem.family = 'Percent of Indigenous & Community Lands';
            //}
          } else if (item.layer === 'landTenure') {
            // debugger
            //todo: how to differentiate landTenure group: indig vs comm?
            legendItem.family = 'Indicators of Land Tenure Security';
          } else {
            debugger
          }

          // if (legendItem.family == 'Indicators of Land Tenure Security') {
          //   debugger
          // }

          if ((legendItem.group === "Formally recognized" || legendItem.group === "Not formally recognized") && legendItem.layerId === 0) {
            //do nothing
          } else {
            layersToRender.push(legendItem);
          }
        }
      }

      for (var m = 0; m < layersToRender.length; m++) {

        if (layersToRender[m].family === brApp.previousFamily && (layersToRender[m].family === 'Indigenous Lands' || layersToRender[m].family === 'Community Lands')) {
          layersToRender[m].family = '';
        } else {
          brApp.previousFamily = layersToRender[m].family;
        }
      } //todo: this logic isn't working if its just One layer on

      // layersToRender.sort(function(a, b) {
      //   return localeCompare(a.group) - localeCompare(b.group);
      // });

			return (
				React.createElement("div", {className: "layer-group"}, 
          layersToRender.map(function(layer) {

            return (
              React.createElement("div", null, 
                
                  layer.family ?
                  React.createElement("div", {className: "legend-item-family"}, layer.family) :
                  null, 
                
                React.createElement("div", {className: "legend-item-group"}, layer.group), 
                  layer.legend.map(function(legendObject, i){

                    return React.createElement("div", {className: "legend-item-name"}, React.createElement("img", {className: "legend-item-img", src: 'data:image/png;base64,'+legendObject.imageData}), legendObject.label)
                  })

              )
            )
          })
				)
			);
		},

    dataGrabber: function() {
      var visLayersInfo = [];

      for (var i = 0; i < brApp.layerInfos.length; i++) {
        var mapLayer = brApp.map.getLayer(brApp.layerInfos[i].layerId);
        if (mapLayer.visible === true && mapLayer.visibleLayers.length > 0 && mapLayer.visibleLayers[0] !== -1) {

          var group, layer, visibleLayers;

          if (mapLayer.id.indexOf('indigenous') > -1) {
            if (mapLayer.id.indexOf('Occupied') > -1 || mapLayer.id.indexOf('FormalClaim') > -1) {
              group = 'Not formally recognized';
              layer = mapLayer.id;
              visibleLayers = mapLayer.visibleLayers;
            } else {
              group = 'Formally recognized';
              layer = mapLayer.id;
              visibleLayers = mapLayer.visibleLayers;
            }
          } else if (mapLayer.id.indexOf('community') > -1) {
            if (mapLayer.id.indexOf('Occupied') > -1 || mapLayer.id.indexOf('FormalClaim') > -1) {
              group = 'Not formally recognized';
              layer = mapLayer.id;
              visibleLayers = mapLayer.visibleLayers;
            } else {
              group = 'Formally recognized';
              layer = mapLayer.id;
              visibleLayers = mapLayer.visibleLayers;
            }
          } else if (mapLayer.id === 'percentLands') {

            layer = mapLayer.id;
            visibleLayers = mapLayer.visibleLayers;

            switch (visibleLayers[0]) {
              case 1:
                  group = 'Indigenous and Community Lands - Total';
                  break;
              case 2:
                  group = 'Indigenous and Community Lands - Formally recognized';
                  break;
              case 3:
                  group = 'Indigenous and Community Lands - Not formally recognized';
                  break;
              case 5:
                  group = 'Indigenous Lands (only) - Total';
                  break;
              case 6:
                  group = 'Indigenous Lands (only) - Formally recognized';
                  break;
              case 7:
                  group = 'Indigenous Lands (only) - Not formally recognized';
                  break;
              case 9:
                  group = 'Community Lands (only) - Total';
                  break;
              case 10:
                  group = 'Community Lands (only) - Formally recognized';
                  break;
              case 11:
                  group = 'Community Lands (only) - Not formally recognized';
                  break;
            }
          } else if (mapLayer.id === 'landTenure') {
            

            //todo: the community tab of LandTenure's average score does nothing!!!!

            layer = mapLayer.id;
            visibleLayers = mapLayer.visibleLayers;
            if (visibleLayers[0] === 0 || visibleLayers[0] === 1) {
              group = 'Indicators of the Legal Security of Lands - Community';
            } else {
              group = 'Indicators of the Legal Security of Lands - Indigenous';
            }

          }
          brApp.layerInfos[i].data.group = group;
          brApp.layerInfos[i].data.layer = layer;
          brApp.layerInfos[i].data.visibleLayers = visibleLayers;

          if (mapLayer.id.indexOf("Tiled") > -1) {
            if (brApp.map.getZoom() > 7) {
              //do nothing
            } else {
              visLayersInfo.push(brApp.layerInfos[i].data);
            }
          } else if (mapLayer.id.indexOf('community') > -1 || mapLayer.id.indexOf('indigenous')) {
            if (brApp.map.getZoom() <= 7) {
              //do nothing
            } else {
              visLayersInfo.push(brApp.layerInfos[i].data);
            }
          } else {
            visLayersInfo.push(brApp.layerInfos[i].data);
          }

        }
      }
      return visLayersInfo;
    },

  });

  var Legend = React.createClass({displayName: "Legend",

    getInitialState: function () {
      return {
        layerInfos: [],
        visibleLayers: [],
        map: brApp.map,
        collapsed: false
       };
    },
    toggleActive: function () {
      var newCollapsed;

      if (this.state.collapsed === true) {
        newCollapsed = false;
        $("#toggleLegend").html('-');
      } else {
        newCollapsed = true;
        $("#toggleLegend").html('+');
      }

      this.setState({
        // collapsed: this.state.collapsed ? false: true
        collapsed: newCollapsed
      });
    },

    toggleLayer: function () {
      this.setState({
        activeTab: (this.state.activeTab === 'community' ? 'national' : 'community')
      });
    },

    render: function () {
      return (

        React.createElement("div", {className: 'legend-component-container' + (this.state.collapsed ? ' collapsed': '')}, 
          React.createElement("div", {className: "legend-component-controls"}, 
            React.createElement("div", {className: "legend-controls"}, 
              "Legend Component", 
              React.createElement("span", {id: "toggleLegend", onClick: this.toggleActive}, "-")
            )

          ), 
          React.createElement("div", {className: 'legend-component-content' + (this.state.collapsed ? ' collapsed': '')}, 
              React.createElement(LayerGroup, null)
          )
        )
      );
    }

  });

  return function (node) {
    return React.render(React.createElement(Legend, null), document.getElementById(node));
  };

});
