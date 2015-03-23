define([
    'map/Map',
    'map/Uploader',
    'map/DrawTool',
    'map/MapConfig',
    'map/MapAssets',
    'components/Tree',
    'components/CommunityTree',
    'components/NationalLayerList',
    'map/WidgetsController',
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
    'dijit/layout/AccordionContainer',
    'esri/dijit/Legend',
    'esri/dijit/Geocoder',
    'esri/dijit/HomeButton',
    'esri/dijit/LocateButton',
    'esri/dijit/BasemapGallery',
    "esri/geometry/Polygon",
    "esri/tasks/IdentifyTask",
    "esri/tasks/IdentifyParameters",
    "esri/InfoTemplate",
    "esri/tasks/query"

], function(Map, Uploader, DrawTool, MapConfig, MapAssets, ReactTree, CommunityTree, NationalLayerList, WidgetsController, on, dojoQuery, domClass, domConstruct, arrayUtils, all, Deferred, dojoNumber, topic, Toggler, registry, ContentPane, Accordion, Legend, Geocoder, HomeButton, LocateButton, BasemapGallery, Polygon, IdentifyTask, IdentifyParameters, InfoTemplate, Query) {

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
            // Bind Events now, Map Events then UI Events
            mapObject.on('map-ready', function() {
                self.renderComponents();

                registry.byId('layer-accordion').resize();
                //$("#national-level-toggle_button").click();
            });

            on(document.getElementById('legend-toggle'), 'click', WidgetsController.toggleLegend);
            on(document.getElementById('basemap-button'), 'click', WidgetsController.toggleBasemapGallery.bind(WidgetsController));
            on(document.getElementById('share-button'), 'click', WidgetsController.toggleShareContainer.bind(WidgetsController));
            // on(document.getElementById('nationalCommunityMenuButton'), 'click', self.handleNationalToggle.bind(self));
            //on(document.getElementById('nationalPercentageMenuButton'), 'click', self.handleNationalToggle.bind(self));//todo: on 'change' ?

            // on(document.getElementById('land-tenure-toggle'), 'click', self.handleNationalToggle.bind(self));
            // on(document.getElementById('percent-national-toggle'), 'click', self.handleNationalToggle.bind(self));
            // on(document.getElementById('nationalIndigenousMenuButton'), 'click', self.handleNationalToggle.bind(self));

            on(document.getElementById('tree-container-toggle'), 'click', WidgetsController.toggleTreeContainer);
            on(document.getElementById('analysis-button'), 'click', WidgetsController.showAnalysisDialog);
            on(document.getElementById('upload-shapefile'), 'click', WidgetsController.toggleUploadForm);
            on(document.getElementById('data-complete-checkbox'), 'click', self.showDataComplete);
            on(document.getElementById('draw-shape'), 'click', DrawTool.activate);
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
                locateButton,
                treeWidget,
                nationalLayerList,
                layerAccordion,
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

            layerAccordion = new Accordion({
                id: 'layer-accordion'
            }, 'layer-accordion');

            layerAccordion.startup();

            layerAccordion.addChild(new ContentPane({
                title: 'Community Level Data'
            }, 'community-level-toggle'));

            layerAccordion.addChild(new ContentPane({
                title: 'National Level Data'
            }, 'national-level-toggle'));



            treeWidget = new ReactTree(MapConfig.communityLevelTreeData, 'community-level-tree');
            nationalLayerList = new NationalLayerList('national-layer-lists');
            // treeWidgetNational = new CommunityTree(MapConfig.nationalLevelTreeData, 'national-level-tree-community');
            // treeWidgetNational = new CommunityTree(MapConfig.nationalLevelTreeDataIndigenous, 'national-level-tree-indigenous');
            // treeWidgetNational = new CommunityTree(MapConfig.nationalLevelPercentData, 'national-level-tree-percentage');

            // Start all widgets that still need to be started
            basemapGallery.startup();
            locateButton.startup();
            homeWidget.startup();
            geocoder.startup();
            legend.startup();
            // Initialize the draw tools
            DrawTool.init();


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

            //$("#national-level-toggle_button").click(); //TODO: turn the national toggle on by default -->Remove the jquery click after renderComponents is called



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
                nationalLayer,
                userGraphics,
                layer;

            brApp.mapPoint = mapPoint;
            brApp.mapPoint.clientY = evt.clientY;
            brApp.map.infoWindow.clearFeatures();

            if (brApp.map.infoWindow.isShowing) {
                brApp.map.infoWindow.hide();
            }

            // If drawing tools enabled, dont continue 
            if (DrawTool.isActive()) {
                return;
            }

            // for (layer in MapConfig.layers) {
            //     mapLayer = layer;
            // }

            indigenousLayer = brApp.map.getLayer('indigenousLands');

            if (indigenousLayer) {
                if (indigenousLayer.visible) {
                    deferreds.push(self.identifyIndigenous(mapPoint));
                }
            }

            nationalLayer = brApp.map.getLayer('nationalLevel');

            if (nationalLayer) {

                if (nationalLayer.visible) {
                    deferreds.push(self.identifyNational(mapPoint));
                }
            }

            // userGraphics = brApp.map.getLayer('CustomFeatures');
            // if (userGraphics) {
            //     if (userGraphics.visible) {
            //         deferreds.push(self.identifyUserShapes(mapPoint));
            //     }
            // }

            if (deferreds.length === 0) {
                return;
            }

            all(deferreds).then(function(featureSets) {
                arrayUtils.forEach(featureSets, function(item) {
                    switch (item.layer) {
                        case "indigenousLands":
                            features = features.concat(self.setIndigenousTemplates(item.features));
                            break;
                        case "nationalLevel":
                            features = features.concat(self.setNationalTemplates(item.features));
                            break;
                            // case "CustomFeatures":
                            //     //     // This will only contain a single feature and return a single feature
                            //     //     // instead of an array of features
                            //     features.push(self.setCustomGraphicTemplates(item.feature));
                            //     break;
                        default: // Do Nothing
                            break;
                    }
                });

                if (features.length > 0) {
                    brApp.map.infoWindow.setFeatures(features);
                    brApp.map.infoWindow.resize(450);
                    $(".titlePane").removeClass("analysis-header");
                    $(".titleButton.close").css("color", "white");
                    brApp.map.infoWindow.show(mapPoint);
                    $(".esriPopup .titleButton.close").html("&#10005;");
                }
            });

        },

        identifyIndigenous: function(mapPoint) {
            brApp.debug('MapController >>> identifyIndigenous');

            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.layers.indigenousLands.url),
                params = new IdentifyParameters(),
                mapLayer = brApp.map.getLayer('indigenousLands');

            params.tolerance = 3;
            params.returnGeometry = true;
            params.width = brApp.map.width;
            params.height = brApp.map.height;
            params.maxAllowableOffset = Math.floor(brApp.map.extent.getWidth() / brApp.map.width);
            params.geometry = mapPoint;
            params.mapExtent = brApp.map.extent;
            params.layerIds = mapLayer.visibleLayers;
            if (params.layerIds.indexOf(4) > -1) {
                params.layerIds.splice(params.layerIds.indexOf(4), 1);
            }
            if (params.layerIds.indexOf(11) > -1) {
                params.layerIds.splice(params.layerIds.indexOf(11), 1);
            }

            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;

            identifyTask.execute(params, function(features) {
                if (features.length > 0) {
                    console.log(features);
                    deferred.resolve({
                        layer: "indigenousLands",
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
            // if (params.layerIds.indexOf(4) > -1) {
            //     params.layerIds.splice(params.layerIds.indexOf(4), 1);
            // }
            // if (params.layerIds.indexOf(11) > -1) {
            //     params.layerIds.splice(params.layerIds.indexOf(11), 1);
            // }

            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;

            identifyTask.execute(params, function(features) {
                if (features.length > 0) {
                    console.log(features.length);
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

        setIndigenousTemplates: function(featureObjects) {
            brApp.debug('MapController >>> setIndigenousTemplates');

            var template,
                features = [],
                self = this;

            arrayUtils.forEach(featureObjects, function(item) {
                if (item.layerId === 4) {
                    return;
                }
                template = new InfoTemplate(item.value,
                    // "<div class='even-row'><div class='popup-header'>Layer Name</div>" + item.layerName + " - " + item.layerId + '</div>' +
                    "<div class='odd-row'><div class='popup-header'>Official Recognition</div>" + item.feature.attributes.Ofcl_Rec + '</div>' +
                    "<div class='even-row'><div class='popup-header'>Status</div>" + item.feature.attributes.Ofcl_Rec + '</div>' +
                    "<div class='odd-row'><div class='popup-header'>Category</div>" + item.feature.attributes.Category + '</div>' +
                    "<div class='even-row'><div class='popup-header'>Size</div>Official Size: " + self.numberWithCommas(item.feature.attributes.Area_Ofcl) + " ha<br>GIS Area: " + self.numberWithCommas(item.feature.attributes.Area_GIS) + " ha</div>" +
                    "<div class='odd-row'><div class='popup-header'>Country</div>" + item.feature.attributes.Country + '</div>' +
                    "<div class='even-row'><div class='popup-header'>Ethnicity</div>" + item.feature.attributes.Ethncity_1 + '</div>' +
                    "<div class='odd-row'><div class='popup-header'>Data Contributor</div>" + item.feature.attributes.Data_Ctrb + '</div>' +
                    "<div class='even-row'><div class='popup-header'>Data Source</div>" + item.feature.attributes.Data_Src + '</div>' +
                    "<div class='popup-last'>Last Updated: " + item.feature.attributes.Last_Updt + '<span id="additionalInfo"> Additional Info</span></div>'
                );

                if (item.layerId === 1) {
                    template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='css/images/formalDocIcon.png'> " + template.title;
                } else if (item.layerId === 2) {
                    template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='css/images/tiltingIcon.png'> " + template.title;
                } else if (item.layerId === 3) {
                    template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='css/images/formalLandIcon.png'> " + template.title;
                }
                console.log(item.layerId);
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
                if (item.layerId === 5) {
                    return;
                }

                if (item.layerId === 2 || item.layerId === 3 || item.layerId === 4) {
                    template = new InfoTemplate(item.value,
                        "<div class='odd-row'><div class='popup-header'>Percent of Country Area Held or Used by Indigenous Peoples and Communities</div>" + item.feature.attributes['Percent Indigenous and Community Land'] + "% (" + item.feature.attributes['Contributor of % Community Lands Data'] + ", " + item.feature.attributes['Year of Pct Indigenous & Community Lands Data'] + ")</div>" +
                        "<div class='even-row'><div class='popup-header'>Percent of Country Area Held or Used by Indigenous Peoples</div>" + item.feature.attributes['Percent of Indigenous Lands'] + "% (" + item.feature.attributes['Contributor of Percent Indigenous Lands Data'] + ", " + item.feature.attributes['Year of Pct Indigenous Lands Data'] + ")</div>" +
                        "<div class='odd-row'><div class='popup-header'>Percent of Country Area Held or Used by Communities (Non-Indigenous)</div>" + item.feature.attributes['Percent Community Lands'] + "% (" + item.feature.attributes['Contributor of % Community Lands Data'] + ", " + item.feature.attributes['Year of % Community Lands Data'] + ")</div>" +
                        "<div class='popup-last'>Last Updated: " + item.feature.attributes['Date of Last Update'] + '<span id="additionalInfo"> Additional Info</span></div>'

                    );
                    item.feature.setInfoTemplate(template);
                } else { //layers 0 and 1
                    // template = new InfoTemplate(item.value,
                    //     "<div class='odd-row'><div class='popup-header'>Groups targeted by the legal framework</div>" + item.feature.attributes['Framework'] + "</div>" +
                    //     "<div class='even-row'><div class='popup-header'>Indicator score</div>" + item.feature.attributes.I10_Scr + "</div>" +
                    //     "<div class='odd-row'><div class='popup-header'>Comments</div>" + item.feature.attributes.I10_Com + "</div>" +
                    //     "<div class='odd-row'><div class='popup-header'>Laws and provisions reviewed</div>" + item.feature.attributes.I10_Lap + "</div>" +
                    //     "<div class='odd-row'><div class='popup-header'>Laws and provisions reviewed</div>" + item.feature.attributes.I10_Rev + " (" + item.feature.attributes.I10_Year + ")</div>" +
                    //     "<div class='popup-last'>Last Updated: " + item.feature.attributes.Last_Updt + '<span id="additionalInfo"> Additional Info</span></div>'
                    // );
                    item.feature.setInfoTemplate(self.setCustomNationalTemplate(item.feature));
                }


                // if (item.layerId === 1) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='css/images/formalDocIcon.png'> " + template.title;
                // } else if (item.layerId === 2) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='css/images/tiltingIcon.png'> " + template.title;
                // } else if (item.layerId === 3) {
                //     template.title = "<img style='margin-bottom: 3px; margin-right: 3px;' src='css/images/formalLandIcon.png'> " + template.title;
                // }
                console.log(item.layerId);
                //item.feature.setInfoTemplate(template);

                features.push(item.feature);
            });
            return features;
        },

        setCustomNationalTemplate: function(feature) {

            //do this

            brApp.debug('MapController >>> setCustomNationalTemplate');
            var nationalIndicatorCode = MapAssets.getNationalLevelIndicatorCode();
            var nationalLevelInfoTemplatePercent = new InfoTemplate("${Country}",
                // "<div class='odd-row'><div class='popup-header'>" + brApp.currentLayer + "</div>" +
                "<div class='odd-row'><div class='popup-header'>Groups targeted by the legal framework</div>${Framework}</div>" +
                "<div class='even-row'><div class='popup-header'>Indicator score</div>${I" + nationalIndicatorCode + "_Scr}</div>" +
                "<div class='odd-row'><div class='popup-header'>Comments</div>${I" + nationalIndicatorCode + "_Com}</div>" +
                "<div class='odd-row'><div class='popup-header'>Laws and provisions reviewed</div>${I" + nationalIndicatorCode + "_Lap}</div>" +
                "<div class='odd-row'><div class='popup-header'>Review source and date</div>${I" + nationalIndicatorCode + "_Rev} (${I" + nationalIndicatorCode + "_Year})</div>" +
                "<div class='popup-last'>Last Updated: ${Last_Updt} <span id='additionalInfo'> Additional Info</span></div>"
            );

            return nationalLevelInfoTemplatePercent;

        },

        selectCustomGraphics: function(mapPoint) {
            brApp.debug('MapController >>> selectCustomGraphics');

            brApp.mapPoint = mapPoint;

            var graphic = mapPoint.graphic,
                uniqueIdField = "attributeID",
                graphicsLayer = brApp.map.getLayer("CustomFeatures"),
                dataLayer = brApp.map.getLayer("indigenousLands"),

                self = this,
                polys = [],
                poly,
                content,
                title;

            mapPoint.stopPropagation();


            var failure = function(err) {
                // Handle This Issue Here
                // Discuss with Adrienne How to Handle
                console.log(err);
            };

            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(dataLayer.url),
                params = new IdentifyParameters();

            params.tolerance = 3;
            params.returnGeometry = true;
            params.width = brApp.map.width;
            params.height = brApp.map.height;
            params.geometry = mapPoint.graphic.geometry;
            params.mapExtent = brApp.map.extent;
            params.layerIds = dataLayer.visibleLayers;
            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;

            identifyTask.execute(params, function(features) {

                if (features.length > 0) {
                    console.log(features);
                    deferred.resolve({
                        layer: "indigenousLands",
                        features: features
                    });
                } else {
                    console.log("no feats returned");
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


                template.setContent("<table><tr id='first-row'><b>The area of interest intersects with <i>" + value.features.length + "</i> inidigenous and/or community lands</b></tr><tr><td>Country</td><td>Name</td><td>Identity</td><td>Official Recognition</td><td>Recognition Status</td></tr>");

                function getTextContent(graphic) {

                    var str = "<tr><td>" + graphic.feature.attributes.Country + "</td><td>" +
                        graphic.feature.attributes.Name + "</td><td>" +
                        graphic.feature.attributes.Identity + "</td><td>" +
                        graphic.feature.attributes.Ofcl_Rec + "</td><td>" +
                        graphic.feature.attributes.Rec_Status + "</td></tr>";

                    return str;
                }


                arrayUtils.forEach(value.features, function(feature) {

                    template.setContent(template.content + getTextContent(feature));

                });
                debugger;

                template.setContent(template.content + "<br /><tr id='identifyNote'>Note that the results of this analysis are only as complete as the data available on the platform. Additional indigenous and community lands may be present but are not contained in the available dataset; therefor, a local analysis is always recommended. The Data Completeness layer provides a broad assesment of the completeness of the indigenous and community lands data layer for a reference.</tr></table");
                brApp.map.infoWindow.setTitle("<i>Intersection Analysis</i>");

                brApp.map.infoWindow.setContent(template.content);

                brApp.map.infoWindow.resize(450, 400);
                $(".titlePane").removeClass("analysis-header");
                $(".titleButton.close").css("color", "white");
                brApp.map.infoWindow.show(brApp.mapPoint);
                $(".esriPopup .titleButton.close").html("&#10005;");


            });

            // title = "<span style='padding: 25px;'>Intersection Analysis</span>";
            // content = "<div class='odd-row'>The area of interest intersects with 4 inidigenous and/or community lands</div><div id='resultsPie'></div><div style='width: 250px; padding: 25px; color: black; padding-top: 0px; margin-top: -10px;'><strong>Total Area of the polygon:</strong><br /><span id='total-area'></span> Ha<br /><br />" + "<strong>Area that intersects with Indigenous and Community Lands:</strong><br /><span id='intersect-area'></span> Ha</div>";

            // brApp.map.infoWindow.clearFeatures();

            // brApp.map.infoWindow.setTitle(title);
            // brApp.map.infoWindow.setContent(content);

        },


        showDataComplete: function() {
            brApp.debug('MapController >>> showDataComplete');
            var dynamicLayer = brApp.map.getLayer('nationalLevel');
            var imageUrlChecked = "url('css/images/checkbox_checked.png')";
            var imageUrlUnchecked = "css/images/checkbox_unchecked.png";


            if (this.dataset.checked === 'false') {
                $('#data-complete-checkbox').removeClass('data-complete-checkbox-class').addClass('data-complete-checkbox-class-checked');
                dynamicLayer.visibleLayers.push(5);
                this.dataset.checked = 'true';
            } else {
                $('#data-complete-checkbox').removeClass('data-complete-checkbox-class-checked').addClass('data-complete-checkbox-class');
                var index = dynamicLayer.visibleLayers.indexOf(5);
                dynamicLayer.visibleLayers.splice(index, 1);
                this.dataset.checked = 'false';
            }
            topic.publish('refresh-legend');
            dynamicLayer.setVisibleLayers(dynamicLayer.visibleLayers);
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
                    debugger;
                    //id = 'national-level-tree-percentage';
                    domClass.add('national-level-data-container', 'hidden');
                    domClass.add('national-level-tree-percentage', 'hidden');
                    break;

            }
            //debugger;
            domClass.add(target, 'active');
            // domClass.add(id, 'active');
            // domClass.remove(id, 'hidden');

        },

        exportAnalysis: function(config) {
            brApp.debug('MapController >>> exportAnalysis');

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
            registry.byId('legend').refresh();

        }

    };

    return MapController;

});