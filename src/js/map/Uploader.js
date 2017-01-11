define([
    "main/config",
    "map/MapAssets",
    "dojo/sniff",
    "esri/graphic",
    "esri/request",
    "dijit/registry",
    "dojo/_base/array",
    "dojo/store/Memory",
    "dojo/dom-construct",
    "dijit/form/ComboBox",
    "esri/geometry/Polygon",
    "esri/geometry/Point",
    "esri/geometry/scaleUtils",
    "esri/graphicsUtils"
], function(AppConfig, MapAssets, sniff, Graphic, esriRequest, registry, arrayUtils, Memory, domConstruct, ComboBox, Polygon, Point, scaleUtils, graphicsUtils) {
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

            if (filename.indexOf('.zip') < 0) {
                alert('Currently only shapefiles with a ".zip" extension are supported.');
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
            var container = document.getElementById('uploadNameSelectContainer'),
                featureCollection = res.featureCollection,
                featureStore = [],
                self = this,
                dataStore;

            // Create a store of data for Dropdown
            arrayUtils.forEach(featureCollection.layers[0].layerDefinition.fields, function(field) {
                featureStore.push({
                    name: field.name,
                    id: field.alias
                });
            });

            function resetForm() {
                if (registry.byId('uploadComboNameWidget')) {
                    registry.byId('uploadComboNameWidget').destroy();
                }
                if (document.getElementById('dropdownContainerName')) {
                    domConstruct.destroy('dropdownContainerName');
                }
                document.uploadForm.reset();
            }

            domConstruct.create("div", {
                'id': "dropdownContainerName",
                'innerHTML': "<div id='uploadComboNameWidget'></div>"
            }, container, "first");

            dataStore = new Memory({
                data: featureStore
            });

            new ComboBox({
                id: "uploadComboNameWidget",
                value: "-- Choose name field --",
                store: dataStore,
                searchAttr: "name",
                onChange: function(name) {
                    if (name) {
                        self.addToMap(name, featureCollection.layers[0].featureSet);
                        registry.byId('analysis-dialog').hide();
                        resetForm();
                    }
                }
            }, "uploadComboNameWidget");

        },

        /**
         * Add the features returned from the generate features request to the map
         * @param {string} nameField - Name field the user chose from the drop down, will be used for popups
         * @param {object} featureSet - esri feature set that contains a features array
         */
        addToMap: function(nameField, featureSet) {
            var symbol = MapAssets.getDrawUploadSymbol(),
                graphicsLayer = brApp.map.getLayer('CustomFeatures'),
                graphic,
                graphics = [],
                polygon,
                point,
                extent;

            arrayUtils.forEach(featureSet.features, function(feature) {
              if (feature.geometry.rings) {
                // Mixin attributes here if necessary
                polygon = new Polygon(feature.geometry);

                // Add Custom Attributes if needed or some unique Id, which can help
                // in deleting features from popups
                var attributeID = graphicsLayer.graphics.length + 1;
                feature.attributes.attributeID = attributeID;

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
