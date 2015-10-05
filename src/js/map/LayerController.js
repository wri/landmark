define([
    'dojo/topic',
    'map/MapConfig',
    'map/MapAssets',
    'dojo/_base/array',
    'esri/layers/LayerDrawingOptions'
], function(topic, MapConfig, MapAssets, arrayUtils, LayerDrawingOptions) {
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
                // dynamicLayer2,
                self = this;


            if (isNationalLevelData) {
                visibleLayers = keys;
                dynamicLayer = brApp.map.getLayer('nationalLevel');

                //debugger; //call this again w/ proper keys! (aka none) and no layer: oppo for below
                // if (document.getElementById('data-complete-checkbox').getAttribute("data-checked") == "true" && keys.length > 0) {
                //     dynamicLayer2.show();
                // } else {
                //     dynamicLayer2.hide();
                // }

                // document.getElementById('data-complete-checkbox').setAttribute("data-checked", "false")

                // User has selected some National Level Data and they did not select 'none'
                // Turn off community level data
                if (visibleLayers.length === 1 && visibleLayers[0] !== -1) {
                    self.turnOffCommunityLevelData();
                }

                if (keys[0] === 0 || keys[0] === 1) {
                    this.setNationalLevelRenderer(visibleLayers);
                    // Update Dynamic Layers but dont refresh
                    dynamicLayer.setVisibleLayers(visibleLayers, true);
                    return;
                }

                dynamicLayer.setVisibleLayers(visibleLayers);
                topic.publish('refresh-legend');

            } else {

              // if (keys.length === 1) {
              //   layer = brApp.map.getLayer(keys[0]);
              // }

                // dynamicLayer = brApp.map.getLayer('indigenousLands');
                // dynamicLayer2 = brApp.map.getLayer('indigenousTransparency');

                for (var i = 0; i < keys.length; i++) {
                  layer = brApp.map.getLayer(keys[i]);
                  if (off === true) {
                    layer.hide();
                  } else {
                    layer.show();
                  }
                }
                //
                // if (keys.length === 0) {
                //     visibleLayers.push(-1);
                //
                //     if (off === true) {
                //       layer.hide();
                //     } else {
                //       layer.show();
                //     }
                // } else if (keys.length > 1) {
                //     debugger
                //
                // }


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
        setNationalLevelRenderer: function(visibleLayers) {


            var layerDrawingOptionsArray = [],
                layerDrawingOption,
                nationalIndicator,
                nationalLayer,
                fieldName,
                renderer;

            nationalIndicator = MapAssets.getNationalLevelIndicatorCode();
            fieldName = ["I", nationalIndicator, "_Scr"].join('');
            layerDrawingOption = new LayerDrawingOptions();

            nationalLayer = brApp.map.getLayer('nationalLevel');
            renderer = MapAssets.getUniqueValueRendererForNationalDataWithField(fieldName, nationalLayer);
            layerDrawingOption.renderer = renderer;

            arrayUtils.forEach(visibleLayers, function(layer) {
                layerDrawingOptionsArray[layer] = layerDrawingOption;
            });



            nationalLayer.setLayerDrawingOptions(layerDrawingOptionsArray);
            topic.publish('refresh-legend');
            brApp.map.setExtent(brApp.map.extent);
        }

    };

    return LayerController;

});
