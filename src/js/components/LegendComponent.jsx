/** @jsx React.DOM */
define([
  'react',
  'dojo/topic',
  'map/MapConfig'
], function (React, topic, MapConfig) {
  'use strict';

  var LayerGroup = React.createClass({

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
				<div className='legend-container'>
          {this.state.visibleLayersInfo.map(this.dataMapper, this)}
				</div>
			);

		},

    dataMapper: function (item, index) {

      var layersToRender = [];


      for (var k = 0; k < item.visibleLayers.length; k++) {
        if (item.visibleLayers.indexOf(item.layers[k].layerId) > -1 && item.layers[k].legend) {

          var luke = {};


          luke.group = item.group;
          luke.layerName = item.layers[k].layerName;
          luke.layerId = item.layers[k].layerId;
          luke.legend = item.layers[k].legend[0];

          if ((luke.group === "Formally recognized" || luke.group === "Not formally recognized") && luke.layerId === 0) {
            //do nothing
          } else {
            layersToRender.push(luke);
          }

          // item.layers[k].group = item.group
          // layersToRender.push(item.layers[k]);
        }
      }


			return (
				<div className='layer-group'>
          {layersToRender.map(function(layer) {

            return (
              <div>
                <div className='legend-item-group'>{layer.group}</div>
                <div className='legend-item-name'><img className='legend-item-img' src={'data:image/png;base64,'+layer.legend.imageData}></img>{layer.layerName}</div>
              </div>
            )
          })}
				</div>
			);
		},

    dataGrabber: function() { //todo: filter out tiled layers at certain scales again
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
            group = 'Indigenous and Community Lands';
            layer = mapLayer.id;
            visibleLayers = mapLayer.visibleLayers;
          } else if (mapLayer.id === 'landTenure') {
            group = 'Indicators of the Legal Security of Lands';
            layer = mapLayer.id;
            visibleLayers = mapLayer.visibleLayers;

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
          }


        }
      }
      return visLayersInfo;
    },

    /* jshint ignore:end */
		setActiveLayers: function (key, layer) {
			this.setState({
				'active': key
			});
			// Notify Parent and let parent dispatch updates
			this.props.change(key, layer);
		}

  });

  var Legend = React.createClass({

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

        <div className={'legend-component-container' + (this.state.collapsed ? ' collapsed': '')}>
          <div className='legend-component-controls'>
            <div className='legend-controls'>
              Legend Component
              <span id='toggleLegend' onClick={this.toggleActive}>-</span>
            </div>

          </div>
          <div className={'legend-component-content' + (this.state.collapsed ? ' collapsed': '')}>
              <LayerGroup />
          </div>
        </div>
      );
    }

  });

  return function (node) {
    return React.render(<Legend />, document.getElementById(node));
  };

});
