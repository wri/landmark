define([
    'map/ReportConfig',
    'esri/map',
    'dojo/on',
    'esri/geometry/Extent',
    'dojo/dom',
    'esri/layers/ImageParameters',
    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/tasks/query',
    'esri/tasks/QueryTask',

], function(ReportConfig, Map, on, Extent, dom, ImageParameters, ArcGISDynamicMapServiceLayer, Query, QueryTask) {
    'use strict';

    var ReportController = {

        init: function(country) {
            esri.config.defaults.io.corsEnabledServers.push("http://gis.wri.org");
            var self = this;
            var bounds = new Extent({
              "xmin":-16045622,
              "ymin":-811556,
              "xmax":7297718,
              "ymax":11142818,
              "spatialReference":{"wkid":102100}
            });

            var map = new Map('reportMap', {
              // basemap: 'none',
              extent: bounds,
              zoom: 4,
              isDoubleClickZoom: false,
              isRubberBandZoom: false,
              isScrollWheelZoom: false,
              isShiftDoubleClickZoom: false,
              isZoomSlider: false,
              isPan: false,
              slider: false

            });

            var countries = new ArcGISDynamicMapServiceLayer(ReportConfig.countrySnapUrl, {
              visible: true,
              outFields: ['*']
            });

            var layerDefinitions = [];
            layerDefinitions[0] = "Country = '" + country + "'";
            countries.setLayerDefinitions(layerDefinitions);
            this.map = map;
            this.country = country;
            var self = this;

            map.on('click', function (evt) {
              window.open('map.html#country=' + self.country);
            });

            var countryQT = new QueryTask(ReportConfig.countrySnapUrl + '/' + ReportConfig.countrySnapIndex)
            var countryQuery = new Query();
            countryQuery.where = "Country = '" + country + "'";
            countryQuery.returnGeometry = true;
            countryQuery.outFields = ['*'];

            countryQT.execute(countryQuery, function (result) {
              if (result.features && result.features[0]) {
                self.map.setExtent(result.features[0].geometry.getExtent());
                console.log(result.features[0]);

                ReportConfig.reportAttributes.forEach(function(attribute){
                  switch (result.features[0].attributes[attribute.attr]) {
                    case '1':
                      dom.byId(attribute.domId).innerHTML = '<div class="low">1</div>'
                      break;
                    case '2':
                      dom.byId(attribute.domId).innerHTML = '<div class="medium">2</div>'
                      break;
                    case '3':
                      dom.byId(attribute.domId).innerHTML = '<div class="high">3</div>'
                      break;
                    case '4':
                      dom.byId(attribute.domId).innerHTML = '<div class="highest">4</div>'
                      break;
                    case 'N/A':
                      dom.byId(attribute.domId).innerHTML = '<div class="unavailable">No Data</div>'
                      break;
                    case '':
                      dom.byId(attribute.domId).innerHTML = '<div class="unavailable">No Data</div>'
                      break;
                    case null:
                      dom.byId(attribute.domId).innerHTML = '<div class="unavailable">No Data</div>'
                      break;
                    default:

                  }
                });

                var countryLand = result.features[0].attributes.Ctry_Land ? result.features[0].attributes.Ctry_Land : 0;

                dom.byId('land-count').innerHTML = 'Number of Indigenous and Community Lands Mapped: ' + result.features[0].attributes.NB_Maps;
                dom.byId('country-name').innerHTML = result.features[0].attributes.Country;
                dom.byId('country-land-area').innerHTML = 'COUNTRY LAND AREA:'
                dom.byId('country-hectares').innerHTML = Math.round(countryLand) + ' Hectares';
                dom.byId('average-score-comm').innerHTML = result.features[0].attributes.ind_C_A;
                dom.byId('average-score-indig').innerHTML = result.features[0].attributes.ind_IP_A;
                dom.byId('pct-ack-gov').innerHTML = result.features[0].attributes.Pct_F;
                dom.byId('pct-no-ack-gov').innerHTML = result.features[0].attributes.Pct_NF;
                dom.byId('pct-total-ack').innerHTML = result.features[0].attributes.Pct_tot;
                dom.byId('comm-ack-gov').innerHTML = result.features[0].attributes.Map_C_F;
                dom.byId('comm-no-ack-gov').innerHTML = result.features[0].attributes.Map_C_NF;
                dom.byId('comm-total-ack').innerHTML = result.features[0].attributes.Map_C_T;
                dom.byId('indig-ack-gov').innerHTML = result.features[0].attributes.Map_IP_F;
                dom.byId('indig-no-ack-gov').innerHTML = result.features[0].attributes.Map_IP_NF;
                dom.byId('indig-total-ack').innerHTML = result.features[0].attributes.Map_IP_T;

                self.map.setExtent(result.features[0].geometry.getExtent());
                self.map.disablePan();
                self.map.disableDoubleClickZoom();
                self.map.disableScrollWheelZoom();
                self.map.disableKeyboardNavigation();
                self.map.disableMapNavigation();
              }
            });

            map.addLayer(countries);
            this.addLayers(country);
        },

        addLayers: function (country) {
          var self = this;

          ReportConfig.mapLayers.forEach(function(layerConfig) {
            var params = new ImageParameters();
            params.layerOption = ImageParameters.LAYER_OPTION_SHOW;
            params.layerIds = layerConfig.layerIds;
            params.format = 'png32';

            var layer = new ArcGISDynamicMapServiceLayer(layerConfig.url, {
                visible: true,
                imageParameters: params
            });

            var layerDefinitions = [];
            layerDefinitions[layerConfig.layerIds[0]] = "Country = '" + country + "'";
            if (layerConfig.layerIds.length > 1) {
              layerDefinitions[layerConfig.layerIds[1]] = "Country = '" + country + "'";
            }
            layer.setLayerDefinitions(layerDefinitions);

            self.map.addLayer(layer);

          });
          // var params = new ImageParameters();
          //
          // params.layerOption = ImageParameters.LAYER_OPTION_SHOW;
          // params.layerIds = [1];
          // params.format = 'png32';
          //
          // var layer = new ArcGISDynamicMapServiceLayer(, {
          //     visible: true,
          //     imageParameters: params
          // });
          //
          // var layer = new ArcGISDynamicMapServiceLayer(, {
          //     visible: true,
          //     imageParameters: params
          // });
          //
          // var layerDefinitions = [];
          // layerDefinitions[1] = "Country = '" + country + "'";
          // layer.setLayerDefinitions(layerDefinitions);
          //
          // this.map.addLayer(layer);
        },

        exportAnalysisResult: function(text) {

            var blob = new Blob([text], {
                type: "text/csv;charset=utf-8;"
            });

            saveAs(blob, "LandMarkAnalysisResults.csv");

        },

        numberWithCommas: function(x) {
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            //return parts.join(".");
            return parts[0];
        },

        printAnalysis: function(config) {
            window.print();

        },


    };

    return ReportController;

});
