define([
	'dojo/on',
	'dojo/topic',
	'map/WidgetsController'
], function (on, topic, WidgetsController) {
	'use strict';

	var AppController = {

		/**
		* Init the App Controller, calling necessary overrides and attaching events as needed
		*/
		init: function () {
			brApp.debug('AppController >>> init');
			this.overrideEvents();
			this.bindEvents();
		},

		/**
		* Override default events here, such as routing to the home or map page when were in the map
		*/
		overrideEvents: function () {
			brApp.debug('AppController >>> overrideEvents');
			on(document.getElementById('home-page-link'), 'click', this.overrideNav);
			on(document.getElementById('map-page-link'), 'click', this.overrideNav);
		},

		/**
		* Connect to other important events here related to the whole behaviour of the app
		*/
		bindEvents: function () {
			brApp.debug('AppController >>> bindEvents');
			var self = this;

			topic.subscribe('changedLayout', function (isMobile) {
				if (isMobile) { 
					self.layoutChangedToMobile();
				} else {
					self.layoutChangedToDesktop();
				}
			});

		},

		/**
		* Prevent routing to new page and handle special behaviors here as well
		*/
		overrideNav: function (evt) {
			brApp.debug('AppController >>> overrideNav');
			// Hack Fix for top-bar shifting
			$('.toggle-topbar').click();
			$('.top-bar').css('height','auto');
			evt.preventDefault();
			// Get a reference to the clicked element
			var target = evt.target ? evt.target : evt.srcElement;
			// If they clicked home, show launch dialog
			if (target.id === 'home-page-link') {
				WidgetsController.showWelcomeDialog();
			}
		},

		/**
		* Layout is now in mobile view, move elements and hide things as needed
		*/
		layoutChangedToMobile: function () {
			brApp.debug('AppController >>> layoutChangedToMobile');
		},

		/**
		* Layout is now in desktop view, move elements and unhide things as needed
		*/
		layoutChangedToDesktop: function () {
			brApp.debug('AppController >>> layoutChangedToDesktop');

		}

	};

	return AppController;

});