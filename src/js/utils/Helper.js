define([
    'dojo/on',
    'dojo/topic',
    'dojo/dom-class',
    'dojo/dom-geometry',
    'dojo/_base/window'
], function(on, topic, domClass, domGeom, win) {

    var body = win.body(),
        mobileThreshold = 768,
        threshold = 800,
        prevWidth,
        width;

    /**
     * Add or remove mobile class and publish a method others can subscribe to for a layout change
     */
    function applyLayout() {
        // width = domGeom.position(body).w;
        // // if (width < threshold) {
        // //     domClass.add(body, "mobile");
        // // } else {
        // //     domClass.remove(body, "mobile");
        // // }
        //
        // console.log(width);
        //
        // if (width <= mobileThreshold) {
        //   var layerTree = document.querySelector('.tree-widget-container')
        //   var searchButton = document.querySelector('.search-button')
        //   var analysisButton = document.querySelector('.analysis-button')
        //   var reportButton = document.querySelector('.report-button')
        //   domClass.add(layerTree, 'hidden');
        //   domClass.add(searchButton, 'hidden');
        //   console.log('hidden');
        //   domClass.add(analysisButton, 'hidden');
        //   domClass.add(reportButton, 'hidden');
        // }

        if (prevWidth > mobileThreshold && width < mobileThreshold) {
            if ($("#toolsMenuButton").hasClass('active')) {
                $('#layersMenuButton').click();
            }
        }

        // Dont broadcast every time the window changes size,
        // only when switching to phone or desktop
        if (prevWidth < threshold && width > threshold) {
            topic.publish("changedLayout", false);
        }
        if (prevWidth > threshold && width < threshold) {
            topic.publish("changedLayout", true); // True for changing to mobile
        }
        prevWidth = width;
    }

    var Helper = {

        /**
         * Apply layout class and listener
         */
        enableLayout: function() {
            brApp.debug('Helper >>> enableLayout');
            applyLayout();
            on(win.global, 'resize', applyLayout);
        },

        /**
         * @return {boolean} whether or not the width of the screen is above or below the threshold
         */
        isMobile: function() {
            // return width ? width < threshold : domGeom.position(body).w < threshold;
            return false
        }

    };

    return Helper;

});
