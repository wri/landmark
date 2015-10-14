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
                otherDynamic,
                layer,
                self = this;

            if (isNationalLevelData) {
              visibleLayers = keys;
              console.log(visibleLayers)
              if (visibleLayers.indexOf(-1) !== 0) {
                self.turnOffCommunityLevelData();//  only fire this is we are turning data ON: Not if we are going over to 'None'
              }

              if (brApp.currentLayer === "percentIndigenousLayers") {
                otherDynamic = brApp.map.getLayer('landTenure');
                otherDynamic.setVisibleLayers([-1]);

                dynamicLayer = brApp.map.getLayer('percentLands');
                dynamicLayer.setVisibleLayers(visibleLayers);
                console.log(visibleLayers);
              } else {
                otherDynamic = brApp.map.getLayer('percentLands');
                otherDynamic.setVisibleLayers([-1]);
                dynamicLayer = brApp.map.getLayer('landTenure'); //or get pct_comm_lands layer
                this.setLandTenureRenderer(visibleLayers);
                // Update Dynamic Layers but dont refresh
                dynamicLayer.setVisibleLayers(visibleLayers, true);
                console.log(visibleLayers);
              }
              //todo: find a new way to differentiate betweem Land Tenure radio button and percent Indigenous & community

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
                    self.turnOffNationalLevelData();
                    layer.show();
                    tiledLayer.show();
                  }

                  requestAnimationFrame(function() {

                    for (var layer in MapConfig.layers) {
                      if (MapConfig.layers[layer].type === 'tiled') {

                        var tiled = document.getElementById('legend_' + layer);
                        if (brApp.map.getZoom() > 7 && tiled) { //todo: is this now hiding too many things? where else are we hiding things from the legend?

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
         * Turn Off all Community Level data, deselect all checkboxes in the tree, change the buttons specific
         * to this data set
         * This is Mutually Exclusive with National Level Data so this is a helper to toggle all
         * Community Level Data related things off
         */
        turnOffCommunityLevelData: function () {
            // Dont turn of dom nodes controlled by React, will result in unexpected behavior

            var indigButton = $('#indigenousLands')[0].firstChild;

            var commButton = $('#communityLands')[0].firstChild;

            if (indigButton.classList.contains("parent-layer-checked-true") && commButton.classList.contains("parent-layer-checked-true")) {
              indigButton.click();
              commButton.click();
            } else if (indigButton.classList.contains("parent-layer-checked-true")) {
              indigButton.click();
            } else if (commButton.classList.contains("parent-layer-checked-true")) {
              commButton.click();
            } else {
              var checkboxes = document.querySelectorAll('.layer-node');
              for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].getAttribute('data-clicked') == 'true') {
                  checkboxes[i].firstChild.click();
                }
              }
            }

            // This will call MapController.resetCommunityLevelTree
            // topic.publish('reset-community-tree');

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
            // topic.publish('reset-national-layer-list');

            $('#nationalLevelNone').click();
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
