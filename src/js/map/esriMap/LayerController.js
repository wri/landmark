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
         */
        updateVisibleLayers: function(keys, layer) {
            brApp.debug('LayerController >>> updateVisibleLayers');
            var visibleLayers = [],
                dynamicLayer;

            if (layer) { //We know we're in the National Level Data w/ the exception of Data Completeness
                visibleLayers = keys;
                dynamicLayer = brApp.map.getLayer('nationalLevel');

                if (document.getElementById('data-complete-checkbox').getAttribute("data-checked") == "true") {
                    visibleLayers.push(5);
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

                dynamicLayer = brApp.map.getLayer('indigenousLands');

                if (keys.length === 0) {
                    visibleLayers.push(-1);
                } else {
                    arrayUtils.forEach(keys, function(key) {
                        visibleLayers = visibleLayers.concat(MapConfig.layerMapping[key]);
                    });
                }


                if (visibleLayers[0] === -1) {
                    $("#data-completeness-container").hide();
                    $("#analysis-button").hide();
                    //todo: hide national level data if its on, add global boolean so that when the comm level data is tuned back on; if that completeness WAS on, turn it back on
                    //$("#geocoder-container").css("right", "80px");
                } else {
                    $("#data-completeness-container").show();
                    $("#analysis-button").show();
                    //$("#geocoder-container").css("right", "450px");
                }
                dynamicLayer.setVisibleLayers(visibleLayers);
                topic.publish('refresh-legend');

            }
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
            renderer = MapAssets.getUniqueValueRendererForNationalDataWithField(fieldName);
            layerDrawingOption.renderer = renderer;

            arrayUtils.forEach(visibleLayers, function(layer) {
                layerDrawingOptionsArray[layer] = layerDrawingOption;
            });

            nationalLayer = brApp.map.getLayer('nationalLevel');
            nationalLayer.setLayerDrawingOptions(layerDrawingOptionsArray);
            topic.publish('refresh-legend');
        },

        setVisibleLayers: function(id, layers) {

        }

    };

    return LayerController;

});