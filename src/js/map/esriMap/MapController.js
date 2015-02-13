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
    'dijit/registry',
    'esri/dijit/Legend',
    'esri/dijit/Geocoder',
    'esri/dijit/HomeButton',
    'esri/dijit/LocateButton',
    'esri/dijit/BasemapGallery'
], function(Map, Uploader, DrawTool, MapConfig, ReactTree, WidgetsController, on, dojoQuery, domClass, domConstruct, registry, Legend, Geocoder, HomeButton, LocateButton, BasemapGallery) {
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
            on(document.getElementById('brMap'), 'click', self.handleClick);

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
                layer;

            brApp.map.infoWindow.clearFeatures();

            for (layer in MapConfig.layers) {
                console.log(layer);
            }
            // layer = brMap.getLayer(MapConfig.fires.id);
            // if (layer) {
            //     if (layer.visible) {
            //         deferreds.push(self.identifyFires(mapPoint));
            //     }
            // }
        },

        refreshLegend: function() {
            brApp.debug('MapController >>> refreshLegend');
            registry.byId('legend').refresh();
        }

    };

    return MapController;

});