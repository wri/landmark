define([
    'main/config',
    'esri/map',
    'dojo/on',
    'esri/geometry/Extent',
    'dojo/dom',
    'esri/layers/FeatureLayer'

], function(AppConfig, Map, on, Extent, dom, FeatureLayer) {
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

            var countries = new FeatureLayer('http://gis.wri.org/arcgis/rest/services/LandMark/Country_Snapshots/MapServer/0', {
              // defaultDefinitionExpression: "Country = '" + country + "'",
              visible: true,
              outFields: ['*']
            });
            this.map = map;

            on.once(countries, 'graphic-draw', function (evt) {
              console.log(evt.graphic.attributes);

              var attributes = [ {
                attr: 'ind_C_1',
                domId: 'legal-status-comm'
              }, {
                attr: 'ind_IP_1',
                domId: 'legal-status-indig'
              }, {
                attr: 'ind_C_2',
                domId: 'land-rights-comm'
              }, {
                attr: 'ind_IP_2',
                domId: 'land-rights-indig'
              }, {
                attr: 'ind_C_3',
                domId: 'formal-doc-comm'
              }, {
                attr: 'ind_IP_3',
                domId: 'formal-doc-indig'
              }, {
                attr: 'ind_C_4',
                domId: 'legal-person-comm'
              }, {
                attr: 'ind_IP_4',
                domId: 'legal-person-indig'
              }, {
                attr: 'ind_C_5',
                domId: 'legal-authority-comm'
              }, {
                attr: 'ind_IP_5',
                domId: 'legal-authority-indig'
              }, {
                attr: 'ind_C_6',
                domId: 'right-consent-comm'
              }, {
                attr: 'ind_IP_6',
                domId: 'right-consent-indig'
              }, {
                attr: 'ind_C_7',
                domId: 'right-trees-comm'
              }, {
                attr: 'ind_IP_7',
                domId: 'right-trees-indig'
              }, {
                attr: 'ind_C_8',
                domId: 'right-water-comm'
              }, {
                attr: 'ind_IP_8',
                domId: 'right-water-indig'
              }, {
                attr: 'ind_C_9',
                domId: 'land-rights-protected-comm'
              }, {
                attr: 'ind_IP_9',
                domId: 'land-rights-protected-indig'
              }];

              attributes.forEach(function(attribute){
                switch (evt.graphic.attributes[attribute.attr]) {
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


              var countryLand = evt.graphic.attributes.Ctry_Land ? evt.graphic.attributes.Ctry_Land : 0;
              dom.byId('country-name').innerHTML = evt.graphic.attributes.Country;
              dom.byId('country-land-area').innerHTML = 'COUNTRY LAND AREA:'
              dom.byId('country-hectares').innerHTML = Math.round(countryLand) + ' Hectares';
              dom.byId('average-score-comm').innerHTML = evt.graphic.attributes.ind_C_A;
              dom.byId('average-score-indig').innerHTML = evt.graphic.attributes.ind_IP_A;
              // dom.byId('legal-status-comm').innerHTML = evt.graphic.attributes.ind_C_1;
              // dom.byId('legal-status-indig').innerHTML = evt.graphic.attributes.ind_IP_1;
              // dom.byId('land-rights-comm').innerHTML = evt.graphic.attributes.ind_C_2;
              // dom.byId('land-rights-indig').innerHTML = evt.graphic.attributes.ind_IP_2;
              // dom.byId('formal-doc-comm').innerHTML = evt.graphic.attributes.ind_C_3;
              // dom.byId('formal-doc-indig').innerHTML = evt.graphic.attributes.ind_IP_3;
              // dom.byId('legal-person-comm').innerHTML = evt.graphic.attributes.ind_C_4;
              // dom.byId('legal-person-indig').innerHTML = evt.graphic.attributes.ind_IP_4;
              // dom.byId('legal-authority-comm').innerHTML = evt.graphic.attributes.ind_C_5;
              // dom.byId('legal-authority-indig').innerHTML = evt.graphic.attributes.ind_IP_5;
              // dom.byId('right-consent-comm').innerHTML = evt.graphic.attributes.ind_C_6;
              // dom.byId('right-consent-indig').innerHTML = evt.graphic.attributes.ind_IP_6;
              // dom.byId('right-trees-comm').innerHTML = evt.graphic.attributes.ind_C_7;
              // dom.byId('right-trees-indig').innerHTML = evt.graphic.attributes.ind_IP_7;
              // dom.byId('right-water-comm').innerHTML = evt.graphic.attributes.ind_C_8;
              // dom.byId('right-water-indig').innerHTML = evt.graphic.attributes.ind_IP_8;
              // dom.byId('land-rights-protected-comm').innerHTML = evt.graphic.attributes.ind_C_9;
              // dom.byId('land-rights-protected-indig').innerHTML = evt.graphic.attributes.ind_IP_9;

              dom.byId('pct-ack-gov').innerHTML = evt.graphic.attributes.Pct_F;
              dom.byId('pct-no-ack-gov').innerHTML = evt.graphic.attributes.Pct_NF;
              dom.byId('pct-total-ack').innerHTML = evt.graphic.attributes.Pct_tot;
              dom.byId('comm-ack-gov').innerHTML = evt.graphic.attributes.Map_C_F;
              dom.byId('comm-no-ack-gov').innerHTML = evt.graphic.attributes.Map_C_NF;
              dom.byId('comm-total-ack').innerHTML = evt.graphic.attributes.Map_C_T;
              dom.byId('indig-ack-gov').innerHTML = evt.graphic.attributes.Map_IP_F;
              dom.byId('indig-no-ack-gov').innerHTML = evt.graphic.attributes.Map_IP_NF;
              dom.byId('indig-total-ack').innerHTML = evt.graphic.attributes.Map_IP_T;

              self.map.setExtent(evt.graphic.geometry.getExtent());
              self.map.disablePan();
              self.map.disableDoubleClickZoom();
              self.map.disableScrollWheelZoom();
              self.map.disableKeyboardNavigation();
              self.map.disableMapNavigation();

            });
            countries.setDefinitionExpression("Country = '" + country + "'")
            // console.log("Country = '" + country + "'");
            // countries.setDefinitionExpression("Country = 'Canada'");

            map.addLayer(countries);

            console.log(countries);
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
