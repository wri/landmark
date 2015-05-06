define([
    'main/config',
    'dojo/on',
    'dojo/dom',
    'dijit/Dialog',
    'dojo/_base/fx',
    'dojo/dom-class',
    "dojo/cookie",
    'dojo/dom-style',
    'dijit/registry'
], function(AppConfig, on, dom, Dialog, Fx, domClass, cookie, domStyle, registry) {
    'use strict';

    var DURATION = 300;

    var Controller = {
        /**
         * Toggle the legend container open or close
         */
        toggleLegend: function() {
            brApp.debug('WidgetsController >>> toggleLegend');
            var node = document.getElementById('legend-content'),
                legendNode = document.querySelector('.brMap .legend-content'),
                active = domClass.contains(legendNode, 'active'),
                height = active ? 0 : node.scrollHeight;

            if (active) {
                $("#legend-toggle-icon").html("+");
                //$("#legend-toggle-icon").css("background", "url('css/images/checkbox_checked.png')");
            } else {
                $("#legend-toggle-icon").html("&ndash;");
                //$("#legend-toggle-icon").css("background", "url('css/images/close_minus_symbol.png')");
            }

            domClass.toggle(legendNode, 'active');

            Fx.animateProperty({
                node: node,
                properties: {
                    height: height
                },
                duration: DURATION,
                onEnd: function() {
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
        toggleBasemapGallery: function() {
            brApp.debug('WidgetsController >>> toggleBasemapGallery');
            var connector = document.querySelector('.brMap .basemap-container'),
                container = document.querySelector('.brMap .basemap-connector');

            if (this.shareContainerVisible()) {
                this.toggleShareContainer();
            }

            if (connector && container) {
                domClass.toggle(connector, 'hidden');
                domClass.toggle(container, 'hidden');
            }

        },

        /**
         * Toggle the basemap gallery container open or close
         */
        toggleShareContainer: function() {
            brApp.debug('WidgetsController >>> toggleShareContainer');
            var connector = document.querySelector('.brMap .share-container'),
                container = document.querySelector('.brMap .share-connector');

            if (this.basemapContainerVisible()) {
                this.toggleBasemapGallery();
            }

            if (connector && container) {
                domClass.toggle(connector, 'hidden');
                domClass.toggle(container, 'hidden');
            }

        },

        /**
         * @return {boolean} boolean representing state of the container, true if it is visible
         */
        shareContainerVisible: function() {
            return !domClass.contains(document.querySelector('.brMap .share-container'), 'hidden');
        },

        /**
         * @return {boolean} boolean representing state of the container, true if it is visible
         */
        basemapContainerVisible: function() {
            return !domClass.contains(document.querySelector('.brMap .basemap-container'), 'hidden');
        },

        /**
         * Toggle the tree widget container open or close
         */
        toggleTreeContainer: function() {
            brApp.debug('WidgetsController >>> toggleTreeContainer');
            var labelNode = document.getElementById('tree-container-toggle'),
                container = document.getElementById('tree-widget-container'),
                node = document.getElementById('tree-content'),
                active = domClass.contains(node, 'active'),
                height;

            labelNode.innerHTML = active ? '&plus;' : '&minus;';
            if (!active) {
                // If not active. add class now, else, add when animation done
                domClass.toggle(node, 'active');
                domStyle.set(container, 'bottom', '20px');
            } else {
                domStyle.set(container, 'bottom', 'auto');
            }

            // Set the height
            height = active ? 0 : (container.offsetHeight - 34);

            Fx.animateProperty({
                node: node,
                properties: {
                    height: height
                },
                duration: DURATION,
                onEnd: function() {
                    if (height !== 0) {
                        // Update the size of the legend as it grows so no scrollbars
                        // node.style.height = 'auto';
                    } else {
                        domClass.toggle(node, 'active');
                    }
                }
            }).play();

        },

        /**
         * Toggle the mobile menu open or close
         */
        toggleMobileMenu: function() {
            brApp.debug('WidgetsController >>> toggleMobileMenu');
            var mapNode = document.getElementById('brMap'),
                accordion = registry.byId('layer-accordion'),
                menuNodeId = 'mobileMenu',
                menuButton = 'mobile-menu-toggle',
                isClosing = domClass.contains(menuNodeId, 'open'),
                left = isClosing ? 0 : 290;

            if (!isClosing) {
                $("#mobile-menu-toggle").css("display", "none");
                domClass.toggle(menuNodeId, 'open');
                domClass.toggle(menuButton, 'hidden');
            } else {
                $("#mobile-menu-toggle").css("display", "block");
                domClass.remove(menuButton, 'hidden');
            }

            Fx.animateProperty({
                node: mapNode,
                properties: {
                    left: left
                },
                duration: DURATION,
                onEnd: function() {
                    brApp.map.resize();
                    if (isClosing) {
                        domClass.toggle(menuNodeId, 'open');
                    }
                    if (accordion) {
                        accordion.resize();
                    }
                }
            }).play();

        },

        /**
         * notifies of the status of the mobile settings menu
         * @return {boolean}
         */
        mobileMenuIsOpen: function() {
            return domClass.contains('mobileMenu', 'open');
        },

        /**
         * Toggle the appropriate container's visibility based on which button was clicked in the UI
         */
        toggleMobileMenuContainer: function(evt) {
            brApp.debug('WidgetsController >>> toggleMobileMenuContainer');
            var target = evt.target ? evt.target : evt.srcElement,
                menuNode = document.querySelector('.segmented-menu-button.active'),
                containerNode = document.querySelector('.mobile-menu-content.active'),
                id;

            // If section is already active, back out now
            // Else remove active class from target and containerNode
            if (domClass.contains(target, 'active')) {
                return;
            }

            if (menuNode) {
                domClass.remove(menuNode, 'active');
            }

            if (containerNode) {
                domClass.remove(containerNode, 'active');
            }

            // Now add the active class to the target and to the container
            switch (target.id) {
                case "legendMenuButton":
                    id = 'mobile-legend-content';
                    break;
                case "toolsMenuButton":
                    id = 'mobile-tools-content';
                    break;
                case "layersMenuButton":
                    id = 'mobile-layers-content';
                    break;
            }

            domClass.add(target, 'active');
            domClass.add(id, 'active');

        },

        showEmbedCode: function() {
            if (registry.byId("embedCodeShareDialog")) {
                registry.byId("embedCodeShareDialog").destroy();
            }
            var embedCode = "<iframe src='" + window.location + "' height='600' width='900'></iframe>",
                dialog = new Dialog({
                    title: "Embed Code",
                    style: "width: 350px",
                    id: "embedCodeShareDialog",
                    content: "Copy the code below to embed in your site. (Ctrl+C on PC and Cmd+C on Mac)" +
                        "<div class='dijitDialogPaneActionBar'>" +
                        '<input id="embedInput" type="text" value="' + embedCode + '" autofocus /></div>'
                }),
                cleanup;


            cleanup = function() {
                //dialog.destroy(); //TODO- Why destroy on close??
            };

            dialog.show();
            dom.byId("embedInput").select();

            dialog.on('cancel', function() {
                cleanup();
            });
        },

        /**
         * Show the Welcome Dialog/Launch Screen for the Map
         */
        showWelcomeDialog: function() {
            brApp.debug('WidgetsController >>> showWelcomeDialog');
            //Check is the user has specified to hide the dialog
            // if (brApp.hideDialog) {
            //     return;
            // }

            var dialogContent = AppConfig.welcomeDialogContent,
                id = 'launch-dialog',
                currentCookie,
                setCookie,
                cleanup,
                launchDialog;

            cleanup = function(destroyDialog) {
                setCookie();

                launchDialog.hide();
            };

            setCookie = function() {
                if (dom.byId("welcomeDialogMemory")) {
                    if (dom.byId("welcomeDialogMemory").checked) {
                        cookie("launch-dialog", 'dontShow', {
                            expires: 7
                        });
                    }
                }
            };

            // Add a Close button to the dialog
            if (!registry.byId(id)) {
                dialogContent += "<input type='checkbox' id='welcomeDialogMemory'> Don't show this dialog again";
                launchDialog = new Dialog({
                    id: id,
                    content: dialogContent,
                    style: "width: 450px;max-width: 760px;"
                });
            } else {
                launchDialog = registry.byId(id);
            }
            currentCookie = cookie("launch-dialog");
            // if launchDialog.open == true, return

            if (currentCookie === undefined || currentCookie !== "dontShow") {

                launchDialog.show();
                // cbox = new CheckBox({
                //     checked: false,
                // }, "remembershowInstructions");

                launchDialog.on('cancel', function() {
                    cleanup(false);
                });
            } else {
                cleanup(true);
            }


            // if (document.getElementById('welcomeDialogMemory').checked == true) {
            //     brApp.hideDialog = true;
            // }
            //     registry.byId(id).hide();
            // });
            // cleanup(true);




            // } else {
            //     registry.byId(id).show();
            // }

        },

        /**
         * Toggle the upload form visible or not
         */
        toggleUploadForm: function() {
            brApp.debug('WidgetsController >>> toggleUploadForm');
            domClass.toggle('upload-form-content', 'hidden');
        },

        printMap: function() {
            brApp.debug('WidgetsController >>> printMap');
            var body = document.getElementsByTagName("body")[0];

            domClass.add(body, "map-view-print");
            $(".app-header").resize();
            $("#brMap").resize();
            brApp.map.resize()
            //debugger;
            // o.map.resize();
            on.once(brApp.map, 'resize', function() {
                // Allow Layers to redraw themselves, wind layer takes 1500ms 
                setTimeout(function() {
                    window.print();

                    domClass.remove(body, "map-view-print");
                    //registry.byId("stackContainer").resize();
                    brApp.map.resize();
                }, 2000);
            });

        },

        /**
         * Show the Analysis Dialog with the draw and upload buttons
         */
        showAnalysisDialog: function(customGraphics) {
            brApp.debug('WidgetsController >>> showAnalysisDialog');

            if (customGraphics.graphics.length > 0) {
                $('#remove-graphics').removeClass('hidden');
                $('#draw-shape').addClass('display-three');
                $('#upload-shapefile').addClass('display-three');




            } else {
                $('#remove-graphics').addClass('hidden');
                $('#draw-shape').removeClass('display-three');
                $('#upload-shapefile').removeClass('display-three');
            }
            registry.byId('analysis-dialog').show();
        },

        showHelp: function(click) {
            brApp.debug('WidgetsController >>> showHelp');
            var id = click.target.id;
            var dialog;
            var left = click.pageX + "px";
            var top = click.pageY + "px";

            switch (id) {
                case "indigenous-lands-help":

                    dialog = registry.byId('help-dialog-indigenous');
                    dialog.show();
                    $('#help-dialog-indigenous').css("top", top);
                    $('#help-dialog-indigenous').css("left", left);

                    break;
                case "community-lands-help":
                    dialog = registry.byId('help-dialog-community');
                    dialog.show();
                    $('#help-dialog-community').css("top", top);
                    $('#help-dialog-community').css("left", left);

                    break;
                case "analysis-help":

                    dialog = registry.byId('help-dialog-completeness');
                    dialog.show();
                    $('#help-dialog-completeness').css("top", top);
                    $('#help-dialog-completeness').css("left", left);
                    break;
            }





        }

    };

    return Controller;

});