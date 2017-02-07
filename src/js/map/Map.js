/* global define */
define([
    'dojo/Evented',
    'dojo/_base/declare',
    "dojo/number",
    // My Modules
    'map/MapConfig',
    'main/config',
    "map/MapAssets",
    // Dojo Modules
    'dojo/on',
    'dijit/registry',
    // Utils
    'utils/HashController',
    // Esri Modules
    'esri/map',
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/Color",
    "esri/renderers/SimpleRenderer",
    "esri/geometry/webMercatorUtils",
    'esri/layers/ImageParameters',
    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/layers/ArcGISTiledMapServiceLayer',
    'esri/layers/FeatureLayer',
    "esri/layers/GraphicsLayer",
], function(Evented, declare, number, MapConfig, MainConfig, MapAssets, on, registry, HashController, Map, SimpleFillSymbol, SimpleMarkerSymbol, SimpleLineSymbol, Color, SimpleRenderer, webMercatorUtils, ImageParameters, ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer, FeatureLayer, GraphicsLayer) {
    'use strict';

    var _map = declare([Evented], {

        element: 'brMap',

        /**
         * @param {object} options - Map options like center, default zoom, basemap, etc.
         */
        constructor: function(options, mapElement) {
            declare.safeMixin(this, options);
            if (mapElement) this.element = mapElement;
            this.createMap();
        },


        /**
         * Create the map with the map options, then on load, resize, and start adding layers and widgets
         */
        createMap: function() {
            var self = this;

            var wholeHash = HashController.getHash();

            if (wholeHash.country) {
              wholeHash.x = MainConfig.defaultState.x;
              wholeHash.y = MainConfig.defaultState.y;
              wholeHash.l = MainConfig.defaultState.l;
            }
            self.initialCountry = wholeHash.country;

            self.map = new Map(this.element, {
                basemap: this.basemap,
                center: [wholeHash.x, wholeHash.y],
                sliderPosition: this.sliderPosition,
                zoom: wholeHash.l
            });

            self.map.on('load', function() {
                self.emit('map-ready', self.initialCountry);
                // Clear out Phantom Graphics thanks to esri's graphics layer
                self.map.graphics.clear();
                self.map.resize();
                self.addLayers();

                self.connectLayerEvents(self.map.graphicsLayerIds);
                self.map.on("extent-change", function(e) {

                    var delta = e.delta;
                    var extent = webMercatorUtils.webMercatorToGeographic(e.extent);
                    var levelChange = e.levelChange;
                    var lod = e.lod;
                    var map = e.target;

                    var x = number.round(extent.getCenter().x, 2);
                    var y = number.round(extent.getCenter().y, 2);

                    HashController.updateHash({
                        x: x,
                        y: y,
                        l: lod.level
                    });

                    if (brApp.map.infoWindow.isShowing) {
                        brApp.map.infoWindow.reposition(); //TODO: What is this function actually doing??
                    }

                });
            });



        },

        /**
         * Loop over the MapConfg.layers, for each key, add a layer to the map
         * This function will check the layer type and hand it off to a specific function to add that layer type
         * Once layers have been created add them
         */
        addLayers: function() {
            var layerConfig = MapConfig.layers,
                self = this,
                zoomArray,
                layers = [],
                key;


            for (key in layerConfig) {
                switch (layerConfig[key].type) {
                    case 'dynamic':
                        if (layerConfig[key].minZoom) {
                          layers.push(self.addDynamicLayer(key, layerConfig[key], layerConfig[key].minZoom));
                        } else {
                          layers.push(self.addDynamicLayer(key, layerConfig[key]));
                        }
                        break;
                    case 'graphic':
                        layers.push(self.addGraphicLayer(key, layerConfig[key]));
                        break;
                    case 'tiled':
                        layers.push(self.addTiledLayer(key, layerConfig[key], layerConfig[key]));
                        break;
                    case 'feature':
                        layers.push(self.addFeatureLayer(key, layerConfig[key], layerConfig[key]));
                        break;
                    default:
                        break;
                }
            }

            on.once(this.map, 'layers-add-result', function(response) {
                self.emit('layers-loaded', response);

                var layerInfos = response.layers.map(function(item) {
                    return {
                        layer: item.layer
                    };
                });

                registry.byId("legend").refresh(layerInfos);
            });

            this.map.addLayers(layers);

            // Initialize Add This
            addthis.init();
        },

        //Connect mouse-over graphics
        connectLayerEvents: function (layers) {
          var self = this;
          layers.forEach(function(layer) {
            if (layer !== 'CustomFeatures') {
              var mapLayer = brApp.map.getLayer(layer);
              if (mapLayer) {
                mapLayer.on('mouse-over', self.HoverOn);
                mapLayer.on('mouse-out', self.HoverOff);
              }
            }
          });
          // var percentLandsLayer = brApp.map.getLayer('percentLandsFeature');
          // if (percentLandsLayer) {
          //   percentLandsLayer.on('mouse-over', this.HoverOn);
          //   percentLandsLayer.on('mouse-out', this.HoverOff);
          // }
          //
          // var indigenous_FormalClaimLayer = brApp.map.getLayer('indigenous_FormalClaimFeature');
          // if (indigenous_FormalClaimLayer) {
          //   indigenous_FormalClaimLayer.on('mouse-over', this.HoverOn);
          //   indigenous_FormalClaimLayer.on('mouse-out', this.HoverOff);
          // }
          //
          // var indigenous_FormalDocLayer = brApp.map.getLayer('indigenous_FormalDocFeature');
          // if (indigenous_FormalDocLayer) {
          //   indigenous_FormalDocLayer.on('mouse-over', this.HoverOn);
          //   indigenous_FormalDocLayer.on('mouse-out', this.HoverOff);
          // }
        },

        //Connect mouse-over graphics
        HoverOn: function (evt) {
          var graphic = evt.graphic;
          if (graphic) {
            if (graphic.geometry.type === 'polygon') {
              graphic.setSymbol(MapAssets.getHoverSymbol());
            } else if (graphic.geometry.type === 'point') {
              graphic.setSymbol(MapAssets.getPointHoverSymbol());
            }
          }
        },

        //Connect mouse-over graphics
        HoverOff: function (evt) {
          var graphic = evt.graphic;
          if (graphic) {
            graphic.setSymbol(null);
          }
        },

        /**
         * @param {string} key - Layer ID
         * @param {object} layerConfig - See map/config.js in the layers object for an example
         * @return {object} newly created dynamic layer
         */
        addDynamicLayer: function(key, layerConfig, minZoom) {
            var params = new ImageParameters(),
                layer;

            params.layerOption = ImageParameters.LAYER_OPTION_SHOW;
            params.layerIds = layerConfig.defaultLayers;
            params.format = 'png32';
            if (minZoom) {
              layer = new ArcGISDynamicMapServiceLayer(layerConfig.url, {
                  visible: layerConfig.visible || false,
                  imageParameters: params,
                  id: key,
                  minScale: minZoom
              });
            }
            else {
              layer = new ArcGISDynamicMapServiceLayer(layerConfig.url, {
                  visible: layerConfig.visible || false,
                  imageParameters: params,
                  id: key
              });
            }

            layer.on('error', this.addLayerError.bind(this));
            return layer;
        },

        /**
         * @param {string} key - Layer ID
         * @param {object} layerConfig - See map/config.js in the layers object for an example
         * @return {object} newly created dynamic layer
         */
        addTiledLayer: function(key, layerConfig) {

            var layer = new ArcGISTiledMapServiceLayer(layerConfig.url, {
              displayLevels:[0,1,2,3,4,5,6,7],
              id: key
            });

            layer.on('error', this.addLayerError.bind(this));
            return layer;
        },

        addFeatureLayer: function(key, layerConfig) {

          var symbol;

          if (key.indexOf('Point') > -1) {
            symbol = new SimpleMarkerSymbol();
            symbol.setColor(new Color([0,0,0,0]));
            symbol.setOutline(null);

            new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10,
              new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
              new Color([255,0,0]), 1),
              new Color([0,255,0,0.25]));
          } else {
            symbol = new SimpleFillSymbol();
            symbol.setColor(new Color([0,0,0,0]));
            symbol.setOutline(null);
          }


          var renderer = new SimpleRenderer(symbol);

            var featureLayer = new FeatureLayer(layerConfig.url, {
                id: key,
                minScale: 4700000,
                maxScale: 0,
                visible: layerConfig.visible || false
                // minScale: 1000000000,
                // maxScale: 4700000
            });
            featureLayer.setRenderer(renderer);

            featureLayer.on('error', this.addLayerError.bind(this));
            return featureLayer;
        },

        addGraphicLayer: function(key, layerConfig) {
            var customGraphicsLayer = new GraphicsLayer({
                id: key
            });

            customGraphicsLayer.on('error', this.addLayerError.bind(this));
            return customGraphicsLayer;
        },

        /**
         * @param {object} err - Error from adding the layer
         */
        addLayerError: function(err) {
            this.emit('layer-error', err.target.id);
        }

    });

    return _map;

});
