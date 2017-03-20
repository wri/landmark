define([
    'main/config',
    'map/Map',
    'map/MapConfig',
    'dojo/on',
    'dojo/dom',
    'dijit/Dialog',
    'dojo/_base/fx',
    'dojo/dom-class',
    "dojo/cookie",
    'dojo/dom-style',
    'dijit/registry',
    'esri/tasks/PrintTask',
    'esri/tasks/PrintTemplate',
    'esri/tasks/PrintParameters',
    'dojo/dom-geometry',
    'dojo/_base/window'
], function(AppConfig, Map, MapConfig, on, dom, Dialog, Fx, domClass, cookie, domStyle, registry, PrintTask, PrintTemplate, PrintParameters, domGeom, win) {


    var DURATION = 300;

    var Controller = {
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

            var commTab = document.querySelector('.community-layers-tab');

            var node = document.getElementById('layer-content');
            var active = domClass.contains(node, 'active');
            var treeWidget = document.querySelector('.tree-widget-container');
            if (!active) {
              if (commTab.classList.contains('hidden')) {
                treeWidget.style.height = '200px';
              } else {
                  treeWidget.style.height = '500px';
              }
            } else {
              treeWidget.style.height = 'auto';
            }

            var topBar = document.getElementById('tree-widget-container'),
              labelNode = document.getElementById('tree-container-toggle'),
              treeTitle = document.getElementById('tree-title'),
              innerNode = document.querySelector('.layer-tab-container'),
              height, width;

            labelNode.innerHTML = active ? '&plus;' : '&minus;';
            domClass.toggle(labelNode, 'padding-right');
            domClass.toggle(innerNode, 'hidden');

            // Set the height
            height = active ? 0 : (topBar.offsetHeight - 34);
            width = active ? 180 : 360;

            domClass.toggle(node, 'active');
            dom.byId('layer-content').style.height = height+'px';
            dom.byId('layer-content').style.width = width+'px';
            domStyle.set('tree-title', 'width', width+'px');
            dom.byId('layer-content').style.treeTitle = treeTitle;

            dom.byId('tree-widget-container').style.height = '95%';
            dom.byId('layer-content').style.height = '100%';

        },

        togglePrintModal: function() {
          var printModal = document.querySelector('.print-modal-wrapper')
          domClass.toggle(printModal, 'hidden');
        },

        toggleMobileTree: function() {
          var layerTree = document.querySelector('.tree-widget-container')
          var searchButton = document.querySelector('.search-button')
          var reportButton = document.querySelector('.report-button')

          registry.byId('analysis-dialog').hide();

          if (!domClass.contains(searchButton, "hidden")) {
            domClass.toggle(searchButton, 'hidden');
          }
          if (!domClass.contains(reportButton, "hidden")) {
            domClass.toggle(reportButton, 'hidden');
          }
          domClass.toggle(layerTree, 'hidden');
        },

        toggleMobileSearch: function() {
          var layerTree = document.querySelector('.tree-widget-container')
          var searchButton = document.querySelector('.search-button')
          var reportButton = document.querySelector('.report-button')

          registry.byId('analysis-dialog').hide();

          if (!domClass.contains(layerTree, "hidden")) {
            domClass.toggle(layerTree, 'hidden');
          }
          if (!domClass.contains(reportButton, "hidden")) {
            domClass.toggle(reportButton, 'hidden');
          }
          domClass.toggle(searchButton, 'hidden');
        },

        toggleMobileCountrySearch: function() {
          var layerTree = document.querySelector('.tree-widget-container')
          var searchButton = document.querySelector('.search-button')
          var reportButton = document.querySelector('.report-button')

          registry.byId('analysis-dialog').hide();

          if (!domClass.contains(layerTree, "hidden")) {
            domClass.toggle(layerTree, 'hidden');
          }
          if (!domClass.contains(searchButton, "hidden")) {
            domClass.toggle(searchButton, 'hidden');
          }
          domClass.toggle(reportButton, 'hidden');
        },

        /**
         * notifies of the status of the mobile settings menu
         * @return {boolean}
         */
        mobileMenuIsOpen: function() {
            if (document.getElementById('mobileMenu')) {
              return domClass.contains('mobileMenu', 'open');
            } else {
              return false;
            }
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

        },

        /**
         * Toggle the upload form visible or not
         */
        toggleUploadForm: function() {
            brApp.debug('WidgetsController >>> toggleUploadForm');
            domClass.toggle('upload-form-content', 'hidden');
        },

        printMap: function(title, dpi, format, layoutType) {
          var isCommunityActive = true;
          var activeNationalData = '';
          var visibleCommunityLayers = [];
          for (var layer in MapConfig.layers) {
            if (MapConfig.layers[layer].type === 'dynamic') {
              var mapLayer = brApp.map.getLayer(layer);
              if (layer === 'percentLands' || layer === 'landTenure') {
                if (mapLayer.visible && mapLayer.visibleLayers[0] !== -1) {
                  activeNationalData = layer;
                }
              } else {
                if (mapLayer.visible && mapLayer.visibleLayers[0] !== -1) {
                  visibleCommunityLayers.push(layer);
                }
              }
            }
          }
          if ((brApp.activeLayer === 'community-lands' || brApp.activeLayer === undefined || brApp.activeLayer === 'none') && visibleCommunityLayers.length > 0 && activeNationalData === ''){
            this.printCommunityMap(title, dpi, format, layoutType);
          } else {
            var self = this;
            // set print dimensions;
            var map = brApp.map;
            var printTitle = title;
            var layoutTypeHeight = layoutType === 'Landscape' ? 530 : layoutType === 'Portrait' ? 750 : map.height;
            var layoutTypeWidth = layoutType === 'Landscape' ? 998 : layoutType === 'Portrait' ? 570 : map.height;
        		var printDimensions = {height: map.height, width: map.width},
        			printTask = new PrintTask(AppConfig.printUrl),
        			params = new PrintParameters(),
        			mapScale = map.getScale(),
              mapHeight = layoutType === 'MAP_ONLY' ? ((layoutTypeHeight) + (layoutTypeHeight/2.5)) : layoutTypeHeight,
        			mapWidth = layoutType === 'MAP_ONLY' ? ((layoutTypeWidth) + (layoutTypeWidth/2.5)): layoutTypeWidth,
        			printTemplate = new PrintTemplate();

            var dayStrings = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
              monthStrings = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'],
              date = new Date(),
              currentMonth = monthStrings[date.getMonth()],
              currentDay = dayStrings[date.getDay()],
              currentYear = date.getFullYear(),
              dateString = currentDay + ', ' + currentMonth + ' ' + date.getDate() + ', ' + currentYear;

        		params.map = map;

        		printTemplate.exportOptions = {
        		    width: mapWidth, //multiply width
        		    height: mapHeight, //multiply height
        		    dpi: dpi //multiply dpi
        		};
        		printTemplate.format = 'PNG32';
        		printTemplate.layout = layoutType === 'Portrait' ? 'landmark_custom_portrait' : layoutType === 'Landscape' ? 'landmark_custom_landscape' : 'MAP_ONLY';
        		printTemplate.preserveScale = true;

        		//set scale with multiplyer
        		printTemplate.outScale = mapScale;

        		params.template = printTemplate;

            domClass.add('modal-print-button', 'loading');

        		printTask.execute(params, function(response){
        			var printedMapImage = new Image(mapWidth, mapHeight);
              var logoImage = new Image(250, 100);
              var legendImage = new Image(200, 88);
              var commLegendImage = new Image(350, 117);
              // 549/128
              // 275/61
              //http://landmark.blueraster.io/map-app/css/images/LMtotal.jpg
              // legendImage.src = 'legendImage.src = './css/images/LMacknowledged.png';
              logoImage.src = 'http://landmark.blueraster.io/map-app/css/images/LandMark_final.png';
              commLegendImage.src = 'http://landmark.blueraster.io/map-app/css/images/legend-comm-landscape.jpg';

              // Check for active layer to determine what legend to use
              if (brApp.activeLayer === 'land-tenure' || activeNationalData === 'landTenure') {
                if (brApp.activeLandTenureKey === 'averageScoreTenure') {
                  legendImage.src = 'http://landmark.blueraster.io/map-app/css/images/LMlegalSec.jpg';
                } else {
                  legendImage = new Image(150, 127.5);
                  legendImage.src = 'http://landmark.blueraster.io/map-app/css/images/longLegend.jpg';
                }
              } else {
                switch (brApp.activeKey) {
                  case 'combinedTotal':
                    legendImage.src = 'http://landmark.blueraster.io/map-app/css/images/LMtotal.jpg';
                    break;
                  case 'combinedFormal':
                    legendImage.src = 'http://landmark.blueraster.io/map-app/css/images/LMacknowledged.jpg';
                    break;
                  case 'combinedInformal':
                    legendImage.src = 'http://landmark.blueraster.io/map-app/css/images/LMnotAcknowledged.jpg';
                    break;
                  case 'initialIndicator':
                    legendImage.src = 'http://landmark.blueraster.io/map-app/css/images/LMlegalSec.jpg';
                    break;
                  default:
                    legendImage.src = 'http://landmark.blueraster.io/map-app/css/images/LMacknowledged.jpg';
                }
              }

        			//onload needs to go before cors and src
        			printedMapImage.onload = function(){
                var visibleCommunityLayersLength = visibleCommunityLayers.length;
                self._addCanvasElements(mapHeight, mapWidth, printedMapImage, printTitle, logoImage, legendImage, format, layoutType, dateString, commLegendImage, visibleCommunityLayersLength);

        			};
        			//set crossOrigin to anonymous for cors
        			printedMapImage.setAttribute('crossOrigin', 'anonymous');
        			printedMapImage.src = response.url;
        		}, function(error){
              console.log(error)
              domClass.remove('modal-print-button', 'loading');
            });
          }
        },

        _addCanvasElements: function(mapHeight, mapWidth, printedMapImage, printTitle, logoImage, legendImage, format, layoutType, dateString, commLegendImage, visibleCommunityLayersLength){
      		//initiate fabric canvas
      		var mapCanvas = new fabric.Canvas('mapCanvas', {
      			height: (mapHeight) + (mapHeight/1.5),
      			width: (mapWidth) + (mapWidth/2.5),
      			background: '#fff'
      		});

          var footerMessage = 'Terms of use are available online at www.landmarkmap.org';

      		var heightAllowance = 40,
      			rectWidth = (mapWidth) + (mapWidth/2.5),
      			rectHeight = (mapHeight) + (mapHeight/1.5),
            logoLeft = layoutType === 'Landscape' ? 200 : 50,
            mapImageTop = layoutType === 'Portrait' ? 150 : (mapHeight/3),
            legendHeight = layoutType === 'Portrait' ? ((mapHeight) + (mapHeight/3)) - 75 : ((mapHeight) + (mapHeight/3)),
            footerTop = layoutType === 'Portrait' ? (legendHeight - 15) : legendHeight;

            //add white background
        		mapCanvas.add(new fabric.Rect({width: rectWidth, height: rectHeight, left: 0, top: 0, fill: 'white', angle: 0}));

          if (layoutType !== 'MAP_ONLY') {

        		//add text to top
        		mapCanvas.add(new fabric.Text(printTitle, {fontSize: (20), top: 100, left: (rectWidth/2), textAlign: 'center', originX: 'center', fontFamily: 'Raleway'}));
            mapCanvas.add(new fabric.Text(dateString, {fontSize: (12), top: 100, left: (rectWidth/1.25), textAlign: 'center', originX: 'center', fontFamily: 'Raleway'}));

            //add logo to top
            mapCanvas.add(new fabric.Image(logoImage, {top: 50, left: logoLeft}));

            //add legend image
            mapCanvas.add(new fabric.Image(legendImage, {top: legendHeight, left: (mapWidth/6)}));

            //add comm legend image
            if (visibleCommunityLayersLength > 0) {
              if (layoutType === 'Portrait') {
                mapCanvas.add(new fabric.Image(commLegendImage, {top: legendHeight, left: (mapWidth/1.5)}));
              } else {
                mapCanvas.add(new fabric.Image(commLegendImage, {top: legendHeight + 25, left: (mapWidth/1.25)}));
              }
            }

            // add footer message
            mapCanvas.add(new fabric.Text(footerMessage, {fontSize: (12), top: footerTop, left: (mapWidth/2), fontFamily: 'Raleway'}));

        		//add map image
        		mapCanvas.add(new fabric.Image(printedMapImage, {left: (mapWidth/5), top: mapImageTop}));
          } else {
            mapCanvas.add(new fabric.Image(printedMapImage, {left: (mapWidth/5), top: mapImageTop}));
          }

      		this._exportCanvasMap(printTitle, rectWidth, rectHeight, format, layoutType);


      	},

        _exportCanvasMap: function(printTitle, rectWidth, rectHeight, format, layoutType){
      		var canvas = document.getElementById('mapCanvas');
      		var canvasContext = canvas.getContext('2d');
      		canvasContext.scale(1, 1);

          if (format === 'pdf') {
            document.querySelector('.canvas-container').classList.add('hidden')
            var dataUrl = canvas.toDataURL();
            var pdfLayout = layoutType === 'Landscape' ? 'landscape' : layoutType === 'Portrait' ? 'portrait' : 'MAP_ONLY';
            var doc = new PDFDocument({layout: pdfLayout});
            var stream = doc.pipe(blobStream());
            var fitWidth, fitHeight, fitLeft, fitTop;

            if (layoutType === 'Landscape') {
              fitWidth = rectHeight;
              fitHeight = rectWidth;
              fitLeft = -40;
              fitTop = 0;
            } else if (layoutType === 'Portrait') {
              fitWidth = rectWidth/1.4;
              fitHeight = rectHeight/1.4;
              fitLeft = 20;
              fitTop = 0;
            } else if (layoutType === 'MAP_ONLY') {
              fitWidth = rectWidth/1.6;
              fitHeight = rectHeight/1.6;
              fitLeft = 0;
              fitTop = -150;
            }

            doc.image(canvas.toDataURL(), fitLeft, fitTop, {fit: [fitWidth, fitHeight]});
          	doc.end();

          	stream.on('finish', function() {
          		var fileRead = new FileReader();
          		fileRead.onload = function(e) {
          			window.open(e.currentTarget.result);
          		}
          		fileRead.readAsDataURL(stream.toBlob('application/pdf'));
          	});

          } else if (format === 'jpg') {
            document.querySelector('.canvas-container').classList.add('hidden')
            var pdfUrl = canvas.toDataURL('image/jpeg');
            window.open(pdfUrl);
          } else {
            canvas.toBlob(function(blob) {
              document.querySelector('.canvas-container').classList.add('hidden')
              var dataUrl = canvas.toDataURL();
              window.open(dataUrl);
            });
          }
          domClass.remove('modal-print-button', 'loading');
      	},

        printCommunityMap: function(title, dpi, format, layoutType) {
          brApp.debug('WidgetsController >>> printMap');
          var printTask = new PrintTask(AppConfig.printUrl);
          var printParameters = new PrintParameters();
          var template = new PrintTemplate();
          var question = '';
          var layout = '';

          if (layoutType === 'Portrait') {
            layout = 'landmark_comm_portrait';
            template.exportOptions = {
              dpi: dpi
            };
          } else if (layoutType === 'Landscape') {
            layout = 'landmark_comm_landscape';
            template.exportOptions = {
              dpi: dpi
            };
          } else {
            layout = 'MAP_ONLY'
          }

          template.format = format === 'png' ? 'PNG32' : format;
          template.layout = layout;
          // template.layout = layoutType;
          template.preserveScale = false;
          //- Custom Text Elements to be used in the layout,
          //- This is the way to add custom labels to the layout
          template.layoutOptions = {
            titleText: title,
            customTextElements: [
              {'question': question }
            ]
          };

          printParameters.map = brApp.map;
          printParameters.template = template;
          //- Add a loading class to the print button and remove it when loading is complete
          domClass.add('modal-print-button', 'loading');

          printTask.execute(printParameters, function (response) {
            domClass.remove('modal-print-button', 'loading');
            window.open(response.url);
          }, function (failure) {
            console.log(failure);
            domClass.remove('modal-print-button', 'loading');
          });

        },

        /**
         * Show the Analysis Dialog with the draw and upload buttons
         */
        showAnalysisDialog: function(customGraphics) {
            brApp.debug('WidgetsController >>> showAnalysisDialog');

            var layerTree = document.querySelector('.tree-widget-container')
            var searchButton = document.querySelector('.search-button')
            var reportButton = document.querySelector('.report-button')

            var body = win.body()
            var width = domGeom.position(body).w;

            if (width <= 768) {
              if (!domClass.contains(layerTree, "hidden")) {
                domClass.toggle(layerTree, 'hidden');
              }
              if (!domClass.contains(searchButton, "hidden")) {
                domClass.toggle(searchButton, 'hidden');
              }
              if (!domClass.contains(reportButton, "hidden")) {
                domClass.toggle(reportButton, 'hidden');
              }
            }

            if (customGraphics.graphics.length > 0) {
                domClass.remove('remove-graphics', 'hidden');
                domClass.add('draw-shape', 'display-three');
                domClass.add('upload-shapefile', 'display-three');

            } else {
                domClass.add('remove-graphics', 'hidden');
                domClass.remove('draw-shape', 'display-three');
                domClass.remove('upload-shapefile', 'display-three');
            }

            if (dom.byId('analysis-dialog').style.display !== 'none') {
              registry.byId('analysis-dialog').hide();
            } else {
              registry.byId('analysis-dialog').show();
            }
        },

        showHelp: function(click) {
            brApp.debug('WidgetsController >>> showHelp');
            click.stopPropagation();

            var id = click.target.id;
            var dialog;
            var left = click.pageX + "px";
            var top = click.pageY + "px";

            switch (id) {
                case "indigenous-lands-help":

                    dialog = registry.byId('help-dialog-indigenous');
                    dialog.show();
                    dom.byId('help-dialog-indigenous').style.top = top;
                    dom.byId('help-dialog-indigenous').style.left = left;

                    break;
                case "community-lands-help":
                    dialog = registry.byId('help-dialog-community');
                    dialog.show();
                    dom.byId('help-dialog-community').style.top = top;
                    dom.byId('help-dialog-community').style.left = left;

                    break;
                case "analysis-help":
                    var left = (click.pageX - 300) + "px";
                    dialog = registry.byId('help-dialog-completeness');
                    dialog.show();
                    dom.byId('help-dialog-completeness').style.top = top;
                    dom.byId('help-dialog-completeness').style.left = left;
                    break;
            }

        }

    };

    return Controller;

});
