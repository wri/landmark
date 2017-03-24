define([
    'dojo/topic',
    'dojo/on',
    'dijit/registry',
    'map/MapConfig',
    'map/MapAssets',
    'dojo/_base/array',
    'dojo/dom-class',
    'esri/layers/LayerDrawingOptions',
    'utils/HashController',
], function(topic, on, registry, MapConfig, MapAssets, arrayUtils, domClass, LayerDrawingOptions, HashController) {



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

            var hash = HashController.getHash();
            var hashActiveLayers = hash.a;
            if (!hashActiveLayers) {
              hashActiveLayers = '';
            }

            if (isNationalLevelData) {
              visibleLayers = keys;

              var nationalLevelFeature = brApp.map.getLayer('percentLandsFeature');

              if (brApp.currentLayer === "percentIndigenousLayers") {
                otherDynamic = brApp.map.getLayer('landTenure');
                if (otherDynamic) {
                  if (visibleLayers[0] !== -1) {
                    otherDynamic.hide();
                    var hashIndex = hashActiveLayers.indexOf(otherDynamic.id);
                    if (hashIndex > -1) {
                      var hashLayers = hashActiveLayers.split(',');
                      var index = hashLayers.indexOf(otherDynamic.id);
                      hashLayers.splice(index,1);
                      hashActiveLayers = hashLayers.join();
                    }
                    HashController.updateHash({
                      x: hash.x,
                      y: hash.y,
                      l: hash.l,
                      a: hashActiveLayers
                    });
                  }

                }

                dynamicLayer = brApp.map.getLayer('percentLands');
                if (dynamicLayer) {
                  var loadingIcon = document.getElementById('map-loading-icon');
                  on.once(dynamicLayer, 'update-start', function() {
                    loadingIcon.style.display = 'block';
                  });
                  on.once(dynamicLayer, 'update-end', function() {
                    loadingIcon.style.display = 'none';
                  });

                  if (visibleLayers[0] === -1) {
                    nationalLevelFeature.hide();
                    var hashIndex = hashActiveLayers.indexOf(dynamicLayer.id);
                    if (hashIndex > -1) {
                      var hashLayers = hashActiveLayers.split(',');
                      var index = hashLayers.indexOf(dynamicLayer.id);
                      hashLayers.splice(index,1);
                      hashActiveLayers = hashLayers.join();
                    }
                    HashController.updateHash({
                      x: hash.x,
                      y: hash.y,
                      l: hash.l,
                      a: hashActiveLayers
                    });
                  } else {
                    nationalLevelFeature.show();
                  }

                  dynamicLayer.setVisibleLayers(visibleLayers);
                  dynamicLayer.show();
                  if (visibleLayers[0] !== -1) {
                    var hashIndex = hashActiveLayers.indexOf(dynamicLayer.id);
                    if (hashIndex === -1) {
                      if (hashActiveLayers) {
                        hashActiveLayers += ',' + dynamicLayer.id;
                      } else {
                        hashActiveLayers = dynamicLayer.id;
                      }
                    }
                  }

                  HashController.updateHash({
                    x: hash.x,
                    y: hash.y,
                    l: hash.l,
                    a: hashActiveLayers
                  });
                }

              } else {
                otherDynamic = brApp.map.getLayer('percentLands');
                if (otherDynamic) {
                  if (visibleLayers[0] !== -1) {
                    otherDynamic.hide();
                    var hashIndex = hashActiveLayers.indexOf(otherDynamic.id);
                    if (hashIndex > -1) {
                      var hashLayers = hashActiveLayers.split(',');
                      var index = hashLayers.indexOf(otherDynamic.id);
                      hashLayers.splice(index,1);
                      hashActiveLayers = hashLayers.join();
                    }
                    HashController.updateHash({
                      x: hash.x,
                      y: hash.y,
                      l: hash.l,
                      a: hashActiveLayers
                    });
                  }
                }

                this.setLandTenureRenderer(visibleLayers);
                dynamicLayer = brApp.map.getLayer('landTenure');
                if (dynamicLayer) {
                  var loadingIcon = document.getElementById('map-loading-icon');
                  on.once(dynamicLayer, 'update-start', function() {
                    loadingIcon.style.display = 'block';
                  });
                  on(dynamicLayer, 'update-end', function() {
                    loadingIcon.style.display = 'none';
                  });
                  dynamicLayer.setVisibleLayers(visibleLayers, true);
                  dynamicLayer.show();

                  var hashIndex = hashActiveLayers.indexOf(dynamicLayer.id);
                  if (hashIndex === -1) {
                    if (hashActiveLayers) {
                      hashActiveLayers += ',' + dynamicLayer.id;
                    } else {
                      hashActiveLayers = dynamicLayer.id;
                    }
                  }
                }
                  HashController.updateHash({
                    x: hash.x,
                    y: hash.y,
                    l: hash.l,
                    a: hashActiveLayers
                  });
                }

                if (brApp.currentLayer === 'none' || dynamicLayer.visibleLayers.indexOf(-1) > -1) {
                  nationalLevelFeature.hide();

                  var hashIndex = hashActiveLayers.indexOf(dynamicLayer.id);
                  if (hashIndex > -1) {
                    var hashLayers = hashActiveLayers.split(',');
                    var index = hashLayers.indexOf(dynamicLayer.id);
                    hashLayers.splice(index,1);
                    hashActiveLayers = hashLayers.join();
                  }
                  HashController.updateHash({
                    x: hash.x,
                    y: hash.y,
                    l: hash.l,
                    a: hashActiveLayers
                  });
                } else {
                  nationalLevelFeature.show();
                }
            } else { // Community Level

                for (var i = 0; i < keys.length; i++) {
                  layer = brApp.map.getLayer(keys[i]);

                  var tiledLayer = brApp.map.getLayer(keys[i] + "_Tiled");
                  var featureLayer = brApp.map.getLayer(keys[i] + 'Feature');
                  var featureLayerPoints = brApp.map.getLayer(keys[i] + 'FeaturePoint');
                  var zoom = brApp.map.getZoom();

                  var legend = registry.byId('legend');
                  var loadingIcon = document.getElementById('map-loading-icon');
                  on.once(layer, 'update-start', function() {
                      loadingIcon.style.display = 'block';
                  });
                  on(layer, 'update-end', function() {
                      loadingIcon.style.display = 'none';
                  });

                  if (off === true) {
                    layer.hide();
                    tiledLayer.hide();
                    featureLayer.hide();
                    featureLayerPoints.hide();
                    var hashIndex = hashActiveLayers.indexOf(layer.id);
                    if (hashIndex > -1) {
                      var hashLayers = hashActiveLayers.split(',');
                      var index = hashLayers.indexOf(layer.id);
                      hashLayers.splice(index,1);
                      hashActiveLayers = hashLayers.join();
                    }
                  } else {
                    layer.show();
                    tiledLayer.show();
                    featureLayer.show();
                    featureLayerPoints.show();

                  var hashIndex = hashActiveLayers.indexOf(layer.id);
                  if (hashIndex === -1) {
                    if (hashActiveLayers) {
                      hashActiveLayers += ',' + layer.id;
                    } else {
                      hashActiveLayers = layer.id;
                    }
                  }

                  }
                  HashController.updateHash({
                    x: hash.x,
                    y: hash.y,
                    l: hash.l,
                    a: hashActiveLayers
                  });

                }
                if (hashActiveLayers.indexOf('community') === -1 && hashActiveLayers.indexOf('indigenous') === -1) {
                  domClass.add('analysis-button', 'grayOut')
                  domClass.add('analysisLogo', 'grayOutButton')
                  domClass.add('analysis-help', 'grayOutIcon')
                } else {
                  domClass.remove('analysis-button', 'grayOut')
                  domClass.remove('analysisLogo', 'grayOutButton')
                  domClass.remove('analysis-help', 'grayOutIcon')
                }
            }
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
