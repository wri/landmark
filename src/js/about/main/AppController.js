define(['components/aboutAccordion', 'about/main/config'], function(AboutAccordion, aboutConfig) {
    'use strict';

    var AppController = {

        /**
         * Init the App Controller, calling necessary overrides and attaching events as needed
         */
        init: function() {
            brApp.debug('AppController >>> init');
            this.overrideEvents();
            this.bindEvents();
            this.renderComponents();
            // If we are loading on a mobile device, move the content into the correct panel
            // if (Helper.isMobile()) {
            //     this.layoutChangedToMobile();
            // }

        },

        /**
         * Override default events here, such as routing to the home or map page when were in the map
         */
        overrideEvents: function() {
            brApp.debug('AppController >>> overrideEvents');
            //on(document.getElementById('home-page-link'), 'click', this.overrideNav); //TODO: No 'om so use jquery for these events'
            //on(document.getElementById('map-page-link'), 'click', this.overrideNav);
        },

        /**
         * Connect to other important events here related to the whole behaviour of the app
         */
        bindEvents: function() {
            brApp.debug('AppController >>> bindEvents');
            var self = this;
            // $(".right > li").on("click", function() {
            //     $(".right > li").removeClass("active-page");
            //     $(this).addClass("active-page");
            //     debugger;
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
            if (target.id === 'home-page-link') {
                console.log("home");
                WidgetsController.showWelcomeDialog();
            }
        },

        renderComponents: function() {
            brApp.debug('AppController >>> renderComponents');
            var newAccord = new AboutAccordion(null, "aboutAccordion");
        },


    };

    return AppController;

});