define([
    'dojo/on',
    'dojo/topic',
    'dijit/registry',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/cookie',
    'utils/Helper',
    'map/WidgetsController',
], function(on, topic, registry, domStyle, domClass, domConstruct, cookie, Helper, WidgetsController) {


    var AppController = {

        /**
         * Init the App Controller, calling necessary overrides and attaching events as needed
         */
        init: function() {
            brApp.debug('AppController >>> init');
            this.bindEvents();
        },

        /**
         * Connect to other important events here related to the whole behaviour of the app
         */
        bindEvents: function() {
            brApp.debug('AppController >>> bindEvents');
            var self = this;

            topic.subscribe('changedLayout', function(isMobile) {
                if (isMobile) {
                    self.layoutChangedToMobile();
                } else {
                    self.layoutChangedToDesktop();
                }
            });

            topic.subscribe('legend-loaded', function() {
                if (Helper.isMobile()) {

                  this.layoutChangedToMobile();
                }
            }.bind(this));

        },

        /**
         * Layout is now in mobile view, move elements and hide things as needed
         */
        layoutChangedToMobile: function() {
            brApp.debug('AppController >>> layoutChangedToMobile');
            var legendTabContainer = document.getElementById('mobile-legend-content'),
                layersTabContainer = document.getElementById('mobile-layers-content'),
                toolsTabContainer = document.getElementById('mobile-tools-content');


            // Move Nodes to their new containers
            // Layers Tab
            var layerList = document.getElementById('layer-content');
            domConstruct.place(layerList, layersTabContainer, 'last');

            if ($('#layer-content').css("height") === "0px") {
                $('#layer-content').css("height", "auto");
            }

            // Legend Tab
            var legend = document.getElementById('legend-component');

            // var legendComponent = new LegendComponent('legend-component2');


            // Tools Tab
            var analyzeTools = document.getElementById('analysis-content');
            domConstruct.place(analyzeTools, toolsTabContainer, 'first');

            // Resize the accordion since it needs to be resized every time css changes when its hidden
            // just do it to be safe until we remove the accordion and build our own
            var layerAccordion = registry.byId('layer-accordion');
            if (layerAccordion) {
                layerAccordion.resize();
            }
        },

        /**
         * Layout is now in desktop view, move elements and unhide things as needed
         */
        layoutChangedToDesktop: function() {
            brApp.debug('AppController >>> layoutChangedToDesktop');
            var legendContainer = document.getElementById('brMap'),
                treeContainer = document.getElementById('tree-widget-container');
            // Layers Tab
            var layerList = document.getElementById('layer-content');
            domConstruct.place(layerList, treeContainer, 'last');

            //$('#tree-content').removeClass("mobile-active");

            // Tools Tab
            var analyzeTools = document.getElementById('analysis-content');
            registry.byId('analysis-dialog').setContent(analyzeTools);

            // Ensure our menu is close and reset the css to default
            domStyle.set('brMap', 'left', '0');
            domClass.remove('mobileMenu', 'open');

            // Resize the accordion since it needs to be resized every time css changes when its hidden
            // just do it to be safe until we remove the accordion and build our own
            // var layerAccordion = registry.byId('layer-accordion');
            // if (layerAccordion) {
            //     layerAccordion.resize();
            // }
        }

    };

    return AppController;

});
