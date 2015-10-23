/** @jsx React.DOM */
define([
  'react',
  'dojo/topic',
  'map/MapConfig'
], function (React, topic, MapConfig) {
  'use strict';

  // CONSTANTS
	var LandTenureInd = 'land-tenure-indigenous';

  var LayerGroup = React.createClass({displayName: "LayerGroup",

    getInitialState: function () {
      var visLayersInfo = this.dataGrabber();


      visLayersInfo.forEach(function(layer) {
        if (layer.layer.indexOf('indigenous') > -1) {
          layer.fakeLayer = ('indigenous')
        } else if (layer.layer.indexOf('community') > -1) {
          layer.fakeLayer = ('community')
        }
      });

      this.objSort(visLayersInfo, ['fakeLayer', true], 'group');

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

    componentDidUpdate: function() {
      brApp.previousFamily = '';
      brApp.previousGroup = '';
    },

    objSort: function() {
      var args = arguments,
          array = args[0],
          case_sensitive, keys_length, key, desc, a, b, i;

      if (typeof arguments[arguments.length - 1] === 'boolean') {
          case_sensitive = arguments[arguments.length - 1];
          keys_length = arguments.length - 1;
      } else {
          case_sensitive = false;
          keys_length = arguments.length;
      }

      return array.sort(function (obj1, obj2) {
          for (i = 1; i < keys_length; i++) {
              key = args[i];
              if (typeof key !== 'string') {
                  desc = key[1];
                  key = key[0];
                  a = obj1[args[i][0]];
                  b = obj2[args[i][0]];
              } else {
                  desc = false;
                  a = obj1[args[i]];
                  b = obj2[args[i]];
              }

              if (case_sensitive === false && typeof a === 'string' && a && b) {
                  a = a.toLowerCase();
                  b = b.toLowerCase();
              }

              if (! desc) {
                  if (a < b) return -1;
                  if (a > b) return 1;
              } else {
                  if (a > b) return -1;
                  if (a < b) return 1;
              }
          }
          return 0;
      });
  }, //end of objSort() function

    handleMapUpdate: function() {

      var visLayersInfo = this.dataGrabber();

      if (visLayersInfo.length === 0) {
        $(".legend-component-content").addClass('collapsed');
        $(".legend-component-container").addClass('collapsed');
      } else {
        $(".legend-component-content").removeClass('collapsed');
        $(".legend-component-container").removeClass('collapsed');
      }

      visLayersInfo.forEach(function(layer) {
        if (layer.layer.indexOf('indigenous') > -1) {
          layer.fakeLayer = ('indigenous')
        } else if (layer.layer.indexOf('community') > -1) {
          layer.fakeLayer = ('community')
        }
      });

      this.objSort(visLayersInfo, ['fakeLayer', true], 'group');

      this.setState({
				'visibleLayersInfo': visLayersInfo
			});

    },

    render: function () {

      return (
				React.createElement("div", {id: "legend-container", className: "legend-container"}, 
          this.state.visibleLayersInfo.map(this.dataMapper, this)
				)
			);

		},

    dataMapper: function (item, index) {

      var layersToRender = [];
      if (item.layer) {

      for (var k = 0; k < item.layers.length; k++) {

          if (item.visibleLayers.indexOf(item.layers[k].layerId) > -1) {
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
              legendItem.family = 'Percent of Indigenous & Community Lands';
            } else if (item.layer === 'landTenure') {
              if (item.visibleLayers[0] === 0 || item.visibleLayers[0] === 2) {
                legendItem.label = "AVERAGE SCORE";
              }

              legendItem.family = 'Indicators of Land Tenure Security';
            }

            if ((legendItem.group === "Formally recognized" || legendItem.group === "Not formally recognized") && legendItem.layerId === 0) {
              //do nothing
            } else {
              layersToRender.push(legendItem);
            }
          }
        }
      }

      for (var m = 0; m < layersToRender.length; m++) {

        if (layersToRender[m].family === brApp.previousFamily && (layersToRender[m].family === 'Indigenous Lands' || layersToRender[m].family === 'Community Lands')) {
          layersToRender[m].family = '';
        } else {
          brApp.previousFamily = layersToRender[m].family;
        }
        if (layersToRender[m].group === brApp.previousGroup && (layersToRender[m].group === 'Formally recognized' || layersToRender[m].group === 'Not formally recognized') && !layersToRender[m].family) {
          layersToRender[m].group = '';
        } else {
          brApp.previousGroup = layersToRender[m].group;
        }
      }

			return (
				React.createElement("div", {className: "layer-group"}, 
          layersToRender.map(function(layer) {

            var label = layer.label;

            return (
              React.createElement("div", null, 
                
                  layer.family ?
                  React.createElement("div", {className: "legend-item-family"}, layer.family) :
                  null, 
                
                React.createElement("div", {className: "legend-item-group"}, layer.group), 
                  layer.legend.map(function(legendObject, i){
                    return React.createElement("div", {className: 'legend-item-name ' + (label === 'AVERAGE SCORE' ? 'average' : '')}, React.createElement("img", {className: "legend-item-img", src: 'data:image/png;base64,'+legendObject.imageData}), legendObject.label)
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
            if (brApp.map.getZoom() <= 7) {
              visLayersInfo.push(brApp.layerInfos[i].data);
            }
          } else if (mapLayer.id.indexOf('community') > -1 || mapLayer.id.indexOf('indigenous') > -1) {
            if (brApp.map.getZoom() > 7) {
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
          React.createElement("div", {className: "legend-component-controls", onClick: this.toggleActive}, 
            React.createElement("div", {className: "legend-controls"}, 
              "Legend", 
              React.createElement("span", {id: "toggleLegend"}, "-")
            )

          ), 
          React.createElement("div", {id: "legend-component-content", className: 'legend-component-content' + (this.state.collapsed ? ' collapsed': '')}, 
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
