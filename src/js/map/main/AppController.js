define([
    'dojo/on',
    'dojo/topic',
    'dijit/registry',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/cookie',
    'utils/Helper',
    'map/WidgetsController'
], function(on, topic, registry, domStyle, domClass, domConstruct, cookie, Helper, WidgetsController) {
    'use strict';

    var AppController = {

        /**
         * Init the App Controller, calling necessary overrides and attaching events as needed
         */
        init: function() {
            brApp.debug('AppController >>> init');
            this.overrideEvents();
            this.bindEvents();

            // If we are loading on a mobile device, move the content into the correct panel
            if (Helper.isMobile()) {
                this.layoutChangedToMobile();
            }
            // brApp.hideDialog = false;

        },

        /**
         * Override default events here, such as routing to the home or map page when were in the map
         */
        overrideEvents: function() {
            brApp.debug('AppController >>> overrideEvents');
            //on(document.getElementById('home-page-link'), 'click', this.overrideNav);
            on(document.getElementById('map-page-link'), 'click', this.overrideNav);
            //TODO: Add event handler here to add underline to active page!

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

            // window.addEventListener("resize", function() {
            //     if (window.innerWidth > 799 && brApp.showTheseThings === true) {
            //         debugger;
            //         $("#data-completeness-container").show();
            //         $("#analysis-button").show();
            //         brApp.showTheseThings = false;
            //     }
            // });

        },

        /**
         * Prevent routing to new page and handle special behaviors here as well
         */
        overrideNav: function(evt) {
            brApp.debug('AppController >>> overrideNav');
            // Hack Fix for top-bar shifting
            $('.toggle-topbar').click();
            $('.top-bar').css('height', 'auto');
            evt.preventDefault();
            // Get a reference to the clicked element
            var target = evt.target ? evt.target : evt.srcElement;
            // If they clicked home, show launch dialog
            if (target.id === 'map-page-link') {
                WidgetsController.showWelcomeDialog();
            }
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
            var treeContent = document.getElementById('tree-content');
            domConstruct.place(treeContent, layersTabContainer, 'last');

            if ($('#tree-content').css("height") === "0px") {
                $('#tree-content').css("height", "auto");
            }

            // Legend Tab
            var legend = document.getElementById('legend');
            domConstruct.place(legend, legendTabContainer, 'last');
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
            var legendContainer = document.getElementById('legend-content'),
                treeContainer = document.getElementById('tree-widget-container');
            // Layers Tab
            var treeContent = document.getElementById('tree-content');
            domConstruct.place(treeContent, treeContainer, 'last');

            //$('#tree-content').removeClass("mobile-active");
            // Legend Content
            var legend = document.getElementById('legend');
            domConstruct.place(legend, legendContainer, 'last');
            // Tools Tab
            var analyzeTools = document.getElementById('analysis-content');
            registry.byId('analysis-dialog').setContent(analyzeTools);

            // Ensure our menu is close and reset the css to default
            domStyle.set('brMap', 'left', '0');
            domClass.remove('mobileMenu', 'open');

            // Resize the accordion since it needs to be resized every time css changes when its hidden
            // just do it to be safe until we remove the accordion and build our own
            var layerAccordion = registry.byId('layer-accordion');
            if (layerAccordion) {
                layerAccordion.resize();
            }
        }

    };

    return AppController;

});