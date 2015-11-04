/* global define */
define([
    'dojo/Evented',
    'dojo/_base/declare',
    "dojo/number",
    // My Modules
    'map/MapConfig',
    // Dojo Modules
    'dojo/on',
    'dijit/registry',
    // Utils
    'utils/HashController',
    // Esri Modules
    'esri/map',
    "esri/geometry/webMercatorUtils",
    'esri/layers/ImageParameters',
    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/layers/ArcGISTiledMapServiceLayer',
    "esri/layers/GraphicsLayer",
], function(Evented, declare, number, MapConfig, on, registry, HashController, Map, webMercatorUtils, ImageParameters, ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer, GraphicsLayer) {
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
            console.log(wholeHash.x)
            console.log(self.centerX)
            console.log(wholeHash.y)
            console.log(self.centerY)

            var hashX = self.centerX;
            var hashY = self.centerY;
            var hashL = self.zoom;

            self.map = new Map(this.element, {
                basemap: this.basemap,
                center: [self.centerX, self.centerY],
                sliderPosition: this.sliderPosition,
                zoom: wholeHash.l
            });

            self.map.on('load', function() {
                self.emit('map-ready', {});
                // Clear out Phantom Graphics thanks to esri's graphics layer
                self.map.graphics.clear();
                self.map.resize();
                self.addLayers();
            });

            self.map.on("extent-change", function(e) {

                var delta = e.delta;
                var extent = webMercatorUtils.webMercatorToGeographic(e.extent);
                var levelChange = e.levelChange;
                var lod = e.lod;
                var map = e.target;

                var x = number.round(extent.getCenter().x, 2);
                var y = number.round(extent.getCenter().y, 2);
                //console.log(x + ' ' + y + ' ' + lod.level);
                HashController.updateHash({
                    x: x,
                    y: y,
                    l: lod.level
                });

                // if (brApp.map.infoWindow.isShowing) {
                //     brApp.map.infoWindow.reposition(); //TODO: What is this function actually doing??
                // }

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
