define([
    'main/config',
    'map/Map',
    'map/Uploader',
    'map/DrawTool',
    'map/MapConfig',
    'map/MapAssets',
    'components/LayerTabContainer',
    'components/PrintModal',
    'components/MobileFooter',
    'map/WidgetsController',
    'dojo/on',
    'dojo/dom',
    'dojo/dom-geometry',
    'dojo/_base/window',
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
    'esri/dijit/Search',
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
    "esri/layers/LayerDrawingOptions",
    'esri/layers/FeatureLayer'

], function(AppConfig, Map, Uploader, DrawTool, MapConfig, MapAssets, LayerTabContainer, PrintModal, MobileFooter, WidgetsController, on, dom, domGeom, win, dojoQuery, domClass, domConstruct, arrayUtils, all, Deferred, dojoNumber, topic, Toggler, registry, ContentPane, Legend, HomeButton, BasemapGallery, Search, Scalebar, esriRequest, Point, Polygon, IdentifyTask, IdentifyParameters, InfoTemplate, Query, QueryTask, HorizontalSlider, HorizontalRuleLabels, LayerDrawingOptions, FeatureLayer) {



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
            mapObject.on('map-ready', function(country) {
                if (country) {
                  self.zoomToCountry(country);
                }
                self.renderComponents();
            });

            // on(document.getElementById('legend-toggle'), 'click', WidgetsController.toggleLegend);
            on(document.getElementById('basemap-button'), 'click', WidgetsController.toggleBasemapGallery.bind(WidgetsController));
            on(document.getElementById('share-button'), 'click', WidgetsController.toggleShareContainer.bind(WidgetsController));
            // on(document.getElementById('print-button'), 'click', WidgetsController.printMap);
            on(document.getElementById('print-button'), 'click', WidgetsController.togglePrintModal);
            // on(document.getElementById('close-print-modal'), 'click', WidgetsController.togglePrintModal);

            on(document.getElementById('tree-title-pane'), 'click', function(){
              var body = win.body()
              var width = domGeom.position(body).w;
              if (width > 768) {
                WidgetsController.toggleTreeContainer();
              } else {
                WidgetsController.toggleMobileTree();
              }
            });

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

                });

            });

            // Mobile Specific Events
            on(document.getElementById('mobile-menu-toggle'), 'click', WidgetsController.toggleMobileMenu);

            on(document.getElementById('embedShare'), 'click', WidgetsController.showEmbedCode);

            // Hack for the print service, tiled layers need to be added to operational layers
            // when the zoom level is less then 9 to force legends to show in the printout, due to the way we are
            // showing tiled layers up to 9 and then dynamic from there on out
            esriRequest.setRequestPreCallback(function (ioArgs) {

              if (ioArgs.url !== AppConfig.printUrl) {
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
                printModal,
                mobileFooter,
                legendComponent,
                homeWidget,
                searchWidget,
                reportWidget,
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
            printModal = new PrintModal('print-modal');
            mobileFooter = new MobileFooter('mobile-footer')

            var body = win.body(),
                mobileThreshold = 800,
                width = domGeom.position(body).w;

            if (width <= mobileThreshold) {
              var layerTree = document.querySelector('.tree-widget-container')
              var searchButton = document.querySelector('.search-button')
              var analysisButton = document.querySelector('.analysis-button')
              var reportButton = document.querySelector('.report-button')
              domClass.add(layerTree, 'hidden');
              domClass.add(searchButton, 'hidden');
              domClass.add(analysisButton, 'hidden');
              domClass.add(reportButton, 'hidden');
            }

            // Start all widgets that still need to be started
            basemapGallery.startup();
            homeWidget.startup();

            searchWidget = new Search({
              map: brApp.map,
              showArcGISBasemaps: true,
              showInfoWindowOnSelect: false,
              enableSearchingAll: false
            }, 'esri-search-holder');

            // var sources = searchWidget.get("sources");
            //
            // sources.push({
            //   featureLayer: new FeatureLayer(
            //     // url: layerConfig[0].url + '/' + layerConfig[0].sublayers[0].id
            //     'https://gis.wri.org/server/rest/services/LandMark/comm_ind_FormalClaim/MapServer/1'
            //   ),
            //   searchFields: ['Name'],
            //   displayField: 'Name',
            //   exactMatch: false,
            //   outFields: ['*'],
            //   name: 'Community Formal Claim',
            //   placeholder: 'Search',
            //   enableSuggestions: true,
            //   searchQueryParams: {
            //     returnGeom: false
            //   }
            // });
            //
            // sources.push({
            //   featureLayer: new FeatureLayer(
            //     // url: layerConfig[0].url + '/' + layerConfig[0].sublayers[0].id
            //     'https://gis.wri.org/server/rest/services/LandMark/comm_comm_FormalDoc/MapServer/1'
            //   ),
            //   searchFields: ['Name'],
            //   displayField: 'Name',
            //   exactMatch: false,
            //   outFields: ['*'],
            //   name: 'Community Formal Doc',
            //   placeholder: 'Search',
            //   enableSuggestions: true,
            //   searchQueryParams: {
            //     returnGeom: false
            //   }
            // });
            //
            // sources.push({
            //   featureLayer: new FeatureLayer(
            //     // url: layerConfig[0].url + '/' + layerConfig[0].sublayers[0].id
            //     'https://gis.wri.org/server/rest/services/LandMark/comm_comm_Occupied/MapServer/1'
            //   ),
            //   searchFields: ['Name'],
            //   displayField: 'Name',
            //   exactMatch: false,
            //   outFields: ['*'],
            //   name: 'Community No Formal',
            //   placeholder: 'Search',
            //   enableSuggestions: true,
            //   searchQueryParams: {
            //     returnGeom: false
            //   }
            // });
            //
            // sources.push({
            //   featureLayer: new FeatureLayer(
            //     // url: layerConfig[0].url + '/' + layerConfig[0].sublayers[0].id
            //     'https://gis.wri.org/server/rest/services/LandMark/comm_ind_FormalClaim/MapServer/1'
            //   ),
            //   searchFields: ['Name'],
            //   displayField: 'Name',
            //   exactMatch: false,
            //   outFields: ['*'],
            //   name: 'Indigenous Formal Claim',
            //   placeholder: 'Search',
            //   enableSuggestions: true,
            //   searchQueryParams: {
            //     returnGeom: false
            //   }
            // });
            //
            // sources.push({
            //   featureLayer: new FeatureLayer(
            //     // url: layerConfig[0].url + '/' + layerConfig[0].sublayers[0].id
            //     'https://gis.wri.org/server/rest/services/LandMark/comm_ind_FormalDoc/MapServer/1'
            //   ),
            //   searchFields: ['Name'],
            //   displayField: 'Name',
            //   exactMatch: false,
            //   outFields: ['*'],
            //   name: 'Indigenous Formal Doc',
            //   placeholder: 'Search',
            //   enableSuggestions: true,
            //   searchQueryParams: {
            //     returnGeom: false
            //   }
            // });
            //
            // sources.push({
            //   featureLayer: new FeatureLayer(
            //     // url: layerConfig[0].url + '/' + layerConfig[0].sublayers[0].id
            //     'https://gis.wri.org/server/rest/services/LandMark/comm_ind_Occupied/MapServer/1'
            //   ),
            //   searchFields: ['Name'],
            //   displayField: 'Name',
            //   exactMatch: false,
            //   outFields: ['*'],
            //   name: 'Indigenous Occupied',
            //   placeholder: 'Search',
            //   enableSuggestions: true,
            //   searchQueryParams: {
            //     returnGeom: false
            //   }
            // });
            //
            // searchWidget.set("sources", sources);
            // // searchWidget.set('activeSourceIndex', 1);

            searchWidget.startup();

            searchWidget.on('select-result', function(results) {
              var features = self.setCommunityTemplates([results.result]);

              switch (results.source.name) {
                  case 'Indigenous Formal Claim':
                      features = features.concat(self.setIndigenousTemplates([results.result]));
                      break;
                  case 'Indigenous Formal Doc':
                      features = features.concat(self.setIndigenousTemplates([results.result]));
                      break;
                  case 'Indigenous Occupied':
                      features = features.concat(self.setIndigenousTemplates([results.result]));
                      break;

                  case 'Community Formal Claim':
                      features = features.concat(self.setCommunityTemplates([results.result]));
                      break;
                  case 'Community No Formal':
                      features = features.concat(self.setCommunityTemplates([results.result]));
                      break;
                  case 'Community Formal Doc':
                      features = features.concat(self.setCommunityTemplates([results.result]));
                      break;

                  case "landTenure":
                      features = features.concat(self.setLandTenureTemplates([results.result]));
                      break;
                  case "percentLands":
                      features = features.concat(self.setPercentLandsTemplates([results.result]));
                      break;

                  case "Esri World Geocoder":
                      features = [];
                      break;
                  default: // Do Nothing
                      break;
              }

              if (features.length > 0) {
                brApp.map.infoWindow.setFeatures(features);
                brApp.map.infoWindow.resize(375, 600);

                var domNote = document.getElementById('identifyNote');
                if (domNote) {
                  domNote.parentNode.removeChild(domNote);
                }

                on.once(brApp.map, "extent-change", function() {
                  brApp.map.infoWindow.show(brApp.map.extent.getCenter());
                  if (window.innerWidth < 1000) {
                    brApp.map.infoWindow.maximize();
                    document.querySelector('.esriPopup .contentPane').style.height = 'inherit';
                  }
                  on.once(brApp.map.infoWindow, "hide", function() {
                    brApp.map.infoWindow.resize(375, 600);
                  });
                });

              }
            });

            reportWidget = new Search({
              map: brApp.map,
              autoNavigate: false,
              enableHighlight: false,
              showInfoWindowOnSelect: false
            }, 'esri-report-holder');

            var reportSources = [];

            reportSources.push({
              featureLayer: new FeatureLayer(
                 // url: layerConfig[0].url + '/' + layerConfig[0].sublayers[0].id
                 'https://gis.wri.org/server/rest/services/LandMark/Country_Snapshots/MapServer/0',
                  {outFields: ['Country', 'ISO_Code']}
               ),
               searchFields: ['Country'],
               displayField: 'Country',
               exactMatch: false,
               outFields: ['*'],
               name: 'Country Profiles',
               placeholder: 'Country Profiles',
               enableSuggestions: true
             });

             reportWidget.set("sources", reportSources);

             reportWidget.startup();

             reportWidget.on('select-result', function(results) {
               if (results.result.feature && results.result.feature.attributes.Country) {
                 //If popup blocker is on, alert!
                 var openWindow = window.open('/map/report/?country=' + results.result.feature.attributes.Country);
                 if (openWindow == null || typeof(openWindow)=='undefined') {
                   alert("Turn off your pop-up blocker!");
                 }
               }
             });

            self.getLandTenureRenderer();

            // Initialize the draw tools
            DrawTool.init();

            on(document.getElementById('analysis-help'), 'click', WidgetsController.showHelp);

            // remove hideOnLoad classes
            dojoQuery('body .hideOnLoad').forEach(function(node) {
                domClass.remove(node, 'hideOnLoad');
            });

        },

        zoomToCountry: function (country) {
          var countryQT = new QueryTask('https://gis.wri.org/server/rest/services/LandMark/Country_Snapshots/MapServer/0')
          var countryQuery = new Query();
          countryQuery.where = "Country = '" + country + "'";
          countryQuery.returnGeometry = true;
          countryQuery.outFields = [];

          countryQT.execute(countryQuery, function (result) {
            if (result.features && result.features[0]) {
              var countryExtent = result.features[0];
              on.once(brApp.map, 'extent-change', function(evt) {
                brApp.map.setZoom(evt.lod.level - 1)
              });
              brApp.map.setExtent(result.features[0].geometry.getExtent());
            }
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
                    brApp.map.infoWindow.resize(375, 600);

                    var domNote = document.getElementById('identifyNote');
                    if (domNote) {
                      domNote.parentNode.removeChild(domNote);
                    }

                    brApp.map.infoWindow.show(mapPoint);

                    var centerPointScreen = brApp.map.toScreen(mapPoint);
                    if (centerPointScreen.y > 300) {
                        centerPointScreen.y -= 100;
                    }

                    var centerPoint = brApp.map.toMap(centerPointScreen);

                    brApp.map.centerAt(centerPoint);

                    if (window.innerWidth < 1000) {
                        brApp.map.infoWindow.maximize();
                        document.querySelector('.esriPopup .contentPane').style.height = 'inherit';
                    }


                    on.once(brApp.map.infoWindow, "hide", function() {

                        brApp.map.infoWindow.resize(375, 600);

                    });

                }
            });

        },

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
                statDate,
                self = this;

            arrayUtils.forEach(featureObjects, function(item) {
                var ethnStr;
                var ethn1 = item.feature.attributes.Ethncty_1;
                var ethn2 = item.feature.attributes.Ethncty_2;
                var ethn3 = item.feature.attributes.Ethncty_3;

                if (!ethn1 || ethn1 == ' ' || ethn1 == 'Null') {
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

                if (!population || population == '0' || population == 'Null') {
                    popStr = 'Unknown';
                } else if (population && !popSource) {
                    popStr = population;
                } else if (population && popSource && (!popYear || popYear == 0)) {
                    popStr = population + " (" + popSource + ")";
                } else {
                    popStr = population + " (" + popSource + ", " + popYear + ")";
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

                var area_Ofcl = item.feature.attributes.Area_Ofcl ? item.feature.attributes.Area_Ofcl : 0;
                var area_GIS = item.feature.attributes.Area_GIS && item.feature.attributes.Area_GIS !== 'Null' ? parseFloat(item.feature.attributes.Area_GIS).toFixed(2) : '0.00';

                template = new InfoTemplate(item.value,
                    "<div id='tableWrapper'><table id='indigenousTable'>" +
                    "<tr class='even-row'><td class='popup-header'>Country</td><td>" + item.feature.attributes.Country + '</td></tr>' +

                    "<tr class='odd-row'><td class='popup-header'>Identity</td><td>" + item.feature.attributes.Identity + '</td></tr>' +

                    // "<tr class='even-row'><td class='popup-header'>Recognition status</td><td>" + item.feature.attributes.Form_Rec + ', ' + item.feature.attributes.Doc_Status + ', ' + item.feature.attributes.Stat_Date + '</td></tr>' +
                    "<tr class='even-row'><td class='popup-header'>Recognition status</td><td>" + item.feature.attributes.Form_Rec + '</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header'>Documentation status (Date)</td><td>" + item.feature.attributes.Doc_Status + statDate + '</td></tr>' +

                    "<tr class='even-row'><td class='popup-header'>Land category</td><td>" + item.feature.attributes.Category + '</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header'>Ethnic groups</td><td>" + ethnStr + '</td></tr>' +
                    "<tr class='even-row'><td class='popup-header'>Population (Source, Date)</td><td>" + popStr + '</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header'>Land Area, offical and GIS</td><td>Official area (ha): " + self.numberWithCommas(area_Ofcl) + "<br>GIS area (ha): " + self.numberWithCommas(area_GIS) + '</td></tr>' +
                    "<tr class='even-row'><td class='popup-header'>Acquisition scale</td><td>" + item.feature.attributes.Scale + '</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header'>Acquisition method</td><td>" + item.feature.attributes.Method + '</td></tr>' +
                    "<tr class='even-row'><td class='popup-header'>Data source</td><td>" + item.feature.attributes.Data_Src + " (" + item.feature.attributes.Data_Date + ')</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header'>Data Contributor</td><td>" + item.feature.attributes.Data_Ctrb + '</td></tr></table></div>' +

                    "<div class='popup-last'>Date uploaded: " + item.feature.attributes.Upl_Date);

                if (item.feature.attributes.More_info == ' ' || item.feature.attributes.More_info == '' || item.feature.attributes.More_info == 'Unknown') {
                    template.content += '</div>';
                } else {
                    template.content += '<span><a href=' + item.feature.attributes.More_info + ' target="_blank" id="additionalInfo">More Info</a></span></div>';
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
                statDate,
                self = this;

            arrayUtils.forEach(featureObjects, function(item) {
                var ethnStr;
                var ethn1 = item.feature.attributes.Ethncty_1;
                var ethn2 = item.feature.attributes.Ethncty_2;
                var ethn3 = item.feature.attributes.Ethncty_3;

                if (!ethn1 || ethn1 == ' ' || ethn1 == 'Null') {
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

                if (!population || population == '0' || population == 'Null') {
                    popStr = 'Unknown';
                } else if (population && !popSource) {
                    popStr = population;
                } else if (population && popSource && (!popYear || popYear == 0)) {
                    popStr = population + " (" + popSource + ")";
                } else {
                    popStr = population + " (" + popSource + ", " + popYear + ")";
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

                var area_Ofcl = item.feature.attributes.Area_Ofcl ? item.feature.attributes.Area_Ofcl : 0;
                var area_GIS = item.feature.attributes.Area_GIS ? item.feature.attributes.Area_GIS : 0;
                template = new InfoTemplate(item.value,
                    "<div id='tableWrapper'><table id='indigenousTable'>" +
                    "<tr class='even-row'><td class='popup-header'>Country</td><td>" + item.feature.attributes.Country + '</td></tr>' +

                    "<tr class='odd-row'><td class='popup-header'>Identity</td><td>" + item.feature.attributes.Identity + '</td></tr>' +

                    // "<tr class='even-row'><td class='popup-header'>Recognition status</td><td>" + item.feature.attributes.Form_Rec + ', ' + item.feature.attributes.Doc_Status + ', ' + item.feature.attributes.Stat_Date + '</td></tr>' +
                    "<tr class='even-row'><td class='popup-header'>Recognition status</td><td>" + item.feature.attributes.Form_Rec + '</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header'>Documentation status (Date)</td><td>" + item.feature.attributes.Doc_Status + statDate + '</td></tr>' +

                    "<tr class='even-row'><td class='popup-header'>Land category</td><td>" + item.feature.attributes.Category + '</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header'>Ethnic groups</td><td>" + ethnStr + '</td></tr>' +
                    "<tr class='even-row'><td class='popup-header'>Population (Source, Date)</td><td>" + popStr + '</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header'>Land Area, offical and GIS</td><td>Official area (ha): " + self.numberWithCommas(area_Ofcl) + "<br>GIS area (ha): " + self.numberWithCommas(area_GIS) + '</td></tr>' +
                    "<tr class='even-row'><td class='popup-header'>Acquisition scale</td><td>" + item.feature.attributes.Scale + '</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header'>Acquisition method</td><td>" + item.feature.attributes.Method + '</td></tr>' +
                    "<tr class='even-row'><td class='popup-header'>Data source</td><td>" + item.feature.attributes.Data_Src + " (" + item.feature.attributes.Data_Date + ')</td></tr>' +
                    "<tr class='odd-row'><td class='popup-header'>Data Contributor</td><td>" + item.feature.attributes.Data_Ctrb + '</td></tr></table></div>' +

                    "<div class='popup-last'>Date uploaded: " + item.feature.attributes.Upl_Date);

                if (item.feature.attributes.More_info == ' ' || item.feature.attributes.More_info == '' || item.feature.attributes.More_info == 'Unknown') {
                    template.content += '</div>';
                } else {
                    template.content += '<span><a href=' + item.feature.attributes.More_info + ' target="_blank" id="additionalInfo">More Info</a></span></div>';
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
                  if (!item.feature.attributes[attr] || item.feature.attributes[attr] === 'undefined' || item.feature.attributes[attr] === "Null" || item.feature.attributes[attr] == "null" || item.feature.attributes[attr] == "" || item.feature.attributes[attr] == " ") {
                      if (attr.indexOf('Notes') !== -1) {
                          item.feature.attributes[attr] = "None";
                      } else {
                          item.feature.attributes[attr] = '';
                      }
                  }
              }

              var ict = item.feature.attributes.IC_T;
              if (ict === 'No data') {
                ict = 'Unknown';
              }

              var icf = item.feature.attributes.IC_F;
              if (icf === 'No data') {
                icf = 'Unknown';
              }

              var icnf = item.feature.attributes.IC_NF;
              if (icnf === 'No data') {
                icnf = 'Unknown';
              }

              var data = item.feature.attributes.IC_T ? "<tr class='even-row'><td class='popup-header nationalField'>Percent of country area held or used by Indigenous peoples and communities</td><td><div><span class='inlineBold'>Total</span>: " + ict + " " + item.feature.attributes.IC_T_Src + "</div><div class='indentTD'><span class='inlineBold'>Acknowledged by government</span>: " + icf + " " + item.feature.attributes.IC_F_Src + "</div><div class='indentTD'><span class='inlineBold'>Not acknowledged by government</span>: " + icnf + " " + item.feature.attributes.IC_NF_Src + "</div></td></tr>" : "";
              var source = item.feature.attributes.IC_Notes ? "<tr class='odd-row'><td class='popup-header nationalField'>Notes</td><td>" + item.feature.attributes.IC_Notes + '</td></tr>' : '';

              template.content = "<div id='tableWrapper'><table id='nationalTable'>" +
              data +
              source +
              '</table></div>' +
              "<div class='popup-last'>Date uploaded: " + item.feature.attributes['Upl_Date'] + "<a href='http://www.landmarkmap.org/data/#data-5' target='_blank' class='popup-last-right'>More Info</a></div>";

                for (var j = 0; j < brApp.layerInfos.length; j++) {
                  if (brApp.layerInfos[j].data.layer === 'percentLands') {
                    brApp.layerInfos[j].data.layers.forEach(function(layer) {
                      if (layer.layerId === item.layerId) {
                        for (var k = 0; k < layer.legend.length; k++) {


                          if (item.layerId === 1) {
                            if (layer.legend[k].label === item.feature.attributes['IC_T_Cat']) {
                              template.title = '<img class="legend-item-img" src="data:image/png;base64,' + layer.legend[k].imageData + '">' + template.title;
                            }
                          } else if (item.layerId === 2) {
                            if (layer.legend[k].label === item.feature.attributes['IC_F_Cat']) {
                              template.title = '<img class="legend-item-img" src="data:image/png;base64,' + layer.legend[k].imageData + '">' + template.title;
                            }
                          } else if (item.layerId === 3) {
                            if (layer.legend[k].label === item.feature.attributes['IC_NF_Cat']) {
                              template.title = '<img class="legend-item-img" src="data:image/png;base64,' + layer.legend[k].imageData + '">' + template.title;
                            }
                          } else if (item.layerId === 5) {
                            if (layer.legend[k].label === item.feature.attributes['I_T_Cat']) {
                              template.title = '<img class="legend-item-img" src="data:image/png;base64,' + layer.legend[k].imageData + '">' + template.title;
                            }
                          } else if (item.layerId === 6) {
                            if (layer.legend[k].label === item.feature.attributes['I_F_Cat']) {
                              template.title = '<img class="legend-item-img" src="data:image/png;base64,' + layer.legend[k].imageData + '">' + template.title;
                            }
                          } else if (item.layerId === 7) {
                            if (layer.legend[k].label === item.feature.attributes['I_NF_Cat']) {
                              template.title = '<img class="legend-item-img" src="data:image/png;base64,' + layer.legend[k].imageData + '">' + template.title;
                            }
                          } else if (item.layerId === 9) {
                            if (layer.legend[k].label === item.feature.attributes['C_T_Cat']) {
                              template.title = '<img class="legend-item-img" src="data:image/png;base64,' + layer.legend[k].imageData + '">' + template.title;
                            }
                          } else if (item.layerId === 10) {
                            if (layer.legend[k].label === item.feature.attributes['C_F_Cat']) {
                              template.title = '<img class="legend-item-img" src="data:image/png;base64,' + layer.legend[k].imageData + '">' + template.title;
                            }
                          } else if (item.layerId === 11) {
                            if (layer.legend[k].label === item.feature.attributes['C_NF_Cat']) {
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
                      item.feature.attributes[attr] = "Unknown";
                    }
                }

                if (item.layerId === 0 ||item.layerId === 2) { // Average Score
                  template.content = "<div id='tableWrapper'><table id='landTenureTable'>" +
                  "<tr class='even-row'><td class='popup-header'>Groups targeted by the legal framework</td><td>" + item.feature.attributes.Framework + '</td></tr>' +
                  "<tr class='odd-row'><td class='popup-header'>Language of the law review</td><td>" + item.feature.attributes.Language + '</td></tr>' +
                  "<tr class='even-row'><td class='popup-header'>Average Indicator Score</td><td>" + item.feature.attributes.Avg_Scr + '</td></tr>' +
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
                  "<div class='popup-last'>Date uploaded: " + item.feature.attributes['Upl_Date'] + "<a href='http://www.landmarkmap.org/data/#data-5' target='_blank' class='popup-last-right'>More Info</a></div>";

                } else { //1 & 3
                  template.content = "<div id='tableWrapper'><table id='landTenureTable'>" +
                  "<tr class='even-row'><td class='popup-header nationalField'>Groups targeted by the legal framework</td><td>" + item.feature.attributes.Framework + '</td></tr>' +
                  "<tr class='odd-row'><td class='popup-header nationalField'>Language of the law review</td><td>" + item.feature.attributes.Language + '</td></tr>' +
                  "<tr class='even-row'><td class='popup-header nationalField'>Indicator score</td><td>" + item.feature.attributes['I' + indNumber + '_Scr'] + '</td></tr>' +
                  "<tr class='odd-row'><td class='popup-header nationalField'>Justification of score</td><td>" + item.feature.attributes['I' + indNumber + '_Com'] + '</td></tr>' +
                  "<tr class='even-row'><td class='popup-header nationalField'>Laws and provisions reviewed</td><td>" + item.feature.attributes['I' + indNumber + '_LaP'] + '</td></tr>' +
                  "<tr class='odd-row'><td class='popup-header nationalField'>Additional comments</td><td>" + item.feature.attributes['I' + indNumber + '_AddInfo'] + '</td></tr>' +
                  "<tr class='even-row'><td class='popup-header nationalField'>Review source (Year)</td><td>" + item.feature.attributes['I' + indNumber + '_Rev'] + '(' + item.feature.attributes['I' + indNumber + '_Year'] + ')</td></tr></table></div>' +

                  "<div class='popup-last'>Date uploaded: " + item.feature.attributes['Upl_Date'] + "<a href='http://www.landmarkmap.org/data/#data-5' target='_blank' class='popup-last-right'>More Info</a></div>";
                }

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

            brApp.map.infoWindow.hide();
            var infowindowContainer = dom.byId('infowindowContainer');
            infowindowContainer.innerHTML = '';
            infowindowContainer.style.display = 'none';

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
                    var template = new InfoTemplate();
                    template.setContent("<p class='remove-only-text'>The area of interest intersects with <i>Zero</i> indigenous and/or community lands</p><button class='remove-only' id='removeGraphic'>Remove</button>");
                    brApp.map.infoWindow.setContent(template.content);
                    var theTitle = "<div id='title_title'>Analysis Results</div>";

                    brApp.map.infoWindow.setTitle(theTitle);
                    brApp.map.infoWindow.resize(375, 600);
                    var domNote = document.getElementById('identifyNote');
                    if (domNote) {
                      domNote.parentNode.removeChild(domNote);
                    }
                    brApp.map.infoWindow.show(mapPoint.mapPoint);

                    var handle = on.once(document.getElementById('removeGraphic'), 'click', function() {
                        self.removeCustomGraphic(graphic.attributes.attributeID);
                        brApp.map.infoWindow.hide();
                    });

                    on.once(brApp.map.infoWindow, "hide", function() {
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

                function getTextContent(graphic) {
                    var gisArea = graphic.feature.attributes.Area_GIS && graphic.feature.attributes.Area_GIS !== 'Null' ? parseFloat(graphic.feature.attributes.Area_GIS).toFixed(2) : '0.00';
                    if (graphic.feature.attributes.Identity === "Indigenous (self-identified)") {
                        graphic.feature.attributes.Identity = "Indigenous";
                    }
                    if (graphic.feature.attributes.Identity === "Non-indigenous (self-identified)") {
                        graphic.feature.attributes.Identity = "Community";
                    }
                    if (graphic.feature.attributes.Form_Rec === "Officially recognized (by law or decree)") {
                        graphic.feature.attributes.Form_Rec = "Officially recognized";
                    }

                    var fieldValues = [graphic.feature.attributes.Country, graphic.feature.attributes.Name, graphic.feature.attributes.Identity, graphic.feature.attributes.Form_Rec, graphic.feature.attributes.Doc_Status, gisArea];
                    brApp.csv += fieldValues.join(",") + '\n';

                }


                var fields = ["Country", "Name", "Identity", "Recognition Status", "Documentation Status", "GIS Area"];

                brApp.csv = fields.join(",") + '\n';

                for (var i = 0; i < value.features.length; i++) {
                    getTextContent(value.features[i]);
                }

                var payload = {
                    features: value.features,
                    csv: brApp.csv
                };

                var openWindow = window.open('/map/analysis/');
                if (openWindow == null || typeof(openWindow)=='undefined') {
                  alert("Turn off your pop-up blocker!");
                  openWindow.payload = payload;
                } else {
                  openWindow.payload = payload;
                }

                var template = new InfoTemplate();

                template.content = "<p class='middle-column'>The area of interest intersects with " + value.features.length + " indigenous and/or community lands</p>";

                var theTitle = "<div id='title_title'>Analysis Results</div>";
                var body = win.body(),
                width = domGeom.position(body).w,
                mobileThreshold = 800;

                brApp.map.infoWindow.setTitle(theTitle);
                brApp.map.infoWindow.setContent(template.content);
                if (width > mobileThreshold) {
                  brApp.map.infoWindow.resize(650, 350);
                }

                var domNote = document.getElementById('identifyNote');
                if (domNote) {
                  domNote.parentNode.removeChild(domNote);
                }

                var extraContent = "<div id='identifyNote'><div id='buttonBox'><button id='removeGraphic'>Remove</button><button id='exportAnalysis'>Export Analysis</button></div><div style='padding:10px;'>Note that the results of this analysis are only as complete as the data available on the platform. Additional indigenous and community lands may be present but are not contained in the available dataset; therefore, a local analysis is always recommended.</div></div>";
                domConstruct.place(extraContent, document.querySelector('.esriPopupWrapper'));

                var esriPopupWrapper = document.querySelector('.esriPopupWrapper');
                domClass.add(esriPopupWrapper, 'noPositioning');

                arrayUtils.forEach(brApp.map.infoWindow.domNode.children, function(node) {
                    if (node) {
                        var newNode = node.cloneNode(true);
                        domConstruct.place(newNode, document.getElementById('infowindowContainer'));
                    }
                });

                var newHeight = (value.features.length * 44) + 210;
                var infowindowContainer = document.getElementById('infowindowContainer');
                newHeight += "px";
                infowindowContainer.style.height = newHeight;
                infowindowContainer.style.display = 'block';

                if (value.features.length > 8) {
                  if (dom.byId('column-header')){
                    domClass.add('column-header', 'lessColumnWidth');
                  }
                }

                var handle = on.once(document.getElementById('removeGraphic'), 'click', function() {
                    self.removeCustomGraphic(graphic.attributes.attributeID);
                    infowindowContainer.innerHTML = '';
                    infowindowContainer.style.display = 'none';
                    var esriPopupWrapper = document.querySelector('.esriPopupWrapper');
                    domClass.remove(esriPopupWrapper, 'noPositioning');
                });

                document.querySelector('div.titleButton.close').addEventListener('click', function(){
                  infowindowContainer.innerHTML = '';
                  infowindowContainer.style.display = 'none';
                  handle.remove();
                  var esriPopupWrapper = document.querySelector('.esriPopupWrapper');
                  domClass.remove(esriPopupWrapper, 'noPositioning');
                })

                on.once(document.getElementById('exportAnalysis'), 'click', function() {
                    self.exportAnalysisResult(brApp.csv);
                });

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
            domClass.add('remove-graphics', 'hidden');
            domClass.remove('draw-shape', 'display-three');
            domClass.remove('upload-shapefile', 'display-three');;
        },

        getLandTenureRenderer: function() {
            brApp.debug('MapController >>> getLandTenureRenderer');

            var requestHandle = esriRequest({

                "url": "https://gis.wri.org/server/rest/services/LandMark/land_tenure/MapServer/1",
                "content": {
                    "f": "json"
                },
                "callbackParamName": "callback"
            });
            requestHandle.then(function(response) {
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
            }

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
            return parts[0];
        },

        printAnalysis: function(config) {
            brApp.debug('MapController >>> printAnalysis');
            window.print();
        },

    };

    return MapController;

});
