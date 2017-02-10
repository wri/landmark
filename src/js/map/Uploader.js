define([
    "main/config",
    "map/MapAssets",
    "utils/GeoHelper",
    "dojo/sniff",
    "esri/graphic",
    "esri/request",
    "dijit/registry",
    "dojo/_base/array",
    "dojo/store/Memory",
    "dojo/dom-construct",
    "dijit/form/ComboBox",
    "dojox/data/CsvStore",
    "esri/geometry/Polygon",
    "esri/geometry/Point",
    "esri/geometry/scaleUtils",
    "esri/graphicsUtils"
], function(AppConfig, MapAssets, GeoHelper, sniff, Graphic, esriRequest, registry, arrayUtils, Memory, domConstruct, ComboBox, CsvStore, Polygon, Point, scaleUtils, graphicsUtils) {
    'use strict';

    var Uploader = {
        /**
         * @param {object} evt - Form Event from the change of the input in the form
         */
        beginUpload: function(evt) {
            var target = evt.target ? evt.target : evt.srcElement;
            // If form is reset or has no value, exit
            if (target.value === "") {
                return;
            }

            var filename = target.value.toLowerCase(),
                self = this,
                content,
                params,
                extent;

            // Filename is fullpath in IE, extract tha actual filename
            if (sniff("ie")) {
                var temp = filename.split('\\');
                filename = temp[temp.length - 1];
            }

            if (filename.indexOf('.csv') > -1) {
                this.uploadCSV(evt);
                return;
            } else if (filename.indexOf('.zip') < 0) {
                alert('Currently only shapefiles with a ".zip" extension and .csv files are supported.');
                return;
            }

            // Split the file based on .
            filename = filename.split('.');

            // Chrome and IE add c:\fakepath to the value - we need to remove it
            // See this link for more info: http://davidwalsh.name/fakepath
            filename = filename[0].replace("c:\\fakepath\\", "");

            params = {
                'name': filename,
                'generalize': true,
                'targetSR': brApp.map.spatialReference,
                'maxRecordCount': 1000,
                'reducePrecision': true,
                'numberOfDigitsAfterDecimal': 0,
                'enforceInputFileSizeLimit': true,
                'enforceOutputJsonSizeLimit': true
            };

            // Generalize Features
            // based on https://developers.arcgis.com/javascript/jssamples/portal_addshapefile.html
            extent = scaleUtils.getExtentForScale(brApp.map, 40000);
            params.maxAllowableOffset = extent.getWidth() / brApp.map.width;

            content = {
                'publishParameters': JSON.stringify(params),
                'callback.html': 'textarea',
                'filetype': 'shapefile',
                'f': 'json'
            };

            esriRequest({
                url: AppConfig.portalGenerateFeaturesURL,
                content: content,
                form: document.getElementById('uploadForm'),
                handleAs: 'json',
                error: this.uploadError,
                load: this.uploadSuccess.bind(this)
            });

        },

        /**
         * Generate features from a csv
         * @param {object} evt - Form Event from the change of the input in the form
         */
         uploadCSV: function(evt) {
             var file = evt.target.files[0],
                 reader = new FileReader(),
                 attributeStore = [],
                 self = this,
                 fileLoaded,
                 attributes,
                 store;

             fileLoaded = function() {
                 // Create a CSV Store and fetch all items from it afterwards
                 store = new CsvStore({
                     data: reader.result,
                     separator: ','
                 });

                 store.fetch({
                     onComplete: function(items) {

                         if (items.length < 1) {
                             throw new Error('No items found in CSV file.');
                         }

                         attributes = store.getAttributes(items[0]);

                         attributes.forEach(function(attr) {
                             attributeStore.push({
                                 name: attr,
                                 id: attr
                             });
                         });

                         self.formatCSVDataForStore(store, items);

                     },
                     onError: self.uploadError
                 });

             };

             // Read the CSV File
             reader.onload = fileLoaded;
             reader.readAsText(file);
         },

         /**
         * Prepare a csv data store to be pushed to the WizardStore, output format will be esri.Graphic
         * @param {object} store - dojo's CSV Store
         * @param {array} items - Array of items resulting from a fetch on the csv store
         */
        formatCSVDataForStore: function(store, items) {
            var counter = 0,
                newFeatures = [],
                nameField = 'Name',
                attributes,
                feature,
                attrs,
                value,
                lat,
                lon;

            // Parse the Attribtues
            items.forEach(function(item, index) {
                attributes = {};
                attrs = store.getAttributes(item);
                attrs.forEach(function(attr) {
                    value = store.getValue(item, attr);
                    attributes[attr] = isNaN(value) ? value : parseFloat(value);
                });

                attributes['Label'] = 'ID - ' + (counter + index) + ': ' + attributes[nameField];
                attributes.WRI_ID = (counter + index);
                attributes.isRSPO = false;

                // Try to get the Lat and Long from Latitude and Longitude but not case sensitive
                lat = attributes.Latitude ? attributes.Latitude : attributes.latitude;
                lon = attributes.Longitude ? attributes.Longitude : attributes.longitude;

                feature = GeoHelper.generatePointGraphicFromGeometric(lon, lat, attributes);
                newFeatures.push(feature);
            });

            var featureSet = {
              features: newFeatures
            }

            this.resetForm();
            this.addToMap(featureSet);

        },

        /**
         * Error handler for the request to generate features
         * @param {object} err - Error object
         */
        uploadError: function(err) {
            alert(['Error:', err.message].join(' '));
        },

        /**
         * Success handler for the request to generate features
         * @param {object} res - Response of the request
         */
        uploadSuccess: function(res) {
            this.resetForm();
            this.addToMap(res.featureCollection.layers[0].featureSet);
        },

        /**
         * Reset the form to allow for more uploads, hide the dialog
         */
        resetForm: function() {
            registry.byId('analysis-dialog').hide();
            document.uploadForm.reset();
            var upForm = document.getElementById('uploadForm');
            upForm.reset();
        },

        /**
         * Add the features returned from the generate features request to the map
         * @param {string} nameField - Name field the user chose from the drop down, will be used for popups
         * @param {object} featureSet - esri feature set that contains a features array
         */
        addToMap: function(featureSet) {
            var symbol = MapAssets.getDrawUploadSymbol(),
                graphicsLayer = brApp.map.getLayer('CustomFeatures'),
                graphic,
                graphics = [],
                polygon,
                point,
                extent;

            arrayUtils.forEach(featureSet.features, function(feature) {
              // Add Custom Attributes if needed or some unique Id, which can help
              // in deleting features from popups
              var attributeID = graphicsLayer.graphics.length + 1;
              feature.attributes.attributeID = attributeID;

              if (feature.geometry.rings) {
                // Mixin attributes here if necessary
                polygon = new Polygon(feature.geometry);
                graphic = new Graphic(polygon, symbol, feature.attributes);
                extent = extent ? extent.union(polygon.getExtent()) : polygon.getExtent();
                graphicsLayer.add(graphic);
              } else if (feature.geometry.x) {
                point = new Point(feature.geometry.x, feature.geometry.y, brApp.map.spatialReference);
                graphic = new Graphic(point, MapAssets.getDrawUploadSymbolPoint(), feature.attributes);
                graphics.push(graphic);
                graphicsLayer.add(graphic);
              }
            });

            if (!extent) {
              extent = graphicsUtils.graphicsExtent(graphics);
            }

            brApp.map.setExtent(extent, true);

        }

    };

    return Uploader;

});
