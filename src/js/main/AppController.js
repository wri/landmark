define([
    'dojo/on',
    'dojo/topic',
    'dijit/registry',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/cookie',
    'map/WidgetsController',
], function(on, topic, registry, domStyle, domClass, domConstruct, cookie, WidgetsController) {


    var AppController = {
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
