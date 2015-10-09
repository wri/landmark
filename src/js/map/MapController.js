define([
    'map/Map',
    'map/Uploader',
    'map/DrawTool',
    'map/MapConfig',
    'map/MapAssets',
    'components/LayerTabContainer',
    // 'components/Tree',
    // 'components/CommunityLayerList',
    // 'components/NationalLayerList',
    'map/WidgetsController',
    'utils/Helper',
    'dojo/on',
    'dojo/query',
    'dojo/dom-class',
    'dojo/dom-construct',
    "dojo/_base/array",
    "dojo/promise/all",
    "dojo/Deferred",
    "dojo/number",
    'dojo/topic',
    'dojo/fx/Toggler',
    'dijit/registry',
    'dijit/layout/ContentPane',
    // 'dijit/layout/AccordionContainer',
    'esri/dijit/Legend',
    // 'esri/dijit/Geocoder',
    'esri/dijit/HomeButton',
    // 'esri/dijit/LocateButton',
    'esri/dijit/BasemapGallery',
    'esri/dijit/Scalebar',
    "esri/request",
    "esri/geometry/Point",
    "esri/geometry/Polygon",
    "esri/tasks/IdentifyTask",
    "esri/tasks/IdentifyParameters",
    "esri/InfoTemplate",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "dijit/form/HorizontalSlider",
    "dijit/form/HorizontalRuleLabels",
    "esri/layers/LayerDrawingOptions"

], function(Map, Uploader, DrawTool, MapConfig, MapAssets, LayerTabContainer, WidgetsController, Helper, on, dojoQuery, domClass, domConstruct, arrayUtils, all, Deferred, dojoNumber, topic, Toggler, registry, ContentPane, Legend, HomeButton, BasemapGallery, Scalebar, esriRequest, Point, Polygon, IdentifyTask, IdentifyParameters, InfoTemplate, Query, QueryTask, HorizontalSlider, HorizontalRuleLabels, LayerDrawingOptions) {

    'use strict';

    // Some Widgets That will need to be accessed outside the renderComponents method
    var nationalLayerList,
        communityLayerList;

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

            // Bind Events now, Map Events then UI Events
            mapObject.on('map-ready', function() {
                self.renderComponents();
                // registry.byId('layer-accordion').resize();
                //$("#national-level-toggle_button").click();
            });

            on(document.getElementById('legend-toggle'), 'click', WidgetsController.toggleLegend);
            on(document.getElementById('basemap-button'), 'click', WidgetsController.toggleBasemapGallery.bind(WidgetsController));
            on(document.getElementById('share-button'), 'click', WidgetsController.toggleShareContainer.bind(WidgetsController));
            on(document.getElementById('print-button'), 'click', WidgetsController.printMap);

            on(document.getElementById('tree-container-toggle'), 'click', WidgetsController.toggleTreeContainer);

            on(document.getElementById('analysis-button'), 'click', function() {
                if (this.classList.contains("grayOut")) {
                    return;
                }
                var customGraphics = brApp.map.getLayer("CustomFeatures");
                WidgetsController.showAnalysisDialog(customGraphics);
            });

            on(document.getElementById('upload-shapefile'), 'click', WidgetsController.toggleUploadForm);
            // on(document.getElementById('data-complete-checkbox'), 'click', self.showDataComplete);
            on(document.getElementById('draw-shape'), 'click', DrawTool.activate);
            on(document.getElementById('remove-graphics'), 'click', self.removeAllGraphics);

            on(document.uploadForm, 'change', Uploader.beginUpload.bind(Uploader));

            //on(document.getElementById('brMap_root'), 'click', self.handleClick.bind(self));
            on(brApp.map, 'click', self.handleClick.bind(self));

            on(brApp.map, 'layer-add-result', function(layerAdded) {
                if (layerAdded.layer.id === "CustomFeatures") {
                    on(brApp.map.getLayer("CustomFeatures"), "click", function(evt) {
                        self.selectCustomGraphics(evt);
                    });
                }
            });

            on(brApp.map, 'extent-change', function(evt) {
              if (evt.levelChange !== true) {
                return;
              }

              for (var layer in MapConfig.layers) {
                if (MapConfig.layers[layer].type === 'tiled') {
                  var tiled = document.getElementById('legend_' + layer);
                  if (evt.lod.level > 7 && tiled) {

                    tiled.classList.add('hideLegend');
                  } else if (evt.lod.level <= 7 && tiled) {
                    tiled.classList.remove('hideLegend');
                  }
                }
              }

              console.log(evt.lod.level);

            });
            on(brApp.map, 'layers-add-result', function(layersAdded) {

                var layerInfos = layersAdded.layers.map(function(layer) {
                    var li = {
                      layer: layer.layer,
                    };
                    switch (layer.layer.id) {

                        case "nationalLevel":
                            li.hideLayers = [];
                            break;
                        default:
                            li.hideLayers = [0];
                            break;
                    }
                    return li;
                });

                var legend = new Legend({
                    map: brApp.map,
                    layerInfos: layerInfos,
                    autoUpdate: true
                }, "legend");
                legend.startup();

                requestAnimationFrame(function() {
                    legend.refresh(layerInfos);
                    for (var layer in MapConfig.layers) {
                      if (MapConfig.layers[layer].type === 'tiled') {

                        var tiled = document.getElementById('legend_' + layer);
                        if (brApp.map.getZoom() > 7 && tiled) {

                          tiled.classList.add('hideLegend');
                        }
                      }
                    }
                });

            });

            //TODO: Check the presence of the analysis and data completeness buttons on smaller screens AFTER a layer is toggled on (if all layers were off)
            // --> In layerController's updateVisibleLayers function.

            // Mobile Specific Events
            // If we are ok with the app not responding to mobile, only loading in mobile or loading in Desktop
            // We could conditionally add handles for the above and below events by using Helper.isMobile()
            on(document.getElementById('mobile-menu-toggle'), 'click', WidgetsController.toggleMobileMenu);
            on(document.getElementById('mobile-menu-close'), 'click', WidgetsController.toggleMobileMenu);
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
                self = this,
                // locateButton,
                // layerAccordion,
                tabContainer,
                homeWidget,
                // transparencySlider,
                // geocoder,
                scalebar,
                // legend,
                node;

            // Build/Insert DOM nodes as Needed
            // geocoder = new Geocoder({
            //     map: brApp.map,
            //     autoComplete: true,
            //     arcgisGeocoder: {
            //         placeholder: "Enter address"
            //     }
            // }, "geocoder");

            node = dojoQuery('.esriSimpleSliderIncrementButton')[0];
            domConstruct.create('div', {
                'id': 'homeButton',
                'title': 'Default map extent'
            }, node, 'after');
            homeWidget = new HomeButton({
                map: brApp.map
            }, 'homeButton');

            basemapGallery = new BasemapGallery({
                map: brApp.map,
                showArcGISBasemaps: true
            }, 'basemap-gallery');

            // legend = new Legend({
            //     map: brApp.map,
            //     layerInfos: [],
            //     autoUpdate: true
            // }, "legend");

            scalebar = new Scalebar({
                map: brApp.map,
                attachTo: "bottom-center",
                scalebarUnit: "metric"
            });

            // locateButton = new LocateButton({
            //     map: brApp.map,
            //     highlightLocation: false
            // }, 'location-widget');

            // layerAccordion = new Accordion({
            //     id: 'layer-accordion'
            // }, 'layer-accordion');

            // layerAccordion.startup();
            //
            // layerAccordion.addChild(new ContentPane({
            //     title: 'Community Level Data'
            // }, 'community-level-toggle'));
            //
            // layerAccordion.addChild(new ContentPane({
            //     title: 'National Level Data'
            // }, 'national-level-toggle'));

            // transparencySlider = new HorizontalSlider({
            //     //value: 80,
            //     minimum: 0,
            //     maximum: 100,
            //     title: 'Set layer transparency',
            //     discreteValues: 100,
            //     showButtons: false,
            //     intermediateChanges: false,
            //     onChange: function(value) {
            //         self.changeOpacity(value);
            //     }
            // }, "completeness-slider");

            // transparencySlider.startup();

            // transparencySlider.setValue(50);

            // communityTree = new ReactTree(MapConfig.communityLevelTreeData, 'community-level-tree');

            tabContainer = new LayerTabContainer('layer-content');

            // communityLayerList = new CommunityLayerList(MapConfig.communityLevelLayers, 'community-level-tree');
            // nationalLayerList = new NationalLayerList('national-layer-lists');

            // Start all widgets that still need to be started
            basemapGallery.startup();
            // locateButton.startup();
            homeWidget.startup();
            // geocoder.startup();
            // legend.startup();

            //self.queryEmptyLayers();


            self.getLandTenureRenderer();

            // Initialize the draw tools
            DrawTool.init();
            // TODO: Recomment Back In
            // on(document.getElementById('indigenous-lands-help'), 'click', WidgetsController.showHelp);
            // on(document.getElementById('community-lands-help'), 'click', WidgetsController.showHelp);
            on(document.getElementById('analysis-help'), 'click', WidgetsController.showHelp);

            //brApp.map.infoWindow.on("selection-change", function() {

            // if (brApp.map.infoWindow.isShowing) {
            //     // var toggler = new Toggler({
            //     //     node: brApp.map.infoWindow.domNode,
            //     //     showDuration: 50,
            //     //     hideDuration: 50
            //     // });
            //     // toggler.hide();
            //     // setTimeout(function() { //TODO: Do this synchronously...but after the hide operation has completed
            //     //     toggler.show();
            //     // }, 50);

            //     $(brApp.map.infoWindow.domNode).fadeToggle(50);
            //     $(brApp.map.infoWindow.domNode).fadeToggle(50);
            //     //$(brApp.map.infoWindow.domNode).fadeToggle("fast");
            //     //$(brApp.map.infoWindow.domNode).fadeToggle("fast");
            // }



            //});

            // remove hideOnLoad classes
            dojoQuery('body .hideOnLoad').forEach(function(node) {
                domClass.remove(node, 'hideOnLoad');
            });

        },

        resetCommunityLevelTree: function () {
            if (communityLayerList) {
                communityLayerList.toggleOff();
            }
        },

        resetNationalLayerList: function () {
            if (nationalLayerList) {
                nationalLayerList.setToNone();
            }
        },

        handleClick: function(evt) {
            brApp.debug('MapController >>> handleClick');

            var mapPoint = evt.mapPoint,
                deferreds = [],
                features = [],
                self = this,
                // indigenousLayer,
                indigenous_FormalClaim,
                indigenous_FormalDoc,
                indigenous_InProcess,
                indigenous_NoDoc,
                indigenous_Occupied,
                community_FormalClaim,
                community_FormalDoc,
                community_InProcess,
                community_NoDoc,
                community_Occupied,
                nationalLayer,
                userGraphics,
                layer;

            brApp.mapPoint = mapPoint;
            brApp.mapPoint.clientY = evt.clientY;
            brApp.mapPoint.clientX = evt.clientX;
            brApp.map.infoWindow.clearFeatures();

            if (brApp.map.infoWindow.isShowing) {
                brApp.map.infoWindow.hide();
            }

            if (DrawTool.isActive()) {
                return;
            }


            indigenous_FormalClaim = brApp.map.getLayer('indigenous_FormalClaim');
            indigenous_FormalDoc = brApp.map.getLayer('indigenous_FormalDoc');
            indigenous_InProcess = brApp.map.getLayer('indigenous_InProcess');
            indigenous_NoDoc = brApp.map.getLayer('indigenous_NoDoc');
            indigenous_Occupied = brApp.map.getLayer('indigenous_Occupied');

            community_FormalClaim = brApp.map.getLayer('community_FormalClaim');
            community_FormalDoc = brApp.map.getLayer('community_FormalDoc');
            community_InProcess = brApp.map.getLayer('community_InProcess');
            community_NoDoc = brApp.map.getLayer('community_NoDoc');
            community_Occupied = brApp.map.getLayer('community_Occupied');

            if (indigenous_FormalClaim) {
                if (indigenous_FormalClaim.visible) {
                    deferreds.push(self.identifyIndigenous_FormalClaims(mapPoint));
                }
            }
            if (indigenous_FormalDoc) {
                if (indigenous_FormalDoc.visible) {
                    deferreds.push(self.identifyIndigenous_FormalDoc(mapPoint));
                }
            }
            if (indigenous_InProcess) {
                if (indigenous_InProcess.visible) {
                    deferreds.push(self.identifyIndigenous_InProcess(mapPoint));
                }
            }
            if (indigenous_NoDoc) {
                if (indigenous_NoDoc.visible) {
                    deferreds.push(self.identifyIndigenous_NoDoc(mapPoint));
                }
            }
            if (indigenous_Occupied) {
                if (indigenous_Occupied.visible) {
                    deferreds.push(self.identifyIndigenous_Occupied(mapPoint));
                }
            }

            if (community_FormalClaim) {
                if (community_FormalClaim.visible) {
                    deferreds.push(self.identifyCommunity_FormalClaim(mapPoint));
                }
            }
            if (community_FormalDoc) {
                if (community_FormalDoc.visible) {
                    deferreds.push(self.identifyCommunity_FormalDoc(mapPoint));
                }
            }
            if (community_InProcess) {
                if (community_InProcess.visible) {
                    deferreds.push(self.identifyCommunity_InProcess(mapPoint));
                }
            }
            if (community_NoDoc) {
                if (community_NoDoc.visible) {
                    deferreds.push(self.identifyCommunity_NoDoc(mapPoint));
                }
            }
            if (community_Occupied) {
                if (community_Occupied.visible) {
                    deferreds.push(self.identifyCommunity_Occupied(mapPoint));
                }
            }

            nationalLayer = brApp.map.getLayer('nationalLevel');

            if (nationalLayer) {
                if (nationalLayer.visible) {
                    deferreds.push(self.identifyNational(mapPoint));
                }
            }

            if (deferreds.length === 0) {
                return;
            }

            all(deferreds).then(function(featureSets) {
                arrayUtils.forEach(featureSets, function(item) {
                  console.log(item.layer)
                    switch (item.layer) {
                      // community_FormalClaim = brApp.map.getLayer('community_FormalClaim');
                      // community_FormalDoc = brApp.map.getLayer('community_FormalDoc');
                      // community_InProcess = brApp.map.getLayer('community_InProcess');
                      // community_NoDoc = brApp.map.getLayer('community_NoDoc');
                      // community_Occupied = brApp.map.getLayer('community_Occupied');
                        case "indigenous_FormalClaim":
                            features = features.concat(self.setIndigenousTemplates(item.features));
                            break;
                        case "indigenous_FormalDoc":
                            features = features.concat(self.setIndigenousTemplates(item.features));
                            break;
                        case "indigenous_InProcess":
                            features = features.concat(self.setIndigenousTemplates(item.features));
                            break;
                        case "indigenous_NoDoc":
                            features = features.concat(self.setIndigenousTemplates(item.features));
                            break;
                        case "indigenous_Occupied":
                            features = features.concat(self.setIndigenousTemplates(item.features));
                            break;

                        case "community_FormalClaim":
                            features = features.concat(self.setCommunityTemplates(item.features));
                            break;
                        case "community_FormalDoc":
                            features = features.concat(self.setCommunityTemplates(item.features));
                            break;
                        case "community_InProcess":
                            features = features.concat(self.setCommunityTemplates(item.features));
                            break;
                        case "community_NoDoc":
                            features = features.concat(self.setCommunityTemplates(item.features));
                            break;
                        case "community_Occupied":
                            features = features.concat(self.setCommunityTemplates(item.features));
                            break;


                        case "nationalLevel":
                            features = features.concat(self.setNationalTemplates(item.features));
                            break;
                        default: // Do Nothing
                            break;
                    }
                });

                if (features.length > 0) {
                    brApp.map.infoWindow.setFeatures(features);
                    brApp.map.infoWindow.resize(450, 600);

                    // $(".esriPopup").removeClass("analysis-location");
                    $(".esriPopup .titleButton.close").css('background-image', 'url("css/images/close_x_symbol.png")');
                    $("#identifyNote").remove();

                    brApp.map.infoWindow.show(mapPoint);

                    // var centerPoint = new Point(brApp.map.extent.getCenter());
                    // var centerPointScreen = brApp.map.toScreen(centerPoint);
                    // if (centerPointScreen.y > 300) {
                    //     centerPointScreen.y -= 100;
                    // }

                    // centerPoint = brApp.map.toMap(centerPointScreen);

                    // brApp.map.centerAt(centerPoint);

                    if (window.innerWidth < 1000) {
                        brApp.map.infoWindow.maximize();
                        $(".esriPopup .contentPane").css("height", "inherit");

                    }

                    // if (window.innerWidth < 600 || mapPoint.clientY < 400) {
                    //     //brApp.map.infoWindow.reposition(); //TODO: Center in screen? Remove arrow to point to feature?
                    // }

                    on.once(brApp.map.infoWindow, "hide", function() {

                        brApp.map.infoWindow.resize(450, 600);

                    });

                }
            });

        },

        // identifyIndigenous: function(mapPoint) {
        //     brApp.debug('MapController >>> identifyIndigenous');
        //
        //     var deferred = new Deferred(),
        //         identifyTask = new IdentifyTask(MapConfig.layers.indigenousLands.url),
        //         params = new IdentifyParameters(),
        //         mapLayer = brApp.map.getLayer('indigenousLands');
        //
        //     params.tolerance = 3;
        //     params.returnGeometry = true;
        //     params.width = brApp.map.width;
        //     params.height = brApp.map.height;
        //     params.maxAllowableOffset = Math.floor(brApp.map.extent.getWidth() / brApp.map.width);
        //     params.geometry = mapPoint;
        //     params.mapExtent = brApp.map.extent;
        //     params.layerIds = mapLayer.visibleLayers;
        //     if (params.layerIds.indexOf(17) > -1) {
        //         params.layerIds.splice(params.layerIds.indexOf(17), 1);
        //     }
        //
        //     params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
        //
        //     identifyTask.execute(params, function(features) {
        //         if (features.length > 0) {
        //             console.log(features);
        //             deferred.resolve({
        //                 layer: "indigenousLands",
        //                 features: features
        //             });
        //         } else {
        //             deferred.resolve(false);
        //         }
        //     }, function(error) {
        //         deferred.resolve(false);
        //     });
        //
        //     return deferred.promise;
        //
        // },

        identifyIndigenous_FormalClaims: function(mapPoint) {
            brApp.debug('MapController >>> identifyIndigenous_FormalClaims');

            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.layers.indigenous_FormalClaim.url),
                params = new IdentifyParameters(),
                mapLayer = brApp.map.getLayer('indigenous_FormalClaim');

            params.tolerance = 3;
            params.returnGeometry = true;
            params.maxAllowableOffset = Math.floor(brApp.map.extent.getWidth() / brApp.map.width);
            params.width = brApp.map.width;
            params.height = brApp.map.height;
            params.geometry = mapPoint;
            params.mapExtent = brApp.map.extent;
            params.layerIds = mapLayer.visibleLayers;

            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;

            identifyTask.execute(params, function(features) {
                if (features.length > 0) {
                    deferred.resolve({
                        layer: "indigenous_FormalClaim",
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
        identifyIndigenous_FormalDoc: function(mapPoint) {
            brApp.debug('MapController >>> identifyIndigenous_FormalDoc');

            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.layers.indigenous_FormalDoc.url),
                params = new IdentifyParameters(),
                mapLayer = brApp.map.getLayer('indigenous_FormalDoc');

            params.tolerance = 3;
            params.returnGeometry = true;
            params.maxAllowableOffset = Math.floor(brApp.map.extent.getWidth() / brApp.map.width);
            params.width = brApp.map.width;
            params.height = brApp.map.height;
            params.geometry = mapPoint;
            params.mapExtent = brApp.map.extent;
            params.layerIds = mapLayer.visibleLayers;

            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;

            identifyTask.execute(params, function(features) {
                if (features.length > 0) {
                    deferred.resolve({
                        layer: "indigenous_FormalDoc",
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
        identifyIndigenous_InProcess: function(mapPoint) {
            brApp.debug('MapController >>> identifyIndigenous_InProcess');

            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.layers.indigenous_InProcess.url),
                params = new IdentifyParameters(),
                mapLayer = brApp.map.getLayer('indigenous_InProcess');

            params.tolerance = 3;
            params.returnGeometry = true;
            params.maxAllowableOffset = Math.floor(brApp.map.extent.getWidth() / brApp.map.width);
            params.width = brApp.map.width;
            params.height = brApp.map.height;
            params.geometry = mapPoint;
            params.mapExtent = brApp.map.extent;
            params.layerIds = mapLayer.visibleLayers;

            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;

            identifyTask.execute(params, function(features) {
                if (features.length > 0) {
                    deferred.resolve({
                        layer: "indigenous_InProcess",
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
        identifyIndigenous_NoDoc: function(mapPoint) {
            brApp.debug('MapController >>> identifyIndigenous_NoDoc');

            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.layers.indigenous_NoDoc.url),
                params = new IdentifyParameters(),
                mapLayer = brApp.map.getLayer('indigenous_NoDoc');

            params.tolerance = 3;
            params.returnGeometry = true;
            params.maxAllowableOffset = Math.floor(brApp.map.extent.getWidth() / brApp.map.width);
            params.width = brApp.map.width;
            params.height = brApp.map.height;
            params.geometry = mapPoint;
            params.mapExtent = brApp.map.extent;
            params.layerIds = mapLayer.visibleLayers;

            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;

            identifyTask.execute(params, function(features) {
                if (features.length > 0) {
                    deferred.resolve({
                        layer: "indigenous_NoDoc",
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
        identifyIndigenous_Occupied: function(mapPoint) {
            brApp.debug('MapController >>> identifyIndigenous_Occupied');

            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.layers.indigenous_Occupied.url),
                params = new IdentifyParameters(),
                mapLayer = brApp.map.getLayer('indigenous_Occupied');

            params.tolerance = 3;
            params.returnGeometry = true;
            params.maxAllowableOffset = Math.floor(brApp.map.extent.getWidth() / brApp.map.width);
            params.width = brApp.map.width;
            params.height = brApp.map.height;
            params.geometry = mapPoint;
            params.mapExtent = brApp.map.extent;
            params.layerIds = mapLayer.visibleLayers;

            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;

            identifyTask.execute(params, function(features) {
                if (features.length > 0) {
                    deferred.resolve({
                        layer: "indigenous_Occupied",
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







        identifyCommunity_FormalClaim: function(mapPoint) {
            brApp.debug('MapController >>> identifyCommunity_FormalClaim');

            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.layers.community_FormalClaim.url),
                params = new IdentifyParameters(),
                mapLayer = brApp.map.getLayer('community_FormalClaim');

            params.tolerance = 3;
            params.returnGeometry = true;
            params.maxAllowableOffset = Math.floor(brApp.map.extent.getWidth() / brApp.map.width);
            params.width = brApp.map.width;
            params.height = brApp.map.height;
            params.geometry = mapPoint;
            params.mapExtent = brApp.map.extent;
            params.layerIds = mapLayer.visibleLayers;

            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;

            identifyTask.execute(params, function(features) {
                if (features.length > 0) {
                    deferred.resolve({
                        layer: "community_FormalClaim",
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
        identifyCommunity_FormalDoc: function(mapPoint) {
            brApp.debug('MapController >>> identifyCommunity_FormalDoc');

            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.layers.community_FormalDoc.url),
                params = new IdentifyParameters(),
                mapLayer = brApp.map.getLayer('community_FormalDoc');

            params.tolerance = 3;
            params.returnGeometry = true;
            params.maxAllowableOffset = Math.floor(brApp.map.extent.getWidth() / brApp.map.width);
            params.width = brApp.map.width;
            params.height = brApp.map.height;
            params.geometry = mapPoint;
            params.mapExtent = brApp.map.extent;
            params.layerIds = mapLayer.visibleLayers;

            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;

            identifyTask.execute(params, function(features) {
                if (features.length > 0) {
                    deferred.resolve({
                        layer: "community_FormalDoc",
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
        identifyCommunity_InProcess: function(mapPoint) {
            brApp.debug('MapController >>> identifyCommunity_InProcess');

            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.layers.community_InProcess.url),
                params = new IdentifyParameters(),
                mapLayer = brApp.map.getLayer('community_InProcess');

            params.tolerance = 3;
            params.returnGeometry = true;
            params.maxAllowableOffset = Math.floor(brApp.map.extent.getWidth() / brApp.map.width);
            params.width = brApp.map.width;
            params.height = brApp.map.height;
            params.geometry = mapPoint;
            params.mapExtent = brApp.map.extent;
            params.layerIds = mapLayer.visibleLayers;

            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;

            identifyTask.execute(params, function(features) {
                if (features.length > 0) {
                    deferred.resolve({
                        layer: "community_InProcess",
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
        identifyCommunity_NoDoc: function(mapPoint) {
            brApp.debug('MapController >>> identifyCommunity_NoDoc');

            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.layers.community_NoDoc.url),
                params = new IdentifyParameters(),
                mapLayer = brApp.map.getLayer('community_NoDoc');

            params.tolerance = 3;
            params.returnGeometry = true;
            params.maxAllowableOffset = Math.floor(brApp.map.extent.getWidth() / brApp.map.width);
            params.width = brApp.map.width;
            params.height = brApp.map.height;
            params.geometry = mapPoint;
            params.mapExtent = brApp.map.extent;
            params.layerIds = mapLayer.visibleLayers;

            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;

            identifyTask.execute(params, function(features) {
                if (features.length > 0) {
                    deferred.resolve({
                        layer: "community_NoDoc",
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
        identifyCommunity_Occupied: function(mapPoint) {
            brApp.debug('MapController >>> identifyCommunity_Occupied');

            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.layers.community_Occupied.url),
                params = new IdentifyParameters(),
                mapLayer = brApp.map.getLayer('community_Occupied');

            params.tolerance = 3;
            params.returnGeometry = true;
            params.maxAllowableOffset = Math.floor(brApp.map.extent.getWidth() / brApp.map.width);
            params.width = brApp.map.width;
            params.height = brApp.map.height;
            params.geometry = mapPoint;
            params.mapExtent = brApp.map.extent;
            params.layerIds = mapLayer.visibleLayers;

            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;

            identifyTask.execute(params, function(features) {
                if (features.length > 0) {
                    deferred.resolve({
                        layer: "community_Occupied",
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



        identifyNational: function(mapPoint) {
            brApp.debug('MapController >>> identifyNational');

            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.layers.nationalLevel.url),
                params = new IdentifyParameters(),
                mapLayer = brApp.map.getLayer('nationalLevel');

            params.tolerance = 3;
            params.returnGeometry = true;
            params.maxAllowableOffset = Math.floor(brApp.map.extent.getWidth() / brApp.map.width);
            params.width = brApp.map.width;
            params.height = brApp.map.height;
            params.geometry = mapPoint;
            params.mapExtent = brApp.map.extent;
            params.layerIds = mapLayer.visibleLayers;

            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;

            identifyTask.execute(params, function(features) {
                if (features.length > 0) {
                    deferred.resolve({
                        layer: "nationalLevel",
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
        setCommunityTemplates: function(featureObjects) {
            brApp.debug('MapController >>> setCommunityTemplates');

            var template,
                features = [],
                statDate
                self = this;

            arrayUtils.forEach(featureObjects, function(item) {
                var ethnStr;
                var ethn1 = item.feature.attributes.Ethncity_1;
                var ethn2 = item.feature.attributes.Ethncity_2;
                var ethn3 = item.feature.attributes.Ethncity_3;

                if (!ethn1) {
                    ethnStr = 'Unknown';
                } else if (ethn1 && !ethn2) {
                    ethnStr = ethn1;
                } else if (ethn1 && ethn2 && !ethn3) {
                    ethnStr = ethn1 + ", " + ethn2;
                } else {
                    ethnStr = ethn1 + ", " + ethn2 + ", " + ethn3;
                }

                var popStr;

                var population = item.feature.attributes.Populatn == "Null" ? null : item.feature.attributes.Populatn;
                var popSource = item.feature.attributes.Pop_Source == "Null" ? null : item.feature.attributes.Pop_Source;
                var popYear = item.feature.attributes.Pop_Year == "Null" ? null : item.feature.attributes.Pop_Year;


                if (!population || population == 0) {
                    popStr = 'Unknown';
                } else if (population && !popSource) {
                    popStr = population;
                } else if (population && popSource && (!popYear || popYear == 0)) {
                    popStr = population + " - " + popSource;
                } else {
                    popStr = population + " - " + popSource + ", " + popYear;
                }

                for (var attr in item.feature.attributes) {
                    if (item.feature.attributes[attr] == "Null" || item.feature.attributes[attr] == "null" || item.feature.attributes[attr] == "" || item.feature.attributes[attr] == " ") {
                        item.feature.attributes[attr] = "Unknown";
                    }
                }

                if (item.feature.attributes.Stat_Date !== "Unknown") {
                    statDate = " (" + item.feature.attributes.Stat_Date + ")";
                } else {
                    statDate = '';
                }

                template = new InfoTemplate(item.value,
                    "<div id='tableWrapper'><table id='indigenousTable'>" +
                    "<tr class='even-row'><td class='popup-header'>Country</td><td>" + item.feature.attributes.Country + '</td></tr>' +

                    "<tr class='odd-row'><td class='popup-header'>Identity</td><td>" + item.feature.attributes.Identity + '</td></tr>' +

                    // "<tr class='even-row'><td class='popup-header'>Recognition status</td><td>" + item.feature.attributes.Ofcl_Rec + ', ' + item.feature.attributes.Rec_Status + ', ' + item.feature.attributes.Stat_Date + '</td></tr>' +
                    "<tr class='even-row'><td class='popup-header'>Recognition status</td><td>" + item.feature.attributes.Ofcl_Rec + '</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header'>Documentation status (Date)</td><td>" + item.feature.attributes.Ofcl_Rec + statDate + '</td></tr>' +

                    "<tr class='even-row'><td class='popup-header'>Land category</td><td>" + item.feature.attributes.Category + '</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header'>Ethnic groups</td><td>" + item.feature.attributes.ethnStr + '</td></tr>' +
                    "<tr class='even-row'><td class='popup-header'>Population</td><td>" + item.feature.attributes.popStr + '</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header'>Land Area</td><td>Official area (ha): " + self.numberWithCommas(item.feature.attributes.Area_Ofcl) + "<br>GIS area (ha): " + self.numberWithCommas(item.feature.attributes.Area_GIS) + '</td></tr>' +
                    "<tr class='even-row'><td class='popup-header'>Acquisition scale</td><td>" + item.feature.attributes.Scale + '</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header'>Acquisition method</td><td>" + item.feature.attributes.Method + '</td></tr>' +
                    "<tr class='even-row'><td class='popup-header'>Data source</td><td>" + item.feature.attributes.Data_Src + " (" + item.feature.attributes.Data_Date + ')</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header'>Data Contributor</td><td>" + item.feature.attributes.Data_Ctrb + '</td></tr></table></div>' +

                    "<div class='popup-last'>Date uploaded: " + item.feature.attributes.Upl_Date);

                if (item.feature.attributes.More_info == ' ' || item.feature.attributes.More_info == '' || item.feature.attributes.More_info == 'Unknown') {
                    template.content += '</div>';
                } else {
                    template.content += '<div><a href=' + item.feature.attributes.More_info + ' target="_blank" id="additionalInfo">More Info</a></div></div>';
                }

                // if (item.layerId === 1) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='http://gis.wri.org/arcgis/rest/services/IndigenousCommunityLands/CommunityLevel/MapServer/1/images/cb367806430a4eff5023972e9dc7ed51'>" + template.title;
                // } else if (item.layerId === 2) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='http://gis.wri.org/arcgis/rest/services/IndigenousCommunityLands/CommunityLevel/MapServer/2/images/6cd8315cd0efb924913ce4d7ce657e68'>" + template.title;
                // } else if (item.layerId === 3) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='http://gis.wri.org/arcgis/rest/services/IndigenousCommunityLands/CommunityLevel/MapServer/3/images/bb41d12d06bcb77d2fb2ef6c2105135e'>" + template.title;
                // } else if (item.layerId === 4) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='http://gis.wri.org/arcgis/rest/services/IndigenousCommunityLands/CommunityLevel/MapServer/4/images/0121e9c1b348c6d36126cefe0710db83'>" + template.title;
                // } else if (item.layerId === 6) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='http://gis.wri.org/arcgis/rest/services/IndigenousCommunityLands/CommunityLevel/MapServer/6/images/b72ac329a5a45aa83a95f1f39d72a603'>" + template.title;
                // } else if (item.layerId === 7) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='http://gis.wri.org/arcgis/rest/services/IndigenousCommunityLands/CommunityLevel/MapServer/7/images/2103e270d242ef28a32d531e4c0a4998'>" + template.title;
                // } else if (item.layerId === 8) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='http://gis.wri.org/arcgis/rest/services/IndigenousCommunityLands/CommunityLevel/MapServer/8/images/2fe6dcfe429decc73538da5456f11013'>" + template.title;
                // } else if (item.layerId === 11) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='http://gis.wri.org/arcgis/rest/services/IndigenousCommunityLands/CommunityLevel/MapServer/11/images/52aae8e63b7324665f6486cc687d9c26'>" + template.title;
                // } else if (item.layerId === 12) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='http://gis.wri.org/arcgis/rest/services/IndigenousCommunityLands/CommunityLevel/MapServer/12/images/17a2ba5e9b800c58f8857ec221f28311'>" + template.title;
                // } else if (item.layerId === 13) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='http://gis.wri.org/arcgis/rest/services/IndigenousCommunityLands/CommunityLevel/MapServer/13/images/b5ed0fdf7028b42276c6ce8d68806509'>" + template.title;
                // } else if (item.layerId === 14) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='http://gis.wri.org/arcgis/rest/services/IndigenousCommunityLands/CommunityLevel/MapServer/14/images/ee3198dd6bc5cc50c8ffa8074329856e'>" + template.title;
                // }

                // Content needs to be wrapped in a single parent div, otherwise on touch ArcGIS JavaScript API
                // will apply transform to first child and popup will not function and look like garbage, thanks esri/dojo
                template.content = '<div>' + template.content + '</div>';

                item.feature.setInfoTemplate(template);
                features.push(item.feature);
            });
            return features;
        },

        setIndigenousTemplates: function(featureObjects) {
            brApp.debug('MapController >>> setIndigenousTemplates');

            var template,
                features = [],
                statDate
                self = this;

            arrayUtils.forEach(featureObjects, function(item) {
                var ethnStr;
                var ethn1 = item.feature.attributes.Ethncity_1;
                var ethn2 = item.feature.attributes.Ethncity_2;
                var ethn3 = item.feature.attributes.Ethncity_3;

                if (!ethn1) {
                    ethnStr = 'Unknown';
                } else if (ethn1 && !ethn2) {
                    ethnStr = ethn1;
                } else if (ethn1 && ethn2 && !ethn3) {
                    ethnStr = ethn1 + ", " + ethn2;
                } else {
                    ethnStr = ethn1 + ", " + ethn2 + ", " + ethn3;
                }

                var popStr;

                var population = item.feature.attributes.Populatn == "Null" ? null : item.feature.attributes.Populatn;
                var popSource = item.feature.attributes.Pop_Source == "Null" ? null : item.feature.attributes.Pop_Source;
                var popYear = item.feature.attributes.Pop_Year == "Null" ? null : item.feature.attributes.Pop_Year;


                if (!population || population == 0) {
                    popStr = 'Unknown';
                } else if (population && !popSource) {
                    popStr = population;
                } else if (population && popSource && (!popYear || popYear == 0)) {
                    popStr = population + " - " + popSource;
                } else {
                    popStr = population + " - " + popSource + ", " + popYear;
                }

                for (var attr in item.feature.attributes) {
                    if (item.feature.attributes[attr] == "Null" || item.feature.attributes[attr] == "null" || item.feature.attributes[attr] == "" || item.feature.attributes[attr] == " ") {
                        item.feature.attributes[attr] = "Unknown";
                    }
                }

                if (item.feature.attributes.Stat_Date !== "Unknown") {
                    statDate = " (" + item.feature.attributes.Stat_Date + ")";
                } else {
                    statDate = '';
                }

                template = new InfoTemplate(item.value,
                    "<div id='tableWrapper'><table id='indigenousTable'>" +
                    "<tr class='even-row'><td class='popup-header'>Country</td><td>" + item.feature.attributes.Country + '</td></tr>' +

                    "<tr class='odd-row'><td class='popup-header'>Identity</td><td>" + item.feature.attributes.Identity + '</td></tr>' +

                    // "<tr class='even-row'><td class='popup-header'>Recognition status</td><td>" + item.feature.attributes.Ofcl_Rec + ', ' + item.feature.attributes.Rec_Status + ', ' + item.feature.attributes.Stat_Date + '</td></tr>' +
                    "<tr class='even-row'><td class='popup-header'>Recognition status</td><td>" + item.feature.attributes.Ofcl_Rec + '</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header'>Documentation status (Date)</td><td>" + item.feature.attributes.Ofcl_Rec + statDate + '</td></tr>' +

                    "<tr class='even-row'><td class='popup-header'>Land category</td><td>" + item.feature.attributes.Category + '</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header'>Ethnic groups</td><td>" + item.feature.attributes.ethnStr + '</td></tr>' +
                    "<tr class='even-row'><td class='popup-header'>Population</td><td>" + item.feature.attributes.popStr + '</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header'>Land Area</td><td>Official area (ha): " + self.numberWithCommas(item.feature.attributes.Area_Ofcl) + "<br>GIS area (ha): " + self.numberWithCommas(item.feature.attributes.Area_GIS) + '</td></tr>' +
                    "<tr class='even-row'><td class='popup-header'>Acquisition scale</td><td>" + item.feature.attributes.Scale + '</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header'>Acquisition method</td><td>" + item.feature.attributes.Method + '</td></tr>' +
                    "<tr class='even-row'><td class='popup-header'>Data source</td><td>" + item.feature.attributes.Data_Src + " (" + item.feature.attributes.Data_Date + ')</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header'>Data Contributor</td><td>" + item.feature.attributes.Data_Ctrb + '</td></tr></table></div>' +

                    "<div class='popup-last'>Date uploaded: " + item.feature.attributes.Upl_Date);

                if (item.feature.attributes.More_info == ' ' || item.feature.attributes.More_info == '' || item.feature.attributes.More_info == 'Unknown') {
                    template.content += '</div>';
                } else {
                    template.content += '<div><a href=' + item.feature.attributes.More_info + ' target="_blank" id="additionalInfo">More Info</a></div></div>';
                }

                // if (item.layerId === 1) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='http://gis.wri.org/arcgis/rest/services/IndigenousCommunityLands/CommunityLevel/MapServer/1/images/cb367806430a4eff5023972e9dc7ed51'>" + template.title;
                // } else if (item.layerId === 2) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='http://gis.wri.org/arcgis/rest/services/IndigenousCommunityLands/CommunityLevel/MapServer/2/images/6cd8315cd0efb924913ce4d7ce657e68'>" + template.title;
                // } else if (item.layerId === 3) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='http://gis.wri.org/arcgis/rest/services/IndigenousCommunityLands/CommunityLevel/MapServer/3/images/bb41d12d06bcb77d2fb2ef6c2105135e'>" + template.title;
                // } else if (item.layerId === 4) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='http://gis.wri.org/arcgis/rest/services/IndigenousCommunityLands/CommunityLevel/MapServer/4/images/0121e9c1b348c6d36126cefe0710db83'>" + template.title;
                // } else if (item.layerId === 6) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='http://gis.wri.org/arcgis/rest/services/IndigenousCommunityLands/CommunityLevel/MapServer/6/images/b72ac329a5a45aa83a95f1f39d72a603'>" + template.title;
                // } else if (item.layerId === 7) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='http://gis.wri.org/arcgis/rest/services/IndigenousCommunityLands/CommunityLevel/MapServer/7/images/2103e270d242ef28a32d531e4c0a4998'>" + template.title;
                // } else if (item.layerId === 8) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='http://gis.wri.org/arcgis/rest/services/IndigenousCommunityLands/CommunityLevel/MapServer/8/images/2fe6dcfe429decc73538da5456f11013'>" + template.title;
                // } else if (item.layerId === 11) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='http://gis.wri.org/arcgis/rest/services/IndigenousCommunityLands/CommunityLevel/MapServer/11/images/52aae8e63b7324665f6486cc687d9c26'>" + template.title;
                // } else if (item.layerId === 12) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='http://gis.wri.org/arcgis/rest/services/IndigenousCommunityLands/CommunityLevel/MapServer/12/images/17a2ba5e9b800c58f8857ec221f28311'>" + template.title;
                // } else if (item.layerId === 13) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='http://gis.wri.org/arcgis/rest/services/IndigenousCommunityLands/CommunityLevel/MapServer/13/images/b5ed0fdf7028b42276c6ce8d68806509'>" + template.title;
                // } else if (item.layerId === 14) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='http://gis.wri.org/arcgis/rest/services/IndigenousCommunityLands/CommunityLevel/MapServer/14/images/ee3198dd6bc5cc50c8ffa8074329856e'>" + template.title;
                // }

                // Content needs to be wrapped in a single parent div, otherwise on touch ArcGIS JavaScript API
                // will apply transform to first child and popup will not function and look like garbage, thanks esri/dojo
                template.content = '<div>' + template.content + '</div>';

                item.feature.setInfoTemplate(template);
                features.push(item.feature);
            });
            return features;
        },

        setNationalTemplates: function(featureObjects) {
            brApp.debug('MapController >>> setNationalTemplates');

            var template,
                features = [],
                self = this;

            arrayUtils.forEach(featureObjects, function(item) {


                if (item.layerId === 2 || item.layerId === 3 || item.layerId === 4) {

                    template = new InfoTemplate(item.value, '');

                    for (var attr in item.feature.attributes) {
                        if (item.feature.attributes[attr] == "Null" || item.feature.attributes[attr] == "null" || item.feature.attributes[attr] == "" || item.feature.attributes[attr] == " ") {
                            if (attr.indexOf('Notes') == -1) {
                                item.feature.attributes[attr] = "Unknown";
                            } else {
                                item.feature.attributes[attr] = "None";
                            }
                            console.log(item.feature.attributes[attr])

                        }
                    }

                    template.content = "<div id='tableWrapper'><table id='nationalTable'>" +
                    "<tr class='even-row'><td class='popup-header nationalField'>Percent of Country Area Held or Used by Indigenous Peoples and Communities</td><td><div>Total: " + item.feature.attributes.IPC_Pct + '%</div><div class="indentTD">Formally recognized: ' + item.feature.attributes.IPC_Pct + '%</div><div class="indentTD">Not formally recognized: ' + item.feature.attributes.IPC_Pct + '%</div></td></tr>' +
                    "<tr class='odd-row'><td class='popup-header nationalField'>Source (Date)</td><td>" + item.feature.attributes.IPC_Src + '</td></tr>' +
                    "<tr class='even-row'><td class='popup-header nationalField'>Notes</td><td>" + item.feature.attributes.IPC_Notes + '</td></tr>' +

                    "<tr class='odd-row'><td class='popup-header nationalField'>Percent of country area held or used by Indigenous Peoples only</td><td><div>Total: " + item.feature.attributes.Ind_Pct + '%</div><div class="indentTD">Formally recognized: ' + item.feature.attributes.Ind_Pct + '%</div><div class="indentTD">Not formally recognized: ' + item.feature.attributes.Ind_Pct + '%</div></td></tr>' +
                    "<tr class='even-row'><td class='popup-header nationalField'>Source (Date)</td><td>" + item.feature.attributes.Ind_Src + '</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header nationalField'>Notes</td><td>" + item.feature.attributes.Ind_Notes + '</td></tr>' +

                    "<tr class='even-row'><td class='popup-header nationalField'>Percent of country area held or used by communities only</td><td><div>Total: " + item.feature.attributes.Com_Pct + '%</div><div class="indentTD">Formally recognized: ' + item.feature.attributes.Com_Pct + '%</div><div class="indentTD">Not formally recognized: ' + item.feature.attributes.Com_Pct + '%</div></td></tr>' +
                    "<tr class='odd-row'><td class='popup-header nationalField'>Source (Date)</td><td>" + item.feature.attributes.Com_Src + '</td></tr>' +
                    "<tr class='even-row'><td class='popup-header nationalField'>Notes</td><td>" + item.feature.attributes.Com_Notes + '</td></tr></table></div>' +

                    "<div class='popup-last'>Date uploaded: " + item.feature.attributes['Upl_Date'] + "</div>";


                    // Content needs to be wrapped in a single parent div, otherwise on touch ArcGIS JavaScript API
                    // will apply transform to first child and popup will not function and look like garbage, thanks esri/dojo
                    // template.content = '<div>' + template.content + '</div>';

                    item.feature.setInfoTemplate(template);
                } else { //layers 0 and 1

                    item.feature.setInfoTemplate(self.setCustomNationalTemplate(item.feature));
                }


                // if (item.layerId === 1) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='css/images/formalDocIcon.png'> " + template.title;
                // } else if (item.layerId === 2) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='css/images/tiltingIcon.png'> " + template.title;
                // } else if (item.layerId === 3) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='css/images/formalLandIcon.png'> " + template.title;
                // }

                //item.feature.setInfoTemplate(template);

                features.push(item.feature);
            });
            console.log(features);
            return features;
        },

        setCustomNationalTemplate: function(feature) {
            brApp.debug('MapController >>> setCustomNationalTemplate');
            var indScore, framework, comments, laws, reviewSource, reviewDate, uploadDate;
            var nationalIndicatorCode = MapAssets.getNationalLevelIndicatorCode();
            var stringified = "I" + nationalIndicatorCode + "_Scr";

            var indicator = feature.attributes[stringified];

            switch (indicator) {
                case "0":
                    indScore = 'No review yet done';
                    break;
                case "1":
                    indScore = 'The law is either silent on an issue or there is express exclusion';
                    break;
                case "2":
                    indScore = 'The legal framework addresses the indicator but not substantively';
                    break;
                case "3":
                    indScore = 'The legal framework substantially meets the indicator';
                    break;
                case "4":
                    indScore = 'The legal framework fully meets the indicator';
                    break;
                case "9":
                    indScore = 'The indicator is not applicable';
                    break;
            }

            for (var attr in feature.attributes) {
                if (feature.attributes[attr] == "Null") {
                    feature.attributes[attr] = "Unknown";
                }
            }

            framework = feature.attributes["Framework"];
            comments = feature.attributes["I" + nationalIndicatorCode + "_Com"];
            laws = feature.attributes["I" + nationalIndicatorCode + "_LaP"];
            reviewSource = feature.attributes["I" + nationalIndicatorCode + "_Rev"];
            reviewDate = feature.attributes["I" + nationalIndicatorCode + "_Year"];
            uploadDate = feature.attributes["Upl_Date"];

            var nationalLevelInfoTemplatePercent = new InfoTemplate("${Country}",
                // "<div class='odd-row'><div class='popup-header'>" + brApp.currentLayer + "</div>" +
                // Content needs to be wrapped in a single parent div, otherwise on touch ArcGIS JavaScript API
                // will apply transform to first child and popup will not function and look like garbage, thanks esri/dojo
                // "<div>" +
                // "<div class='odd-row'><div class='popup-header'>Groups targeted by the legal framework</div>" + framework + "</div>" +
                // "<div class='even-row'><div class='popup-header'>Indicator score</div>" + indScore + "</div>" +
                // "<div class='odd-row'><div class='popup-header'>Comments</div>" + comments + "</div>" +
                // "<div class='even-row'><div class='popup-header'>Laws and provisions reviewed</div>" + laws + "</div>" +
                // "<div class='odd-row'><div class='popup-header'>Review source and date</div>" + reviewSource + " (" + reviewDate + ")</div>" +
                // "<div class='popup-last'>Last Updated: " + uploadDate +
                // "</div>"

                "<div id='tableWrapper'><table id='landTenureTable'>" +
                "<tr class='odd-row'><td class='popup-header tenureField'>Groups targeted by the legal framework</td><td>" + framework + '</td></tr>' +
                "<tr class='even-row'><td class='popup-header tenureField'>Indicator score</td><td>" + indScore + '</td></tr>' +
                "<tr class='odd-row'><td class='popup-header tenureField'>Comments</td><td>" + comments + '</td></tr>' +
                "<tr class='even-row'><td class='popup-header tenureField'>Laws and provisions reviewed</td><td>" + laws + '</td></tr>' +
                "<tr class='odd-row'><td class='popup-header tenureField'>Review source and date</td><td>" + comments + '</td></tr></table></div>' +
                "<div class='popup-last'>Last Updated: " + uploadDate + "</div>"


            );

            return nationalLevelInfoTemplatePercent;

        },

        selectCustomGraphics: function(mapPoint) {
            brApp.debug('MapController >>> selectCustomGraphics');

            brApp.mapPoint = mapPoint;

            var graphic = mapPoint.graphic,
                graphicsLayer = brApp.map.getLayer("CustomFeatures"),
                dataLayer = brApp.map.getLayer("analysisLayer"),

                self = this,
                polys = [],
                poly,
                content,
                title;

            mapPoint.stopPropagation();

            if (brApp.map.infoWindow.isShowing) {
                brApp.map.infoWindow.hide();
            }


            var failure = function(err) {
                console.log(err);
            };

            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(dataLayer.url),
                params = new IdentifyParameters();

            params.tolerance = 3;
            params.returnGeometry = false;
            params.width = brApp.map.width;
            params.height = brApp.map.height;
            params.geometry = mapPoint.graphic.geometry;
            params.mapExtent = brApp.map.extent;
            params.layerIds = dataLayer.visibleLayers;
            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
            if (params.layerIds.indexOf(17) > -1) {
                params.layerIds.splice(params.layerIds.indexOf(17), 1);
            }

            identifyTask.execute(params, function(features) {

                if (features.length > 0) {
                    console.log(features);
                    deferred.resolve({
                        layer: "indigenousLands",
                        features: features
                    });

                } else {
                    console.log("no feats returned");

                    var template = new InfoTemplate();
                    template.setContent("<b>The area of interest intersects with <i>Zero</i> indigenous and/or community lands</b><button id='removeGraphic'>Remove</button>");
                    brApp.map.infoWindow.setContent(template.content);
                    brApp.map.infoWindow.setTitle("Analysis Results");
                    //$(".esriPopup").addClass("analysis-location");
                    $(".esriPopup .titleButton.close").css('background-image', 'url("css/images/close_x_symbol.png")');
                    $("#identifyNote").remove();
                    brApp.map.infoWindow.show(mapPoint);

                    var handle = on.once(document.getElementById('removeGraphic'), 'click', function() {
                        self.removeCustomGraphic(graphic.attributes.attributeID);
                        brApp.map.infoWindow.hide();
                    });

                    on.once(brApp.map.infoWindow, "hide", function() {
                        //$(".esriPopup").removeClass("analysis-location");
                        handle.remove();
                    });
                    deferred.resolve(false);
                }
            }, function(error) {
                deferred.resolve(false);
            });
            deferred.then(function(value) {


                if (!value) {
                    return;
                }

                var template = new InfoTemplate();


                template.setContent("<table id='analysisTable'><tr id='column-header'><td class='country'><b>Country</b></td><td class='name'><b>Name</b></td><td class='ident'><b>Identity</b></td><td class='offic_rec'><b>Official Recognition</b></td><td class='rec_status'><b>Recognition Status</b></td></tr><tr id='fillerColumn' style='height: 26px;'><td><b></b></td><td><b></b></td><td><b></b></td><td><b></b></td><td><b></b></td></tr>");

                var fields = ["Country", "Name", "Identity", "Official Recognition", "Recognition Status"];

                brApp.csv = fields.join(",") + '\n';


                function getTextContent(graphic, even) {
                    if (graphic.feature.attributes.Identity === "Indigenous (self-identified)") {
                        graphic.feature.attributes.Identity = "Indigenous";
                    }
                    if (graphic.feature.attributes.Identity === "Non-indigenous (self-identified)") {
                        graphic.feature.attributes.Identity = "Community";
                    }
                    if (graphic.feature.attributes.Ofcl_Rec === "Officially recognized (by law or decree)") {
                        graphic.feature.attributes.Ofcl_Rec = "Officially recognized";
                    }

                    var str;
                    if (even === "even") {

                        str = "<tr class='even-row'><td class='country'>" + graphic.feature.attributes.Country + "</td><td class='name'>" +
                            graphic.feature.attributes.Name + "</td><td class='ident'>" +
                            graphic.feature.attributes.Identity + "</td><td class='offic_rec'>" +
                            graphic.feature.attributes.Ofcl_Rec + "</td><td class='rec_status'>" +
                            graphic.feature.attributes.Rec_Status + "</td></tr>";
                        var fieldValues = [graphic.feature.attributes.Country, graphic.feature.attributes.Name, graphic.feature.attributes.Identity, graphic.feature.attributes.Ofcl_Rec, graphic.feature.attributes.Rec_Status];
                        brApp.csv += fieldValues.join(",") + '\n';

                    } else {
                        str = "<tr class='odd-row'><td>" + graphic.feature.attributes.Country + "</td><td class='name'>" +
                            graphic.feature.attributes.Name + "</td><td class='ident'>" +
                            graphic.feature.attributes.Identity + "</td><td class='offic_rec'>" +
                            graphic.feature.attributes.Ofcl_Rec + "</td><td class='rec_status'>" +
                            graphic.feature.attributes.Rec_Status + "</td></tr>";
                        var fieldValues = [graphic.feature.attributes.Country, graphic.feature.attributes.Name, graphic.feature.attributes.Identity, graphic.feature.attributes.Ofcl_Rec, graphic.feature.attributes.Rec_Status];
                        brApp.csv += fieldValues.join(",") + '\n';
                    }


                    return str;
                }


                for (var i = 0; i < value.features.length; i++) {
                    //if i is odd use odd row else use even row class
                    if (i % 2 == 0) {
                        template.content = template.content + getTextContent(value.features[i], 'even');
                    } else {
                        template.content = template.content + getTextContent(value.features[i], 'odd');
                    }

                }


                template.content += "</table>";
                var theTitle = "<div id='title_title'>Analysis Results</div>";
                var titleResults = "<div id='titleResults'><i>The area of interest intersects with " + value.features.length + " indigenous and/or community lands</i></div>";
                brApp.map.infoWindow.setTitle(theTitle + titleResults);
                //brApp.map.infoWindow.setTitle("temp");
                brApp.map.infoWindow.setContent(template.content);

                brApp.map.infoWindow.resize(650, 350);


                $("#identifyNote").remove();

                var extraContent = "<div id='identifyNote'><div id='buttonBox'><button id='removeGraphic'>Remove</button><button id='exportAnalysis'>Export Analysis</button></div><div style='padding:5px;'>Note that the results of this analysis are only as complete as the data available on the platform. Additional indigenous and community lands may be present but are not contained in the available dataset; therefore, a local analysis is always recommended. The Data Completeness layer provides a broad assesment of the completeness of the indigenous and community lands data layer for a reference.</div></div>";


                $('.esriPopupWrapper').append(extraContent);
                $('.esriPopupWrapper').addClass("noPositioning");

                //$(".esriPopup").addClass("analysis-location");
                $(".esriPopup .titleButton.close").css('background-image', 'url("css/images/close_x_symbol.png")');

                // if (Helper.isMobile()) {
                //     brApp.map.infoWindow.maximize();
                // }
                //$(".pointer").hide();


                arrayUtils.forEach(brApp.map.infoWindow.domNode.children, function(node) {
                    if (node) {
                        var newNode = node.cloneNode(true);
                        $("#infowindowContainer").append(newNode);

                    }
                });

                var newHeight = (value.features.length * 44) + 210; //TODO: we gotta adjust these!
                newHeight += "px";
                $("#infowindowContainer").css("height", newHeight);

                $("#infowindowContainer").show();

                //brApp.map.infoWindow.show(mapPoint.mapPoint);


                // brApp.map.infoWindow.move(screenPoint);

                // brApp.map.infoWindow.maximize();
                // brApp.map.infoWindow.show();
                // brApp.map.infoWindow.resize(650, 250);


                var handle = on.once(document.getElementById('removeGraphic'), 'click', function() {

                    self.removeCustomGraphic(graphic.attributes.attributeID);
                    $("#infowindowContainer").html('');
                    //brApp.map.infoWindow.hide();
                    //$("#identifyNote").remove();
                    $("#infowindowContainer").hide();
                    $('.esriPopupWrapper').removeClass("noPositioning");
                });



                $("div.titleButton.close").click(function() {
                    $("#infowindowContainer").html('');
                    //$(".esriPopup").removeClass("analysis-location");
                    $("#infowindowContainer").hide();
                    handle.remove();
                    $('.esriPopupWrapper').removeClass("noPositioning");
                });


                var parent = $("#analysisTable").parent()[0];
                var table = $("#analysisTable")[0];

                if (table.scrollHeight > parent.clientHeight) {

                    $("#analysisTable").removeClass("moreWidth");
                    $("#column-header").removeClass("moreWidth");
                } else {
                    $("#analysisTable").addClass("moreWidth");
                    $("#column-header").addClass("moreWidth");
                }
                // if (value.features.length > 7) { //todo is 7 the correct # of feats??

                //     //el.scrollHeight > el.clientHeight // this should tell us if there is a vertical scrollbar (and thus to add the extra width). By what is el here?

                //     $("#analysisTable").removeClass("moreWidth");
                //     $("#column-header").removeClass("moreWidth");
                // } else {

                //     $("#analysisTable").addClass("moreWidth");
                //     $("#column-header").addClass("moreWidth");
                // }
                on.once(document.getElementById('exportAnalysis'), 'click', function() {

                    self.exportAnalysisResult(brApp.csv);
                });

                //$(".esriPopup .titleButton.close").html("&#10005;");

            });


        },

        removeCustomGraphic: function(uniqueId) {

            var graphics = brApp.map.getLayer("CustomFeatures"),
                graphicToRemove;

            arrayUtils.some(graphics.graphics, function(graphic) {
                if (graphic.attributes["attributeID"] === uniqueId) {
                    graphicToRemove = graphic;
                    return true;
                }
                return false;
            });

            if (graphicToRemove) {

                graphics.remove(graphicToRemove);

            }
        },

        removeAllGraphics: function() {
            var graphics = brApp.map.getLayer("CustomFeatures");
            graphics.clear();
            graphics.redraw();
            $('#remove-graphics').addClass('hidden');
            $('#draw-shape').removeClass('display-three');
            $('#upload-shapefile').removeClass('display-three');
        },

        // changeOpacity: function(op) {
        //     brApp.debug('MapController >>> changeOpacity');
        //     var dataCompleteness = brApp.map.getLayer("indigenousTransparency");
        //     dataCompleteness.setOpacity(op / 100);

        // },

        queryEmptyLayers: function() {
            brApp.debug('MapController >>> queryEmptyLayers');

            var notRecognizedQT = new QueryTask("http://gis.wri.org/arcgis/rest/services/IndigenousCommunityLands/CommunityLevel/MapServer/4");

            var recognizeQuery = new Query();
            recognizeQuery.spatialReference = brApp.map.spatialReference;
            recognizeQuery.returnGeometry = false;
            recognizeQuery.outFields = ["OBJECTID"];
            recognizeQuery.where = "1=1";

            notRecognizedQT.execute(recognizeQuery, function(result) {
                if (result.features.length > 0) {
                    $(".layerToShow").show(); //show the two checkboxes
                }
            });

        },
        getLandTenureRenderer: function() {
            brApp.debug('MapController >>> getLandTenureRenderer');
            var requestHandle = esriRequest({
                "url": "http://gis.wri.org/arcgis/rest/services/IndigenousCommunityLands/NationalLevel/MapServer/0", //change to layer url
                "content": {
                    "f": "json"
                },
                "callbackParamName": "callback"
            });
            requestHandle.then(function(response) {
                var noReviewSymbol, lawSilentSymbol, legalAddressesSymbol,
                    legalMeetsSymbol, legalFullyMeetsSymbol, notApplicableSymbol,
                    renderer;


                brApp.landTenureRenderer = response.drawingInfo.renderer;

            });
        },


        // showDataComplete: function() {
        //     brApp.debug('MapController >>> showDataComplete');

        //     var complete = brApp.map.getLayer('indigenousTransparency');

        //     var imageUrlChecked = "url('css/images/checkbox_checked.png')";
        //     var imageUrlUnchecked = "css/images/checkbox_unchecked.png";

        //     if (this.getAttribute("data-checked") === 'false') {

        //         $('#data-complete-checkbox').removeClass('data-complete-checkbox-class').addClass('data-complete-checkbox-class-checked');
        //         complete.visibleLayers.push(17);
        //         this.setAttribute("data-checked", "true")
        //         $("#completeness-slider").show();
        //     } else {
        //         $('#data-complete-checkbox').removeClass('data-complete-checkbox-class-checked').addClass('data-complete-checkbox-class');
        //         var index = complete.visibleLayers.indexOf(17);
        //         complete.visibleLayers.splice(index, 1);
        //         this.setAttribute("data-checked", "false")
        //         $("#completeness-slider").hide();
        //     }
        //     topic.publish('refresh-legend');
        //     if (complete.visibleLayers.indexOf(17) > -1) {
        //         complete.show();
        //     }
        //     complete.setVisibleLayers(complete.visibleLayers);

        // },

        handleNationalToggle: function(evt) {
            brApp.debug('MapController >>> handleNationalToggle');
            var target = evt.target ? evt.target : evt.srcElement,
                menuNode = document.querySelector('.national-segmented-menu-button.active'),
                //containerNode = document.querySelector('.mobile-menu-content.active'),
                id;

            // If section is already active, back out now
            // Else remove active class from target and containerNode
            if (domClass.contains(target, 'active')) {
                return;
            }

            if (menuNode) {
                domClass.remove(menuNode, 'active');
                //TODO?
                // domClass.add(menuNode, 'hidden');
            }

            // if (containerNode) {
            //     domClass.remove(containerNode, 'active');
            // }
            //TODO: Why does the whole list shift to the left and hide the tree-toggle-symbol and its span label And its span 'tree-node-lablal'??? -->Its a React thing: the whole 'checkbox-tree' class (which is a parent of all of these) is replaced by a new one which doesn't have that  --> Also this is not where this happens; its probably within the React tree logic itself

            // Now add the active class to the target and to the container
            switch (target.id) {
                case "nationalCommunityMenuButton":
                    id = 'national-level-tree-community';
                    domClass.add('national-level-tree-indigenous', 'hidden');
                    domClass.remove('national-level-tree-percentage', 'hidden');
                    break;
                case "nationalIndigenousMenuButton":
                    id = 'national-level-tree-indigenous';
                    domClass.remove('national-level-tree-indigenous', 'hidden');
                    domClass.add('national-level-tree-percentage', 'hidden');

                    domClass.remove
                    break;
                case "nationalPercentageMenuButton":
                    id = 'national-level-tree-percentage';
                    domClass.add('national-level-tree-indigenous', 'hidden');
                    domClass.add('national-level-tree-community', 'hidden');
                    break;
                case "land-tenure-toggle":
                    id = 'national-level-data-container';
                    domClass.add('national-level-tree-percentage', 'hidden');
                    //domClass.remove('national-level-tree-percentage', 'active');
                    domClass.remove('national-level-data-container', 'hidden');
                    //domClass.add('national-level-tree-community', 'hidden');
                    break;
                case "percent-national-toggle":
                    id = 'national-level-tree-percentage';
                    //domClass.remove('national-level-tree-percentage', 'hidden');
                    domClass.remove('national-level-tree-percentage', 'hidden');
                    domClass.add('national-level-data-container', 'hidden');
                    //domClass.remove('national-level-tree-percentage', 'hidden');
                case "none-toggle":

                    //id = 'national-level-tree-percentage';
                    domClass.add('national-level-data-container', 'hidden');
                    domClass.add('national-level-tree-percentage', 'hidden');
                    break;

            }

            domClass.add(target, 'active');
            // domClass.add(id, 'active');
            // domClass.remove(id, 'hidden');

        },

        exportAnalysisResult: function(text) {
            brApp.debug('MapController >>> exportAnalysisResult');

            var blob = new Blob([text], {
                type: "text/csv;charset=utf-8;"
            });

            saveAs(blob, "LandMarkAnalysisResults.csv");

        },

        numberWithCommas: function(x) {
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            //return parts.join(".");
            return parts[0];
        },

        printAnalysis: function(config) {
            brApp.debug('MapController >>> printAnalysis');
            window.print();

        },

        refreshLegend: function() {
            brApp.debug('MapController >>> refreshLegend');

            // var layerInfos = layersAdded.layers.map(function(layer) {
            //         console.log(layer.layer)
            //         var li = {
            //           layer: layer.layer,
            //         };
            //         if (layer.layer.id === "indigenousLands") {
            //             li.hideLayers = [1,2,3,4];
            //         }
            //         return li;
            //     });

            //     var legend = new Legend({
            //         map: brApp.map,
            //         layerInfos: layerInfos,
            //         autoUpdate: false
            //     }, "legend");
            //     legend.startup();

            //     requestAnimationFrame(function() {
            //         console.log("Done")
            //         legend.refresh(layerInfos)
            //     })
            registry.byId('legend').refresh();

        }

    };

    return MapController;

});
