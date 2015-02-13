define([
    'map/Map',
    'map/Uploader',
    'map/DrawTool',
    'map/MapConfig',
    'components/Tree',
    'map/WidgetsController',
    'dojo/on',
    'dojo/query',
    'dojo/dom-class',
    'dojo/dom-construct',
    "dojo/_base/array",
    "dojo/promise/all",
    "dojo/Deferred",
    'dijit/registry',
    'esri/dijit/Legend',
    'esri/dijit/Geocoder',
    'esri/dijit/HomeButton',
    'esri/dijit/LocateButton',
    'esri/dijit/BasemapGallery',
    "esri/tasks/IdentifyTask",
    "esri/tasks/IdentifyParameters",
    "esri/InfoTemplate"
], function(Map, Uploader, DrawTool, MapConfig, ReactTree, WidgetsController, on, dojoQuery, domClass, domConstruct, arrayUtils, all, Deferred, registry, Legend, Geocoder, HomeButton, LocateButton, BasemapGallery, IdentifyTask, IdentifyParameters, InfoTemplate) {
    'use strict';

    var MapController = {

        /**
         *	Initialize the map with default options, register callbacks if necessary
         */
        init: function() {
            brApp.debug('MapController >>> init');
            var self = this;
            // mapObject is not esri/map, it is a wrapper for creating the map and layers
            var mapObject = new Map(MapConfig.options);
            // Make the esri/map available in the global context so other modules can access easily
            brApp.map = mapObject.map;
            console.log(brApp.map);
            // Bind Events now, Map Events then UI Events
            mapObject.on('map-ready', function() {
                self.renderComponents();
            });

            on(document.getElementById('legend-toggle'), 'click', WidgetsController.toggleLegend);
            on(document.getElementById('basemap-button'), 'click', WidgetsController.toggleBasemapGallery.bind(WidgetsController));
            on(document.getElementById('share-button'), 'click', WidgetsController.toggleShareContainer.bind(WidgetsController));
            on(document.getElementById('tree-container-toggle'), 'click', WidgetsController.toggleTreeContainer);
            on(document.getElementById('national-level-toggle'), 'change', WidgetsController.toggleDataContainer);
            on(document.getElementById('community-level-toggle'), 'change', WidgetsController.toggleDataContainer);
            on(document.getElementById('analysis-button'), 'click', WidgetsController.showAnalysisDialog);
            on(document.getElementById('upload-shapefile'), 'click', WidgetsController.toggleUploadForm);
            on(document.getElementById('draw-shape'), 'click', DrawTool.activate);
            on(document.uploadForm, 'change', Uploader.beginUpload.bind(Uploader));
            //on(document.getElementById('brMap_root'), 'click', self.handleClick.bind(self));
            on(brApp.map, 'click', self.handleClick.bind(self));

            // Mobile Specific Events
            // If we are ok with the app not responding to mobile, only loading in mobile or loading in Desktop
            // We could conditionally add handles for the above and below events by using Helper.isMobile()
            on(document.getElementById('mobile-menu-toggle'), 'click', WidgetsController.toggleMobileMenu);
            on(document.getElementById('layersMenuButton'), 'click', WidgetsController.toggleMobileMenuContainer);
            on(document.getElementById('legendMenuButton'), 'click', WidgetsController.toggleMobileMenuContainer);
            on(document.getElementById('toolsMenuButton'), 'click', WidgetsController.toggleMobileMenuContainer);
            on(document.getElementById('embedShare'), 'click', WidgetsController.showEmbedCode);

        },

        /**
         *	Render various components onto the map
         */
        renderComponents: function() {
            brApp.debug('MapController >>> renderComponents');
            var basemapGallery,
                locateButton,
                treeWidget,
                homeWidget,
                geocoder,
                legend,
                node;

            // Build/Insert DOM nodes as Needed
            geocoder = new Geocoder({
                map: brApp.map,
                autoComplete: true,
                arcgisGeocoder: {
                    placeholder: "Enter address"
                }
            }, "geocoder");

            node = dojoQuery('.esriSimpleSliderIncrementButton')[0];
            domConstruct.create('div', {
                'id': 'homeButton'
            }, node, 'after');
            homeWidget = new HomeButton({
                map: brApp.map
            }, 'homeButton');

            basemapGallery = new BasemapGallery({
                map: brApp.map,
                showArcGISBasemaps: true
            }, 'basemap-gallery');

            legend = new Legend({
                map: brApp.map,
                layerInfos: [],
                autoUpdate: true
            }, "legend");

            locateButton = new LocateButton({
                map: brApp.map,
                highlightLocation: false
            }, 'location-widget');

            treeWidget = new ReactTree(MapConfig.communityLevelTreeData, 'community-level-tree');

            // Start all widgets that need to be started
            basemapGallery.startup();
            locateButton.startup();
            homeWidget.startup();
            geocoder.startup();
            legend.startup();
            // Initialize the draw tools
            DrawTool.init();

            // remove hideOnLoad classes
            dojoQuery('body .hideOnLoad').forEach(function(node) {
                domClass.remove(node, 'hideOnLoad');
            });

        },

        handleClick: function(evt) {
            brApp.debug('MapController >>> handleClick');
            var mapPoint = evt.mapPoint,
                deferreds = [],
                features = [],
                self = this,
                indigenousLayer,
                layer;

            brApp.map.infoWindow.clearFeatures();

            // for (layer in MapConfig.layers) {
            //     mapLayer = layer;
            // }

            indigenousLayer = brApp.map.getLayer('indigenousLands');

            if (indigenousLayer) {
                if (indigenousLayer.visible) {
                    deferreds.push(self.identifyIndigenous(mapPoint));
                }
            }

            userGraphics = brApp.map.getLayer('CustomGraphics');

            if (userGraphics) {
                if (userGraphics.visible) {
                    deferreds.push(self.identifyUserShapes(mapPoint));
                }
            }

            if (deferreds.length === 0) {
                return;
            }

            // If drawing tools enabled, dont continue 
            if (DrawTool.isActive()) {
                return;
            }

            all(deferreds).then(function(featureSets) {
                arrayUtils.forEach(featureSets, function(item) {
                    switch (item.layer) {
                        case "inidigenousLands":
                            features = features.concat(self.setIndigenousTemplates(item.features));
                            break;
                            // case "CustomGraphics":
                            //     // This will only contain a single feature and return a single feature
                            //     // instead of an array of features
                            //     features.push(self.setCustomGraphicTemplates(item.feature));
                            //     break;
                        default: // Do Nothing
                            break;
                    }
                });

                if (features.length > 0) {
                    brApp.map.infoWindow.setFeatures(features);
                    brApp.map.infoWindow.show(mapPoint);
                }

            });

        },

        identifyIndigenous: function(mapPoint) {
            brApp.debug('MapController >>> identifyIndigenous');

            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.layers.indigenousLands.url),
                params = new IdentifyParameters(),
                mapLayer = brApp.map.getLayer('indigenousLands');;

            params.tolerance = 3;
            params.returnGeometry = true;
            params.width = brApp.map.width;
            params.height = brApp.map.height;
            params.geometry = mapPoint;
            params.mapExtent = brApp.map.extent;
            params.layerIds = mapLayer.visibleLayers;
            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;

            identifyTask.execute(params, function(features) {
                if (features.length > 0) {
                    console.log(features);
                    deferred.resolve({
                        layer: "inidigenousLands",
                        features: features
                    });
                } else {
                    deferred.resolve(false);
                }
            }, function(error) {
                deferred.resolve(false);
            });

            return deferred.promise;

        },

        setIndigenousTemplates: function(featureObjects) {
            brApp.debug('MapController >>> setIndigenousTemplates');

            var template,
                features = [],
                self = this;

            arrayUtils.forEach(featureObjects, function(item) {
                // debugger;
                // if (item.layerId === 2) {
                template = new InfoTemplate(item.value,
                    "<div class='popup-header'>Layer Name</div>" + item.layerName +
                    "<div class='odd-row'><div class='popup-header'>Official Recognition</div>" + item.feature.attributes.Ofcl_Rec + '</div>' +
                    "<div class='popup-header'>Status</div>" + item.feature.attributes.Ofcl_Rec +
                    "<div class='odd-row'><div class='popup-header'>Category</div>" + item.feature.attributes.Category + '</div>' +
                    "<div class='popup-header'>Size</div>" + item.feature.attributes.Area_Ofcl +
                    "<div class='odd-row'><div class='popup-header'>Country</div>" + item.feature.attributes.Country + '</div>' +
                    "<div class='popup-header'>Ethnicity</div>" + item.feature.attributes.Ethncity_1 +
                    "<div class='odd-row'><div class='popup-header'>Data Contributor</div>" + item.feature.attributes.Data_Ctrb + '</div>' +
                    "<div class='popup-header'>Data Source</div>" + item.feature.attributes.Data_Src +
                    "<div class='popup-last'>Last Updated: " + item.feature.attributes.Last_Updt + '</div> ' +
                    "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                    item.value + "' data-type='RSPO Oil palm concession' data-id='${OBJECTID}'>" +
                    "Analyze this area</button></div>"
                );
                item.feature.setInfoTemplate(template);
                features.push(item.feature);
                // } else {
                //     template = new InfoTemplate(item.value,
                //         "<div>Layer Name: " + item.layerName + "</div>" +
                //         "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                //         item.value + "' data-type='${TYPE}' data-id='${OBJECTID}'>" +
                //         "Analyze this area</button></div>"
                //     );
                //     item.feature.setInfoTemplate(template);
                //     features.push(item.feature);
                // }
            });
            return features;
        },

        identifyUserShapes: function(mapPoint) {
            brApp.debug('MapController >>> identifyUserShapes');

            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.layers.indigenousLands.url),
                params = new IdentifyParameters(),
                mapLayer = brApp.map.getLayer('indigenousLands');;

            params.tolerance = 3;
            params.returnGeometry = true;
            params.width = brApp.map.width;
            params.height = brApp.map.height;
            params.geometry = mapPoint;
            params.mapExtent = brApp.map.extent;
            params.layerIds = mapLayer.visibleLayers;
            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;

            identifyTask.execute(params, function(features) {
                if (features.length > 0) {
                    console.log(features);
                    deferred.resolve({
                        layer: "inidigenousLands",
                        features: features
                    });
                } else {
                    deferred.resolve(false);
                }
            }, function(error) {
                deferred.resolve(false);
            });

            return deferred.promise;

        },

        refreshLegend: function() {
            brApp.debug('MapController >>> refreshLegend');
            registry.byId('legend').refresh();
        }

    };

    return MapController;

});