define([
    'dojo/topic',
    'dojo/on',
    'dijit/registry',
    'map/MapConfig',
    'map/MapAssets',
    'dojo/_base/array',
    'esri/layers/LayerDrawingOptions'
], function(topic, on, registry, MapConfig, MapAssets, arrayUtils, LayerDrawingOptions) {
    'use strict';


    var LayerController = {


        /**
         * Update the visible layers on a dynamic layer based on keys from the Checkbox Tree
         * @param {array} keys - Array of keys from the checkbox tree, these are mapped to layer numbers
         * 										- in the MapConfig.layerMapping (may add layer id's to config if needed).
         * @param {boolean} isNationalLevelData - tells us whether were updating community level or national level layers
         */
        updateVisibleLayers: function(keys, isNationalLevelData, off) {
            brApp.debug('LayerController >>> updateVisibleLayers');
            var visibleLayers = [],
                dynamicLayer,
                layer,
                self = this;

            if (isNationalLevelData) {
              // self.turnOffCommunityLevelData(); todo: fix this and add it back in

              //todo: find a new way to differentiate betweem Land Tenure radio button and percent Indigenous & community
                visibleLayers = keys;


                dynamicLayer = brApp.map.getLayer('landTenure'); //or get pct_comm_lands layer


                // if (keys[0] === 0 || keys[0] === 1) {
                this.setLandTenureRenderer(visibleLayers);
                // Update Dynamic Layers but dont refresh
                dynamicLayer.setVisibleLayers(visibleLayers, true);
                console.log(visibleLayers)
                // return;
                // }

                // dynamicLayer.setVisibleLayers(visibleLayers);
                topic.publish('refresh-legend');

            } else { // Community Level

                for (var i = 0; i < keys.length; i++) {
                  layer = brApp.map.getLayer(keys[i]);

                  var tiledLayer = brApp.map.getLayer(keys[i] + "_Tiled");
                  var tiled = document.getElementById('legend_' + tiledLayer.id);
                  var zoom = brApp.map.getZoom();

                  var legend = registry.byId('legend');

                  if (off === true) {

                    layer.hide();
                    tiledLayer.hide();
                  } else {

                    layer.show();
                    tiledLayer.show();
                  }
                  requestAnimationFrame(function() {

                    for (var layer in MapConfig.layers) {
                      if (MapConfig.layers[layer].type === 'tiled') {

                        var tiled = document.getElementById('legend_' + layer);
                        if (brApp.map.getZoom() > 7 && tiled) {

                          tiled.classList.add('hideLegend');
                        }
                      }
                    }
                  });
                }


                // if (visibleLayers[0] === -1) {
                //
                //     $("#analysis-button").addClass("grayOut");
                //
                //     $('#analysis-button').mouseenter(function() {
                //         $("#analysis-button-tt").show();
                //     });
                //     $('#analysis-button').mouseleave(function() {
                //         $("#analysis-button-tt").hide();
                //     });
                //
                //     $("#legendMenuButton").addClass("mobileLegendUpdate");
                //     $("#toolsMenuButton").hide();
                //
                // } else {
                //
                //     // Turn Off National Layer, User has selected some community level layers
                //     self.turnOffNationalLevelData();
                //
                //     $("#legendMenuButton").removeClass("mobileLegendUpdate");
                //     $("#toolsMenuButton").show();
                //
                //     $("#analysis-button").removeClass("grayOut");
                //     $('#analysis-button').unbind('mouseenter mouseleave');
                //
                // }

                // dynamicLayer.setVisibleLayers(visibleLayers);
                topic.publish('refresh-legend');

            }
        },

        /**
         * Turn Off all Community Level data, deselect all checkboxes in the tree, hide the buttons specific
         * to this data set
         * This is Mutually Exclusive with National Level Data so this is a helper to toggle all
         * Community Level Data related things off
         */
        turnOffCommunityLevelData: function () {
            // Dont turn of dom nodes controlled by React, will result in unexpected behavior
            // var checkboxes = new Array();
            // checkboxes = document.getElementsByTagName('input');

            // for (var i = 0; i < checkboxes.length; i++) {
            //     if (checkboxes[i].type == 'checkbox') {
            //         checkboxes[i].checked = false;
            //     }
            // }

            var oppositeLayer = brApp.map.getLayer('indigenousLands');
            // var oppositeLayer2 = brApp.map.getLayer('indigenousTransparency');

            oppositeLayer.setVisibleLayers([-1]);
            // oppositeLayer2.hide();

            // Turn off all the checkboxes in the Community Level Tree
            // This will call MapController.resetCommunityLevelTree
            topic.publish('reset-community-tree');
            // Hide these buttons
            // $("#data-completeness-container").hide();
            // $("#analysis-button").hide();

            $("#analysis-button").addClass("grayOut");

            $('#analysis-button').mouseenter(function() {
                $("#analysis-button-tt").show();
            });
            $('#analysis-button').mouseleave(function() {
                $("#analysis-button-tt").hide();
            });
        },

        /**
         * Turn Off all National Level data, set list to None
         * This is Mutually Exclusive with Community Level Data so this is a helper to toggle all
         * National Level Data related things off
         */
        turnOffNationalLevelData: function () {
            topic.publish('reset-national-layer-list');
        },

        /**
         * @param {array} visibleLayers - Array of layers to be set to visible
         */
        setLandTenureRenderer: function(visibleLayers) {


            var layerDrawingOptionsArray = [],
                layerDrawingOption,
                nationalIndicator,
                landTenure,
                fieldName,
                renderer;

            nationalIndicator = MapAssets.getNationalLevelIndicatorCode();
            fieldName = ["I", nationalIndicator, "_Scr"].join('');
            if (nationalIndicator === "Avg_Scr") {
              // fieldName = nationalIndicator;
              landTenure = brApp.map.getLayer('landTenure');
              landTenure.setVisibleLayers(visibleLayers, true);

              topic.publish('refresh-legend');
              brApp.map.setExtent(brApp.map.extent);
              return;
            }
            console.log(fieldName)
            layerDrawingOption = new LayerDrawingOptions();

            landTenure = brApp.map.getLayer('landTenure');
            renderer = MapAssets.getUniqueValueRendererForNationalDataWithField(fieldName, landTenure);
            layerDrawingOption.renderer = renderer;

            arrayUtils.forEach(visibleLayers, function(layer) {
                layerDrawingOptionsArray[layer] = layerDrawingOption;
            });


            landTenure.setLayerDrawingOptions(layerDrawingOptionsArray);
            topic.publish('refresh-legend');
            brApp.map.setExtent(brApp.map.extent);
        }

    };

    return LayerController;

});
