define([
    'main/config',
    'map/Map',
    'map/Uploader',
    'map/DrawTool',
    'map/MapConfig',
    'map/MapAssets',
    'components/LayerTabContainer',
    'components/LegendComponent',
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
    'esri/dijit/Legend',
    'esri/dijit/HomeButton',
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

], function(AppConfig, Map, Uploader, DrawTool, MapConfig, MapAssets, LayerTabContainer, LegendComponent, WidgetsController, Helper, on, dojoQuery, domClass, domConstruct, arrayUtils, all, Deferred, dojoNumber, topic, Toggler, registry, ContentPane, Legend, HomeButton, BasemapGallery, Scalebar, esriRequest, Point, Polygon, IdentifyTask, IdentifyParameters, InfoTemplate, Query, QueryTask, HorizontalSlider, HorizontalRuleLabels, LayerDrawingOptions) {

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
            esri.config.defaults.io.corsEnabledServers.push("http://gis.wri.org");
            var self = this;
            // mapObject is not esri/map, it is a wrapper for creating the map and layers
            var mapObject = new Map(MapConfig.options);
            // Make the esri/map available in the global context so other modules can access easily
            brApp.map = mapObject.map;

            // Bind Events now, Map Events then UI Events
            mapObject.on('map-ready', function() {
                self.renderComponents();
            });

            // on(document.getElementById('legend-toggle'), 'click', WidgetsController.toggleLegend);
            on(document.getElementById('basemap-button'), 'click', WidgetsController.toggleBasemapGallery.bind(WidgetsController));
            on(document.getElementById('share-button'), 'click', WidgetsController.toggleShareContainer.bind(WidgetsController));
            on(document.getElementById('print-button'), 'click', WidgetsController.printMap);

            on(document.getElementById('tree-title-pane'), 'click', WidgetsController.toggleTreeContainer);

            on(document.getElementById('analysis-button'), 'click', function() {
                if (this.classList.contains("grayOut")) {
                    return;
                }
                var customGraphics = brApp.map.getLayer("CustomFeatures");
                WidgetsController.showAnalysisDialog(customGraphics);
            });

            on(document.getElementById('upload-shapefile'), 'click', WidgetsController.toggleUploadForm);
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
                        case "percentLands":
                            li.hideLayers = [];

                            break;
                        case "landTenure":
                            li.hideLayers = [];
                            break;
                        default:
                            li.hideLayers = [0];
                            break;
                    }
                    return li;
                });

                var deferreds = layersAdded.layers.filter(function(layer) {
                  var url = layer.layer.url;
                  return url; //truthy
                }).map(function(layer) {
                  var url = layer.layer.url;
                  if (url) {
                    var legend_url = [url,'legend'].join('/');
                  }
                  var deferred = new Deferred();
                  self.esriRequestCall(legend_url, {f:'json'}).then(function(response){
                      deferred.resolve({layerId:layer.layer.id,data:response});
                  });
                  return deferred;
                });

                all(deferreds).then(function(layers){

                  brApp.layerInfos = layers;

                  var legendComponent = new LegendComponent('legend-component');
                  topic.publish('legend-loaded');
                  on(document.getElementById('layersMenuButton'), 'click', WidgetsController.toggleMobileMenuContainer);
                  on(document.getElementById('legendMenuButton'), 'click', WidgetsController.toggleMobileMenuContainer);
                  on(document.getElementById('toolsMenuButton'), 'click', WidgetsController.toggleMobileMenuContainer);

                });

            });

            //TODO: Check the presence of the analysis and data completeness buttons on smaller screens AFTER a layer is toggled on (if all layers were off)
            // --> In layerController's updateVisibleLayers function.

            // Mobile Specific Events
            // If we are ok with the app not responding to mobile, only loading in mobile or loading in Desktop
            // We could conditionally add handles for the above and below events by using Helper.isMobile()
            on(document.getElementById('mobile-menu-toggle'), 'click', WidgetsController.toggleMobileMenu);
            on(document.getElementById('mobile-menu-close'), 'click', WidgetsController.toggleMobileMenu);

            on(document.getElementById('embedShare'), 'click', WidgetsController.showEmbedCode);

            $('#print-button').mouseenter(function() {
                $("#print-button-tt").show();
            });
            $('#print-button').mouseleave(function() {
                $("#print-button-tt").hide();
            });

            // Hack for the print service, tiled layers need to be added to operational layers
            // when the zoom level is less then 9 to force legends to show in the printout, due to the way we are
            // showing tiled layers up to 9 and then dynamic from there on out
            esriRequest.setRequestPreCallback(function (ioArgs) {
              if (ioArgs.url !== AppConfig.printUrl + '/execute') {
                return ioArgs;
              }

              // Print Request
              // If zoom level is greater then 8, remove layer 0, after this is only necessary for zoom levels 0 - 8
              if (brApp.map.getZoom() > 8) {
                var webmapJson = JSON.parse(ioArgs.content.Web_Map_as_JSON);
                var operationalLayers = webmapJson.layoutOptions.legendOptions.operationalLayers;
                operationalLayers.forEach(function (layer) {
                  if (layer.subLayerIds && layer.subLayerIds.length === 2) {
                    layer.subLayerIds = layer.subLayerIds.slice(1);
                  }
                })
                webmapJson.layoutOptions.legendOptions.operationalLayers = operationalLayers;
                ioArgs.content.Web_Map_as_JSON = JSON.stringify(webmapJson);
                return ioArgs;
              } else {
                // Get print JSON that needs to be modified
                var webmapJson = JSON.parse(ioArgs.content.Web_Map_as_JSON);
                var operationalLayers = webmapJson.layoutOptions.legendOptions.operationalLayers;
                // Get an array of tiled layer names
                var tiledLayers = brApp.map.layerIds.filter(function (name) { return name.search('Tiled') > -1; });
                // If the layer is visible, add it to the list
                tiledLayers.forEach(function (layerId) {
                  var layer = brApp.map.getLayer(layerId);
                  if (layer && layer.visible && layer.visibleAtMapScale) {
                    operationalLayers.push({
                      "id": layer.id,
                      // We only want Layer 1 at the moment, as layer 0 is a points layer we dont want to show
                      "subLayerIds": layer.visibleLayers.slice(1)
                    });
                  }
                });

                webmapJson.layoutOptions.legendOptions.operationalLayers = operationalLayers;
                ioArgs.content.Web_Map_as_JSON = JSON.stringify(webmapJson);
                // Must return ioArgs
                return ioArgs;
              }

            });

        },

        /**
         *	Render various components onto the map
         */
        renderComponents: function() {
            brApp.debug('MapController >>> renderComponents');
            var basemapGallery,
                self = this,
                tabContainer,
                legendComponent,
                homeWidget,
                scalebar,
                node;

            // Build/Insert DOM nodes as Needed

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

            scalebar = new Scalebar({
                map: brApp.map,
                attachTo: "bottom-center",
                scalebarUnit: "metric"
            });

            tabContainer = new LayerTabContainer('layer-content');

            // Start all widgets that still need to be started
            basemapGallery.startup();
            homeWidget.startup();


            self.getLandTenureRenderer();

            // Initialize the draw tools
            DrawTool.init();

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

        esriRequestCall: function(url,content){
          //Wrapper around esri.request call
          //sends POST request to url with content as JSON
          var deferred = new Deferred();
          var layersRequest = esri.request({
            url: url,
            content: content,
            handleAs: "json"
          },{usePost:true});
          layersRequest.then(
            function(response) {
              deferred.resolve(response);
          }, function(error) {
              console.log("Error: ", error.message);
              deferred.resolve(error);

          });

          return deferred;
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
                percentLayer,
                landTenure,
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

            percentLayer = brApp.map.getLayer('percentLands');

            if (percentLayer) {
                if (percentLayer.visible) {
                    deferreds.push(self.identifyPercentLayer(mapPoint));
                }
            }

            landTenure = brApp.map.getLayer('landTenure');

            if (landTenure) {
                if (landTenure.visible && landTenure.visibleLayers.indexOf(-1) !== 0) {
                    deferreds.push(self.identifyLandTenure(mapPoint));
                }
            }

            if (deferreds.length === 0) {
                return;
            }

            all(deferreds).then(function(featureSets) {
                arrayUtils.forEach(featureSets, function(item) {
                    switch (item.layer) {
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

                        case "landTenure":
                            features = features.concat(self.setLandTenureTemplates(item.features));
                            break;
                        case "percentLands":
                            features = features.concat(self.setPercentLandsTemplates(item.features));
                            break;
                        default: // Do Nothing
                            break;
                    }
                });

                if (features.length > 0) {
                    brApp.map.infoWindow.setFeatures(features);
                    brApp.map.infoWindow.resize(450, 600);

                    // $(".esriPopup").removeClass("analysis-location");
                    // $(".esriPopup .titleButton.close").css('background-image', 'url("css/images/close_x_symbol.png")');
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

        identifyPercentLayer: function(mapPoint) {
            brApp.debug('MapController >>> identifyPercentLayer');

            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.layers.percentLands.url),
                params = new IdentifyParameters(),
                mapLayer = brApp.map.getLayer('percentLands');

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
                        layer: "percentLands",
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

        identifyLandTenure: function(mapPoint) {
            brApp.debug('MapController >>> identifyLandTenure');

            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.layers.landTenure.url),
                params = new IdentifyParameters(),
                mapLayer = brApp.map.getLayer('landTenure');


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
                        layer: "landTenure",
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
                var ethn1 = item.feature.attributes.Ethncty_1;
                var ethn2 = item.feature.attributes.Ethncty_2;
                var ethn3 = item.feature.attributes.Ethncty_3;


                if (!ethn1 || ethn1 == ' ') {
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


                if (!population || population == '0') {
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

                    // "<tr class='even-row'><td class='popup-header'>Recognition status</td><td>" + item.feature.attributes.Form_Rec + ', ' + item.feature.attributes.Doc_Status + ', ' + item.feature.attributes.Stat_Date + '</td></tr>' +
                    "<tr class='even-row'><td class='popup-header'>Recognition status</td><td>" + item.feature.attributes.Form_Rec + '</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header'>Documentation status (Date)</td><td>" + item.feature.attributes.Doc_Status + statDate + '</td></tr>' +

                    "<tr class='even-row'><td class='popup-header'>Land category</td><td>" + item.feature.attributes.Category + '</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header'>Ethnic groups</td><td>" + ethnStr + '</td></tr>' +
                    "<tr class='even-row'><td class='popup-header'>Population</td><td>" + popStr + '</td></tr>' +
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

                var newLayerID;

                switch (item.layerName) {
                  case "Formal documentation":
                    newLayerID = 'community_FormalDoc';
                      break;
                  case "In process of documentation":
                    newLayerID = 'community_InProcess';
                    break;
                  case "No documentation":
                    newLayerID = 'community_NoDoc';
                    break;
                  case "Formal land petition":
                    newLayerID = 'community_FormalClaim';
                    break;
                  case "Occupied or used without formal land petition":
                    newLayerID = 'community_Occupied';
                    break;
                  default:
                    newLayerID = 'none';
                    break;
                }

                for (var j = 0; j < brApp.layerInfos.length; j++) {
                  if (newLayerID === brApp.layerInfos[j].data.layer) {
                    template.title = '<img class="legend-item-img" src="data:image/png;base64,' + brApp.layerInfos[j].data.layers[1].legend[0].imageData + '">' + template.title;
                  }
                }

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
                var ethn1 = item.feature.attributes.Ethncty_1;
                var ethn2 = item.feature.attributes.Ethncty_2;
                var ethn3 = item.feature.attributes.Ethncty_3;

                if (!ethn1 || ethn1 == ' ') {
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


                if (!population || population == '0') {
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

                    // "<tr class='even-row'><td class='popup-header'>Recognition status</td><td>" + item.feature.attributes.Form_Rec + ', ' + item.feature.attributes.Doc_Status + ', ' + item.feature.attributes.Stat_Date + '</td></tr>' +
                    "<tr class='even-row'><td class='popup-header'>Recognition status</td><td>" + item.feature.attributes.Form_Rec + '</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header'>Documentation status (Date)</td><td>" + item.feature.attributes.Doc_Status + statDate + '</td></tr>' +

                    "<tr class='even-row'><td class='popup-header'>Land category</td><td>" + item.feature.attributes.Category + '</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header'>Ethnic groups</td><td>" + ethnStr + '</td></tr>' +
                    "<tr class='even-row'><td class='popup-header'>Population</td><td>" + popStr + '</td></tr>' +
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

                var newLayerID;
                switch (item.layerName) {
                  case "Formal documentation":
                    newLayerID = 'indigenous_FormalDoc';
                      break;
                  case "In process of documentation":
                    newLayerID = 'indigenous_InProcess';
                    break;
                  case "No documentation":
                    newLayerID = 'indigenous_NoDoc';
                    break;
                  case "Formal land petition":
                    newLayerID = 'indigenous_FormalClaim';
                    break;
                  case "Occupied or used without formal land petition":
                    newLayerID = 'indigenous_Occupied';
                    break;
                  default:
                    newLayerID = 'none';
                    break;
                }

                // community_FormalClaim = brApp.map.getLayer('community_FormalClaim');
                // community_FormalDoc = brApp.map.getLayer('community_FormalDoc');
                // community_InProcess = brApp.map.getLayer('community_InProcess');
                // community_NoDoc = brApp.map.getLayer('community_NoDoc');
                // community_Occupied = brApp.map.getLayer('community_Occupied');

                for (var j = 0; j < brApp.layerInfos.length; j++) {
                  if (newLayerID === brApp.layerInfos[j].data.layer) {
                    template.title = '<img class="legend-item-img" src="data:image/png;base64,' + brApp.layerInfos[j].data.layers[1].legend[0].imageData + '">' + template.title;
                  }
                }

                // Content needs to be wrapped in a single parent div, otherwise on touch ArcGIS JavaScript API
                // will apply transform to first child and popup will not function and look like garbage, thanks esri/dojo
                template.content = '<div>' + template.content + '</div>';

                item.feature.setInfoTemplate(template);
                features.push(item.feature);
            });
            return features;
        },

        setPercentLandsTemplates: function(featureObjects) {
            brApp.debug('MapController >>> setPercentLandsTemplates');

            var template,
                features = [],
                self = this;

            arrayUtils.forEach(featureObjects, function(item) {

              template = new InfoTemplate(item.feature.attributes.Country, '');

              for (var attr in item.feature.attributes) {
                  if (!item.feature.attributes[attr] || item.feature.attributes[attr] === 'undefined' || item.feature.attributes[attr] == "Null" || item.feature.attributes[attr] == "null" || item.feature.attributes[attr] == "" || item.feature.attributes[attr] == " ") {
                      if (attr.indexOf('Notes') == -1) {
                          item.feature.attributes[attr] = "Unknown";
                      } else {
                          item.feature.attributes[attr] = "None";
                      }

                  }
              }

              var source1 = item.feature.attributes.IC_Notes ? "<tr class='odd-row'><td class='popup-header nationalField'>Notes</td><td>" + item.feature.attributes.IC_Notes + '</td></tr>' : '';
              var source2 = item.feature.attributes.IC_Notes ? "<tr class='odd-row'><td class='popup-header nationalField'>Notes</td><td>" + item.feature.attributes.I_Notes + '</td></tr>' : '';
              var source3 = item.feature.attributes.IC_Notes ? "<tr class='odd-row'><td class='popup-header nationalField'>Notes</td><td>" + item.feature.attributes.C_Notes + '</td></tr>' : '';

              template.content = "<div id='tableWrapper'><table id='nationalTable'>" +
              "<tr class='even-row'><td class='popup-header nationalField'>Percent of country area held or used by Indigenous peoples and communities</td><td><div>Total: " + item.feature.attributes.IC_T + '% ' + item.feature.attributes.IC_T_Src + '</div><div class="indentTD">Formally recognized: ' + item.feature.attributes.IC_F + '% ' + item.feature.attributes.IC_F_Src + '</div><div class="indentTD">Not formally recognized: ' + item.feature.attributes.IC_NF + '% ' + item.feature.attributes.IC_NF_Src + '</div></td></tr>' +
              // "<tr class='odd-row'><td class='popup-header nationalField'>Notes</td><td>" + item.feature.attributes.IC_Notes + '</td></tr>' +
              source1 +
              "<tr class='even-row'><td class='popup-header nationalField'>Percent of country area held or used by Indigenous peoples only</td><td><div>Total: " + item.feature.attributes.I_T + '% ' + item.feature.attributes.I_T_Src + '</div><div class="indentTD">Formally recognized: ' + item.feature.attributes.I_F + '% ' + item.feature.attributes.I_F_Src + '</div><div class="indentTD">Not formally recognized: ' + item.feature.attributes.I_NF + '% ' + item.feature.attributes.I_NF_Src + '</div></td></tr>' +
              // "<tr class='odd-row'><td class='popup-header nationalField'>Notes</td><td>" + item.feature.attributes.I_Notes + '</td></tr>' +
              source2 +
              "<tr class='even-row'><td class='popup-header nationalField'>Percent of country area held or used by communities only</td><td><div>Total: " + item.feature.attributes.C_T + '% ' + item.feature.attributes.C_T_Src + '</div><div class="indentTD">Formally recognized: ' + item.feature.attributes.C_F + '% ' + item.feature.attributes.C_F_Src + '</div><div class="indentTD">Not formally recognized: ' + item.feature.attributes.C_NF + '% ' + item.feature.attributes.C_NF_Src + '</div></td></tr>' +
              // "<tr class='odd-row'><td class='popup-header nationalField'>Notes</td><td>" + item.feature.attributes.C_Notes + '</td></tr></table></div>' +
              source3 +
              '</table></div>' +
              "<div class='popup-last'>Date uploaded: " + item.feature.attributes['Upl_Date'] + "<a href='./data/#data-4' target='_blank' class='popup-last-right'>More Info</a></div>";
              item.feature.setInfoTemplate(template);


              //item.layerName === brApp.layerInfos[i].data.group
                //item.layerId === brApp.layerInfos[i].data.layers[j].layerId
                  // is our src //todo: [0]??? or of what??<img class="legend-item-img" src="data:image/png;base64," + brApp.layerInfos[i].data.layers[j].legend[0].imageData>

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

        setLandTenureTemplates: function(featureObjects) {
            brApp.debug('MapController >>> setLandTenureTemplates');

            var template,
                features = [],
                indNumber = MapAssets.getNationalLevelIndicatorCode(),
                self = this;

            arrayUtils.forEach(featureObjects, function(item) {

                template = new InfoTemplate(item.value, '');

                for (var attr in item.feature.attributes) {
                    if (item.feature.attributes[attr] == "Null" || item.feature.attributes[attr] == "null" || item.feature.attributes[attr] == "" || item.feature.attributes[attr] == " ") {
                      console.log(item.feature.attributes[attr]);
                      item.feature.attributes[attr] = "Unknown";
                    }
                }
                console.log('item.layerId',item.layerId)

                if (item.layerId === 0 ||item.layerId === 2) { // Average Score
                  template.content = "<div id='tableWrapper'><table id='landTenureTable'>" +
                  "<tr class='even-row'><td class='popup-header nationalField'>Groups targeted by the legal framework</td><td>" + item.feature.attributes.Framework + '</td></tr>' +
                  "<tr class='odd-row'><td class='popup-header nationalField'>Language of the law review</td><td>" + item.feature.attributes.Language + '</td></tr>' +
                  "<tr class='even-row'><td class='popup-header nationalField'>Average Indicator Score</td><td>" + item.feature.attributes.Avg_Scr + '</td></tr>' +
                  "<tr class='full-row'><td colspan='2' class='popup-header'>Scores per Indicator</td></tr>" +

                  "<tr class='even-row'><td class='popup-header nationalField'>Q1: Legal Status</td><td>" + item.feature.attributes.I1_Scr + '</td></tr>' +
                  "<tr class='odd-row'><td class='popup-header nationalField'>Q2: Land Rights and Common Property</td><td>" + item.feature.attributes.I2_Scr + '</td></tr>' +
                  "<tr class='even-row'><td class='popup-header nationalField'>Q3: Formal Documentation</td><td>" + item.feature.attributes.I3_Scr + '</td></tr>' +
                  "<tr class='odd-row'><td class='popup-header nationalField'>Q4: Legal Person</td><td>" + item.feature.attributes.I4_Scr + '</td></tr>' +
                  "<tr class='even-row'><td class='popup-header nationalField'>Q5: Legal Authority</td><td>" + item.feature.attributes.I5_Scr + '</td></tr>' +
                  "<tr class='odd-row'><td class='popup-header nationalField'>Q6: Perpetuity</td><td>" + item.feature.attributes.I6_Scr + '</td></tr>' +
                  "<tr class='even-row'><td class='popup-header nationalField'>Q7: Right to Consent Before Land Acquisition</td><td>" + item.feature.attributes.I7_Scr + '</td></tr>' +
                  "<tr class='odd-row'><td class='popup-header nationalField'>Q8: Rights to Trees</td><td>" + item.feature.attributes.I8_Scr + '</td></tr>' +
                  "<tr class='even-row'><td class='popup-header nationalField'>Q9: Rights to Water</td><td>" + item.feature.attributes.I9_Scr + '</td></tr>' +
                  "<tr class='odd-row'><td class='popup-header nationalField'>Q10: Land Rights in Protected Areas</td><td>" + item.feature.attributes.I10_Scr + '</td></tr></table></div>' +
                  "<div class='popup-last'>Date uploaded: " + item.feature.attributes['Upl_Date'] + "<a href='./data/#data-4' target='_blank' class='popup-last-right'>More Info</a></div>";

                } else { //1 & 3
                  template.content = "<div id='tableWrapper'><table id='landTenureTable'>" +
                  "<tr class='even-row'><td class='popup-header nationalField'>Groups targeted by the legal framework</td><td>" + item.feature.attributes.Framework + '</td></tr>' +
                  "<tr class='odd-row'><td class='popup-header nationalField'>Language of the law review</td><td>" + item.feature.attributes.Language + '</td></tr>' +
                  "<tr class='even-row'><td class='popup-header nationalField'>Indicator score</td><td>" + item.feature.attributes['I' + indNumber + '_Scr'] + '</td></tr>' +
                  "<tr class='odd-row'><td class='popup-header nationalField'>Justification of score</td><td>" + item.feature.attributes['I' + indNumber + '_Com'] + '</td></tr>' +
                  "<tr class='even-row'><td class='popup-header nationalField'>Laws and provisions reviewed</td><td>" + item.feature.attributes['I' + indNumber + '_LaP'] + '</td></tr>' +
                  "<tr class='odd-row'><td class='popup-header nationalField'>Additional comments</td><td>" + item.feature.attributes['I' + indNumber + '_AddInfo'] + '</td></tr>' +
                  "<tr class='even-row'><td class='popup-header nationalField'>Review source (Year)</td><td>" + item.feature.attributes['I' + indNumber + '_Rev'] + '(' + item.feature.attributes['I' + indNumber + '_Year'] + ')</td></tr></table></div>' +

                  "<div class='popup-last'>Date uploaded: " + item.feature.attributes['Upl_Date'] + "<a href='./data/#data-4' target='_blank' class='popup-last-right'>More Info</a></div>";
                }

                //might have to be for 0 & 2 only


                for (var j = 0; j < brApp.layerInfos.length; j++) {
                  if (brApp.layerInfos[j].data.layer === 'landTenure') {
                    brApp.layerInfos[j].data.layers.forEach(function(layer) {
                      if (layer.layerId === item.layerId) {
                        for (var k = 0; k < layer.legend.length; k++) {
                          if (item.layerId === 0 ||item.layerId === 2) {
                            for (var m = 0; m < layer.legend[k].values.length; m++) {
                              if (item.feature.attributes.Avg_Scr === layer.legend[k].values[m]) {
                                template.title = '<img class="legend-item-img" src="data:image/png;base64,' + layer.legend[k].imageData + '">' + template.title;
                              }
                            }
                          } else {
                            if (item.feature.attributes['I' + indNumber + '_Scr'] === layer.legend[k].values[0]) {
                              template.title = '<img class="legend-item-img" src="data:image/png;base64,' + layer.legend[k].imageData + '">' + template.title;
                            }
                          }
                        }
                      }
                    })
                  }
                }

                item.feature.setInfoTemplate(template);

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
            if (nationalIndicatorCode === "Avg_Scr") {
              stringified = nationalIndicatorCode;
            }

            var indicator = feature.attributes[stringified];
            console.log(indicator)
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
                    // $(".esriPopup .titleButton.close").css('background-image', 'url("css/images/close_x_symbol.png")');
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


                template.setContent("<table id='analysisTable'><tr id='column-header'><td class='country'><b>Country</b></td><td class='name'><b>Name</b></td><td class='ident'><b>Identity</b></td><td class='offic_rec'><b>Formal Recognition</b></td><td class='rec_status'><b>Documentation Status</b></td></tr><tr id='fillerColumn' style='height: 36px;'><td><b></b></td><td><b></b></td><td><b></b></td><td><b></b></td><td><b></b></td></tr>");

                var fields = ["Country", "Name", "Identity", "Formal Recognition", "Documentation Status"];

                brApp.csv = fields.join(",") + '\n';


                function getTextContent(graphic, even) {
                    if (graphic.feature.attributes.Identity === "Indigenous (self-identified)") {
                        graphic.feature.attributes.Identity = "Indigenous";
                    }
                    if (graphic.feature.attributes.Identity === "Non-indigenous (self-identified)") {
                        graphic.feature.attributes.Identity = "Community";
                    }
                    if (graphic.feature.attributes.Form_Rec === "Officially recognized (by law or decree)") {
                        graphic.feature.attributes.Form_Rec = "Officially recognized";
                    }

                    var str;
                    if (even === "even") {

                        str = "<tr class='even-row'><td class='country'>" + graphic.feature.attributes.Country + "</td><td class='name'>" +
                            graphic.feature.attributes.Name + "</td><td class='ident'>" +
                            graphic.feature.attributes.Identity + "</td><td class='offic_rec'>" +
                            graphic.feature.attributes.Form_Rec + "</td><td class='rec_status'>" +
                            graphic.feature.attributes.Doc_Status + "</td></tr>";
                        var fieldValues = [graphic.feature.attributes.Country, graphic.feature.attributes.Name, graphic.feature.attributes.Identity, graphic.feature.attributes.Form_Rec, graphic.feature.attributes.Form_Rec];
                        brApp.csv += fieldValues.join(",") + '\n';

                    } else {
                        str = "<tr class='odd-row'><td>" + graphic.feature.attributes.Country + "</td><td class='name'>" +
                            graphic.feature.attributes.Name + "</td><td class='ident'>" +
                            graphic.feature.attributes.Identity + "</td><td class='offic_rec'>" +
                            graphic.feature.attributes.Form_Rec + "</td><td class='rec_status'>" +
                            graphic.feature.attributes.Doc_Status + "</td></tr>";
                        var fieldValues = [graphic.feature.attributes.Country, graphic.feature.attributes.Name, graphic.feature.attributes.Identity, graphic.feature.attributes.Form_Rec, graphic.feature.attributes.Form_Rec];
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

                var extraContent = "<div id='identifyNote'><div id='buttonBox'><button id='removeGraphic'>Remove</button><button id='exportAnalysis'>Export Analysis</button></div><div style='padding:10px;'>Note that the results of this analysis are only as complete as the data available on the platform. Additional indigenous and community lands may be present but are not contained in the available dataset; therefore, a local analysis is always recommended. The Data Completeness layer provides a broad assesment of the completeness of the indigenous and community lands data layer for a reference.</div></div>";


                $('.esriPopupWrapper').append(extraContent);
                $('.esriPopupWrapper').addClass("noPositioning");

                //$(".esriPopup").addClass("analysis-location");
                // $(".esriPopup .titleButton.close").css('background-image', 'url("css/images/close_x_symbol.png")');

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

                var newHeight = (value.features.length * 44) + 210;
                newHeight += "px";
                $("#infowindowContainer").css("height", newHeight);

                $("#infowindowContainer").show();

                if (value.features.length > 8) {
                  $('#column-header').addClass('lessColumnWidth');
                }

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


    };

    return MapController;

});
