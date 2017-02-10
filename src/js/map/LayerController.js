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

              var nationalLevelFeature = brApp.map.getLayer('percentLandsFeature');

              if (brApp.currentLayer === "percentIndigenousLayers") {
                otherDynamic = brApp.map.getLayer('landTenure');
                if (otherDynamic) {
                  if (visibleLayers[0] !== -1) {
                    otherDynamic.hide();
                  }
                }

                dynamicLayer = brApp.map.getLayer('percentLands');
                if (dynamicLayer) {
                  on.once(dynamicLayer, 'update-start', function() {
                    $('#map-loading-icon').show();
                  });
                  on.once(dynamicLayer, 'update-end', function() {
                    $('#map-loading-icon').hide();
                  });

                  if (visibleLayers[0] === -1) {
                    nationalLevelFeature.hide();
                  } else {
                    nationalLevelFeature.show();
                  }

                  dynamicLayer.setVisibleLayers(visibleLayers);
                  dynamicLayer.show();
                }

              } else {
                otherDynamic = brApp.map.getLayer('percentLands');
                if (otherDynamic) {
                  if (visibleLayers[0] !== -1) {
                    otherDynamic.hide();
                  }
                }

                //TODO: figure out what this is - especially on load
                this.setLandTenureRenderer(visibleLayers);
                dynamicLayer = brApp.map.getLayer('landTenure');
                if (dynamicLayer) {
                  on.once(dynamicLayer, 'update-start', function() {
                    $('#map-loading-icon').show();
                  });
                  on(dynamicLayer, 'update-end', function() {
                    $('#map-loading-icon').hide();
                  });
                  dynamicLayer.setVisibleLayers(visibleLayers, true);
                  dynamicLayer.show();
                }

                if (brApp.currentLayer === "none") {
                  nationalLevelFeature.hide();
                } else {
                  nationalLevelFeature.show();
                }

              }






            } else { // Community Level

                for (var i = 0; i < keys.length; i++) {
                  layer = brApp.map.getLayer(keys[i]);

                  var tiledLayer = brApp.map.getLayer(keys[i] + "_Tiled");
                  var featureLayer = brApp.map.getLayer(keys[i] + 'Feature');
                  var featureLayerPoints = brApp.map.getLayer(keys[i] + 'FeaturePoint');
                  var zoom = brApp.map.getZoom();

                  var legend = registry.byId('legend');
                  on.once(layer, 'update-start', function() {
                      $('#map-loading-icon').show();
                  });
                  on(layer, 'update-end', function() {
                      $('#map-loading-icon').hide();
                  });

                  if (off === true) {
                    layer.hide();
                    tiledLayer.hide();
                    featureLayer.hide();
                    featureLayerPoints.hide();
                  } else {
                    self.turnOffNationalLevelData();
                    layer.show();
                    tiledLayer.show();
                    featureLayer.show();
                    featureLayerPoints.show();
                  }

                }

                // dynamicLayer.setVisibleLayers(visibleLayers);

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

            $("#toolsMenuButton").addClass("minimizedHide");
            $("#legendMenuButton").addClass("minimizedAdjust");

            $("#analysis-button").addClass("grayOut");
            $("#analysisLogo").addClass("grayOutButton");
            $("#analysis-help").addClass("grayOutIcon");


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
            $("#toolsMenuButton").removeClass("minimizedHide");
            $("#legendMenuButton").removeClass("minimizedAdjust");

            $("#analysis-button").removeClass("grayOut");
            $("#analysisLogo").removeClass("grayOutButton");
            $("#analysis-help").removeClass("grayOutIcon");
            $('#analysis-button').unbind('mouseenter mouseleave');
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
              if (landTenure) {
                landTenure.setVisibleLayers(visibleLayers, true);
              }

              brApp.map.setExtent(brApp.map.extent);
              return;
            }

            layerDrawingOption = new LayerDrawingOptions();

            landTenure = brApp.map.getLayer('landTenure');
            renderer = MapAssets.getUniqueValueRendererForNationalDataWithField(fieldName, landTenure);
            layerDrawingOption.renderer = renderer;

            arrayUtils.forEach(visibleLayers, function(layer) {
                layerDrawingOptionsArray[layer] = layerDrawingOption;
            });

            landTenure.setLayerDrawingOptions(layerDrawingOptionsArray);
            brApp.map.setExtent(brApp.map.extent);
        }

    };

    return LayerController;

});
