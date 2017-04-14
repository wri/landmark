define([
    'map/ReportConfig',
    'map/WidgetsController',
    'esri/map',
    'dojo/on',
    'dojo/dom',
    'dojo/dom-class',
    'esri/geometry/Extent',
    'esri/layers/ImageParameters',
    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/tasks/query',
    'esri/tasks/QueryTask',

], function(ReportConfig, WidgetsController, Map, on, dom, domClass, Extent, ImageParameters, ArcGISDynamicMapServiceLayer, Query, QueryTask) {

    var ReportController = {

        init: function(country) {
            esri.config.defaults.io.corsEnabledServers.push("http://gis.wri.org");

            var self = this;

            on(document.getElementById('share-button'), 'click', self.toggleShareContainer);
            on(document.getElementById('embedShare'), 'click', WidgetsController.showEmbedCode);
            on(document.getElementById('csvShare'), 'click', self.downloadCSV.bind(this));

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
              slider: false,
              logo:false

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
              window.open('/map/#country=' + self.country);
            });

            var countryQT = new QueryTask(ReportConfig.countrySnapUrl + '/' + ReportConfig.countrySnapIndex)
            var countryQuery = new Query();
            // if (country === 'United Kingdom - England' || country === 'United Kingdom - Northern Ireland' || country === 'United Kingdom - Scotland' || country === 'United Kingdom - Wales') {
            //   country = 'United Kingdom';
            // }
            // // if (country === 'United Kingdom') {
            //     countryQuery.where = "Country = 'United Kingdom - England' OR Country = 'United Kingdom - Northern Ireland' OR Country = 'United Kingdom - Scotland' OR Country = 'United Kingdom - Wales'";
            // }
            countryQuery.where = "Country = '" + country + "'";

            countryQuery.returnGeometry = true;
            countryQuery.outFields = ['*'];

            countryQT.execute(countryQuery, function (result) {
              if (result.features && result.features[0]) {
                self.countryData = result.features[0].attributes;
                self.map.setExtent(result.features[0].geometry.getExtent());

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
                      dom.byId(attribute.domId).innerHTML = '<div class="unavailable">No Data</div>'
                  }
                });

                var countryLand = result.features[0].attributes.CtryLand ? result.features[0].attributes.CtryLand : 0;
                var NB_Maps = result.features[0].attributes.NB_Maps ? result.features[0].attributes.NB_Maps : 0;
                var ha_IPC = result.features[0].attributes.ha_IPC ? Math.round(result.features[0].attributes.ha_IPC) : 0;
                // var iso2Value = ReportConfig.countryCodeExceptions.includes(result.features[0].attributes.ISO_ALPHA) ?
                // var iso2Value;
                var countryCodeExceptions = ReportConfig.countryCodeExceptions
                for (var i = 0; i < countryCodeExceptions.length; i++) {
                  if (result.features[0].attributes.ISO_Code === countryCodeExceptions[i].ISO) {
                    dom.byId('flag-icon').className += ' flag-icon-'+countryCodeExceptions[i].ISO2.toLowerCase();
                  } else {
                    if (result.features[0].attributes.ISO_ALPHA2) {
                      dom.byId('flag-icon').className += ' flag-icon-'+result.features[0].attributes.ISO_ALPHA2.toLowerCase();
                    }
                  }
                }

                if (ha_IPC > 0) {
                  dom.byId('land-count').innerHTML =  '<strong>' + NB_Maps.toLocaleString() + '</strong> indigenous and community lands mapped on Landmark, representing <strong>' + ha_IPC.toLocaleString() + '</strong> ha.';
                } else {
                  dom.byId('land-count').innerHTML =  '<strong>' + NB_Maps.toLocaleString() + '</strong> indigenous and community lands mapped on Landmark.';
                }
                dom.byId('country-name').innerHTML = result.features[0].attributes.Country;
                dom.byId('country-land-area').innerHTML = 'COUNTRY LAND AREA:';
                var landCount = Math.round(countryLand);

                dom.byId('country-hectares').innerHTML = '<strong>' + Math.round(countryLand).toLocaleString() + ' Hectares</strong>';
                dom.byId('average-score-comm').innerHTML = result.features[0].attributes.ind_C_A;
                dom.byId('average-score-indig').innerHTML = result.features[0].attributes.ind_IP_A;

                self.map.setExtent(result.features[0].geometry.getExtent());
                self.map.disablePan();
                self.map.disableDoubleClickZoom();
                self.map.disableScrollWheelZoom();
                self.map.disableKeyboardNavigation();
                self.map.disableMapNavigation();

                self.addCharts(result.features[0]);

              }
            });

            map.addLayer(countries);
            this.addLayers(country);
        },

        toggleShareContainer: function() {
            var container = document.querySelector('.share-container');

            if (container) {
                domClass.toggle(container, 'hidden');
            }

        },

        downloadCSV: function() {
          var self = this, fields = ReportConfig.fieldAliases, values = [], csv;

          Object.keys(this.countryData).forEach(function(key) {
            if (key !== 'OBJECTID' && key !== 'Shape_Area' && key !== 'Shape_Length') {
              values.push(self.countryData[key]);
              var valuesLength = values.length;
            }
          });

          csv = fields.join(",") + '\n';
          csv += values.join(",") + '\n';

          var blob = new Blob([csv], {
              type: "text/csv;charset=utf-8;"
          });

          saveAs(blob, "LandMarkCountryResults.csv");
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

        addCharts: function(data) {
          var fixedTotal = data.attributes.Pct_tot;
          console.log(data.attributes);
          fixedTotal = parseFloat(fixedTotal);
          if (fixedTotal) {
            fixedTotal = fixedTotal.toFixed(2);
          } else {
            fixedTotal = data.attributes.Pct_F + data.attributes.Pct_NF;
          }

          var angle = (fixedTotal / 100) * 180;

          if (angle === 0) {
            angle = 180
          }

          if (typeof data.attributes.Pct_F === 'string') {
            if (data.attributes.Pct_F === 'None' || data.attributes.Pct_F === 'none') {
              data.attributes.Pct_F = 0;
            } else {
              data.attributes.Pct_F = parseFloat(data.attributes.Pct_F);
            }
          }

          if (typeof data.attributes.Pct_NF === 'string') {
            if (data.attributes.Pct_NF === 'None' || data.attributes.Pct_NF === 'none') {
              data.attributes.Pct_NF = 0;
            } else {
              data.attributes.Pct_NF = parseFloat(data.attributes.Pct_NF);
            }
          }

          var estimatedChart = Highcharts.chart('estimated-chart', {
            chart: {
              plotBackgroundColor: null,
              backgroundColor: '#F0F0F0',
              plotBorderWidth: 0,
              plotShadow: false,
              margin: [0, 0, 0, 0],
              spacingTop: 0,
              spacingBottom: 0,
              spacingLeft: 0,
              spacingRight: 0
            },
            colors: ['gray','#962A74', '#CF3684'],
            // title: {
            //   useHTML: true,
            //   shape: 'circle',
            //   style: { "height": "auto", "color": "white", "background-color": "#152f3e", "padding": "5%", "border-radius": "50%", "fontSize": "14px", "width": "50%" },
            //   text: '<p class="chart-center chart-percent"> ' + fixedTotal + '%</p><p class="chart-center">Total</p> ',
            //   align: 'center',
            //   verticalAlign: 'middle',
            //   y: -48
            // },
            title: {
              text: null
            },
            credits: {
              enabled: false
            },
            tooltip: {
              // pointFormat: '<b>{point.y:.1f}%</b>',
              backgroundColor: 'rgba(255,255,255,1)',
              formatter: function() {
                if (this.point.name === 'No <br> Data') {
                  return false;
                } else {
                  return this.point.name + '<br><b>' + this.point.percentage.toFixed(1) + '%</b>';
                }
              },
              positioner: function (labelWidth, labelHeight, point) {
                var tooltipX, tooltipY;
                if (point.plotY < 60) {
                  tooltipX = point.plotX - 75;
                  tooltipY = point.plotY - 30;
                } else if (point.plotY < 120) {
                  tooltipX = point.plotX - 75;
                  tooltipY = point.plotY - 50;
                } else {
                  tooltipX = point.plotX - 75;
                  tooltipY = point.plotY - 25;
                }

                if (point.plotX > 270) {
                  tooltipX = point.plotX + 20;
                }

                return {
                  x: tooltipX,
                  y: tooltipY
                };
              }
            },
            plotOptions: {
              pie: {
                dataLabels: {
                  enabled: false
                  // ,
                  // distance: 10,
                  // style: {
                  //   fontWeight: 'bold',
                  //   color: 'white'
                  // }
                },
                size:'75%'
                // ,
                // startAngle: -(angle),
                // endAngle: angle
              }
            },
            series: [{
              type: 'pie',
              // name: 'Browser share',
              innerSize: '60%',
              data: [
                // {
                //   name: 'Acknowledged by Gov',
                //   y: data.attributes.Pct_F > 0 ? data.attributes.Pct_F : null,
                //   dataLabels: {
                //     enabled: false
                //   },
                //   tooltip: {
                //     enabled: false
                //   }
                // },
                ['No <br> Data', 100 - data.attributes.Pct_F - data.attributes.Pct_NF > 0 ? 100 - data.attributes.Pct_F - data.attributes.Pct_NF : null],
                ['Acknowledged <br>by gov',   data.attributes.Pct_F > 0 ? data.attributes.Pct_F : null],
                ['Not <br>acknowledged',       data.attributes.Pct_NF > 0 ? data.attributes.Pct_NF : null],
                {
                  name: 'Proprietary or Undetectable',
                  y: 0.2,
                  dataLabels: {
                    enabled: false
                  }
                }
              ]
            }]
          },
          function(chart1) { // on complete
          var xpos = '50%';
          var ypos = '50%';
          var circleradius = 75;
          var firstPercent = parseFloat(chart1.series[0].data[1].percentage);
          var secondPercent = parseFloat(chart1.series[0].data[2].percentage);
          var centerText = firstPercent + secondPercent === 0 ? 'No Data' : (firstPercent + secondPercent).toFixed(1) + '%' + '<br> Total';

          // Render the text
          var chart1Text = chart1.renderer.text(centerText).css({
              width: circleradius * 2,
              color: '#1c1c1c',
              fontSize: '16px'
          }).attr({
              // why doesn't zIndex get the text in front of the chart?
              zIndex: 999
          }).add();

          var textBBox = chart1Text.getBBox();
          var x = chart1.plotLeft + (chart1.plotWidth  * 0.5) - (textBBox.width  * 0.45);
          var y = chart1.plotTop  + (chart1.plotHeight * 0.5) - (textBBox.height * 0.2);
          chart1Text.attr({x: x, y: y});
      });

      if (!data.attributes.Map_C_F && !data.attributes.Map_C_NF && !data.attributes.Map_IP_F && !data.attributes.Map_IP_NF) {
        var commLandsChart = Highcharts.chart('indigenous-lands-chart', {
          chart: {
            plotBackgroundColor: null,
            backgroundColor: '#F0F0F0',
            plotBorderWidth: 0,
            plotShadow: false,
            margin: [0, 0, 0, 0],
            spacingTop: 0,
            spacingBottom: 0,
            spacingLeft: 0,
            spacingRight: 0
          },
          colors: ['gray'],
          title: {
            text: null
            // text: 'Community Lands',
            // style: {
            //   color: '#ccc',
            //   fontSize: '14px'
            // }
          },
          credits: {
            enabled: false
          },
          tooltip: { enabled: false },
          plotOptions: {
            pie: {
              dataLabels: {
                enabled: false,
                // distance: 20,
                // style: {
                //   fontWeight: 'bold',
                //   color: 'white'
                // }
              },
              size:'75%'
            }
          },
          series: [{
            type: 'pie',
            innerSize: '60%',
            data: [
              ['No Data', 100 - data.attributes.Map_C_F - data.attributes.Map_C_NF > 0 ? 100 - data.attributes.Map_C_F - data.attributes.Map_C_NF : null]
            ]
          }]
        },
        function(chart1) { // on complete
          var xpos = '50%';
          var ypos = '50%';
          var circleradius = 75;
          var centerText = 'No Data';

          // Render the text
          var chart1Text = chart1.renderer.text(centerText).css({
            width: circleradius * 2,
            color: '#1c1c1c',
            fontSize: '16px'
          }).attr({
            // why doesn't zIndex get the text in front of the chart?
            zIndex: 999
          }).add();

          var textBBox = chart1Text.getBBox();
          var x = chart1.plotLeft + (chart1.plotWidth  * 0.5) - (textBBox.width  * 0.5);
          var y = chart1.plotTop  + (chart1.plotHeight * 0.55) - (textBBox.height * 0.5);
          chart1Text.attr({x: x, y: y});
        })
      } else {
            var indigenousLandsChart = Highcharts.chart('indigenous-lands-chart', {
              chart: {
                plotBackgroundColor: null,
                backgroundColor: '#F0F0F0',
                plotBorderWidth: 0,
                plotShadow: false,
                margin: [0, 0, 0, 0],
                spacingTop: 0,
                spacingBottom: 0,
                spacingLeft: 0,
                spacingRight: 0
              },
              title: {
                text: null
                // text: 'Community Lands & Indigenous Peoples',
                // style: {
                //   color: '#1c1c1c',
                //   fontSize: '14px'
                // }
              },
              credits: {
                enabled: false
              },
              tooltip: {
                // pointFormat: '<b>{point.y:.1f}%</b>',
                backgroundColor: 'rgba(255,255,255,1)',
                formatter: function() {
                  if (this.point.name === 'No Data') {
                    return false;
                  } else {
                    return this.point.name + '<br>' + '<b>' + this.point.percentage.toFixed(1) + '%</b>';
                  }
                },
                positioner: function (labelWidth, labelHeight, point) {
                  var tooltipX, tooltipY;
                  if (point.plotY < 60) {
                    tooltipX = point.plotX - 75;
                    tooltipY = point.plotY - 30;
                  } else if (point.plotY < 120) {
                    tooltipX = point.plotX - 75;
                    tooltipY = point.plotY - 50;
                  } else {
                    tooltipX = point.plotX - 75;
                    tooltipY = point.plotY - 25;
                  }

                  if (point.plotX > 270) {
                    tooltipX = point.plotX + 20;
                  }

                  return {
                    x: tooltipX,
                    y: tooltipY
                  };
                }
              },
              plotOptions: {
                pie: {
                  dataLabels: {
                    enabled: false
                  },
                  size:'40%',
                  center: ['50%', '50%']
                }
              },
              series: [
                // {
                //   colors: ['gray', '#D50010', '#00647A'],
                //   type: 'pie',
                //   size: '60%',
                //   data: [
                //     ['No Data', 100 - data.attributes.Map_IP_F - data.attributes.Map_IP_NF - data.attributes.Map_C_F - data.attributes.Map_C_NF > 0 ? 100 - data.attributes.Map_IP_F - data.attributes.Map_IP_NF - data.attributes.Map_C_F - data.attributes.Map_C_NF : null],
                //     ['<b>Indigenous</b> <br><b>Peoples</b>', data.attributes.Map_IP_F + data.attributes.Map_IP_NF > 0 ? data.attributes.Map_IP_F + data.attributes.Map_IP_NF : null],
                //     ['<b>Community</b>', data.attributes.Map_C_F + data.attributes.Map_C_NF > 0 ? data.attributes.Map_C_F + data.attributes.Map_C_NF : null]
                //   ]
                // },
                {
                colors: ['gray', '#FF6240', '#00768A', '#FF9900', '#00C1CC'],
                type: 'pie',
                size: '65%',
                innerSize: '60%',
                data: [
                  ['No Data', 100 - data.attributes.Map_IP_F - data.attributes.Map_IP_NF - data.attributes.Map_C_F - data.attributes.Map_C_NF > 0 ? 100 - data.attributes.Map_IP_F - data.attributes.Map_IP_NF - data.attributes.Map_C_F - data.attributes.Map_C_NF : null],
                  ['Indigenous <br>Acknowledged <br>by gov', data.attributes.Map_IP_F > 0 ? data.attributes.Map_IP_F : null],
                  ['Community <br>Acknowledged <br>by gov', data.attributes.Map_C_F > 0 ? data.attributes.Map_C_F : null],
                  ['Indigenous <br>Not <br>acknowledged', data.attributes.Map_IP_NF > 0 ? data.attributes.Map_IP_NF : null],
                  ['Community <br>Not <br>acknowledged', data.attributes.Map_C_NF > 0 ? data.attributes.Map_C_NF : null]
                ]
              }]
            },
            function(chart1) { // on complete
              var xpos = '50%';
              var ypos = '50%';
              var circleradius = 75;
              var totalValue = (parseFloat(chart1.series[0].data[1].percentage)+parseFloat(chart1.series[0].data[2].percentage)+parseFloat(chart1.series[0].data[3].percentage)+parseFloat(chart1.series[0].data[4].percentage)).toFixed(1);
              var centerText = totalValue;

              // Render the text
              var chart1Text = chart1.renderer.text(centerText + '%' + '<br> Total').css({
                width: circleradius * 2,
                color: '#1c1c1c',
                fontSize: '16px'
              }).attr({
                // why doesn't zIndex get the text in front of the chart?
                zIndex: 999
              }).add();

              var textBBox = chart1Text.getBBox();
              var x = chart1.plotLeft + (chart1.plotWidth  * 0.5) - (textBBox.width  * 0.5);
              var y = chart1.plotTop  + (chart1.plotHeight * 0.54) - (textBBox.height * 0.5);
              chart1Text.attr({x: x, y: y});
            })
          };
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
