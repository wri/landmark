define([
    'dojo/topic',
    'map/MapConfig',
    'dojo/_base/array'
], function(topic, MapConfig, arrayUtils) {
    'use strict';


    var LayerController = {

        /**
         * Update the visible layers on a dynamic layer based on keys from the Checkbox Tree
         * @param {array} keys - Array of keys from the checkbox tree, these are mapped to layer numbers
         * 										- in the MapConfig.layerMapping (may add layer id's to config if needed).
         */
        updateVisibleLayers: function(keys, layer) {
            brApp.debug('LayerController >>> updateVisibleLayers');
            console.log(keys);
            var visibleLayers = [];
            if (layer) { //We know we're in the National Level Data w/ the exception of Data Completeness
                var dynamicLayer = brApp.map.getLayer('nationalLevel');

                switch (layer) {
                    case ".1": //Community Land Tenure
                        visibleLayers = [1];
                        break;
                    case ".2": //Indigenous Land Tenure
                        visibleLayers = [0];
                        break;
                    case ".3": //Percent of Community and Indigenous
                        keys[0] += 2; //--> To get around the two Land Tenure Security Layers
                        visibleLayers = keys;
                        break;
                }

            } else {
                var dynamicLayer = brApp.map.getLayer('indigenousLands');

                if (keys.length === 0) {
                    visibleLayers.push(-1);
                } else {
                    arrayUtils.forEach(keys, function(key) {
                        visibleLayers = visibleLayers.concat(MapConfig.layerMapping[key]);
                    });
                }
                console.log(visibleLayers);
                if (document.getElementById('data-complete-checkbox').checked === true) {
                    visibleLayers.push(5);
                }

            }
            dynamicLayer.setVisibleLayers(visibleLayers);


            topic.publish('refresh-legend');
        },

        setVisibleLayers: function(id, layers) {

        }

    };

    return LayerController;

});