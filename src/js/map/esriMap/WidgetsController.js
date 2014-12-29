define([
	'main/config',
	'dojo/on',
	'dijit/Dialog',
	'dojo/_base/fx',
	'dojo/dom-class',
	'dijit/registry'
], function (AppConfig, on, Dialog, Fx, domClass, registry) {
	'use strict';

	var DURATION = 300;

	var Controller = {
		/**
		* Toggle the legend container open or close
		*/
		toggleLegend: function () {
			brApp.debug('WidgetsController >>> toggleLegend');
			var node = document.getElementById('legend-content'),
					legendNode = document.querySelector('.brMap .legend-content'),
					active = domClass.contains(legendNode, 'active'),
					height = active ? 0 : node.scrollHeight;

			domClass.toggle(legendNode, 'active');

			Fx.animateProperty({
				node: node,
				properties: {
					height: height
				},
				duration: DURATION,
				onEnd: function () {
					if (height !== 0) {
						// Update the size of the legend as it grows so no scrollbars
						node.style.height = 'auto';
					}
				}
			}).play();
		},

		/**
		* Toggle the basemap gallery container open or close
		*/
		toggleBasemapGallery: function () {
			brApp.debug('WidgetsController >>> toggleBasemapGallery');
			var connector = document.querySelector('.brMap .basemap-container'),
					container = document.querySelector('.brMap .basemap-connector');

			if (connector && container) {
				domClass.toggle(connector, 'hidden');
				domClass.toggle(container, 'hidden');
			}

		},

		/**
		* Show the appropriate data container when radio button is toggled
		*/
		toggleDataContainer: function (evt) {
			var target = evt.target ? evt.target : evt.srcElement;
			if (target.id === 'national-level-toggle') {
				domClass.add('community-level-data-container', 'hidden');
				domClass.remove('national-level-data-container', 'hidden');
			} else if (target.id === 'community-level-toggle') {
				domClass.add('national-level-data-container', 'hidden');
				domClass.remove('community-level-data-container', 'hidden');
			}
		},

		/**
		* Toggle the tree widget container open or close
		*/
		toggleTreeContainer: function () {
			brApp.debug('WidgetsController >>> toggleTreeContainer');
			var labelNode = document.getElementById('tree-container-toggle'),
					node = document.getElementById('tree-content'),
					active = domClass.contains(node, 'active'),
					height = active ? 0 : node.scrollHeight;

			labelNode.innerHTML = active ? '&plus;' : '&minus;';
			if (!active) {
				// If not active. add class now, else, add when animation done
				domClass.toggle(node, 'active');
			}

			Fx.animateProperty({
				node: node,
				properties: {
					height: height
				},
				duration: DURATION,
				onEnd: function () {
					if (height !== 0) {
						// Update the size of the legend as it grows so no scrollbars
						node.style.height = 'auto';
					} else {
						domClass.toggle(node, 'active');
					}
				}
			}).play();

		},		

		/**
		* Show the Welcome Dialog/Launch Screen for the Map
		*/
		showWelcomeDialog: function () {
			brApp.debug('WidgetsController >>> showWelcomeDialog');
			var dialogContent = AppConfig.welcomeDialogContent,
					launchDialog;

			// Add a Close button to the dialog
			if (!registry.byId('launch-dialog')) {
				dialogContent += "<button id='launch-map' class='right'>Launch Interactive Map</button>";
				launchDialog = new Dialog({
					id: 'launch-dialog',
					content: dialogContent,
					style: "width: 90%;max-width: 760px;" 
				});

				launchDialog.show();
				on(document.getElementById('launch-map'), 'click', function () {
					registry.byId('launch-dialog').hide();
				});

			} else {
				registry.byId('launch-dialog').show();
			}

		}

	};

	return Controller;

});