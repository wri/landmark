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

                  }
                });

                var countryLand = result.features[0].attributes.Ctry_Land ? result.features[0].attributes.Ctry_Land : 0;
                var NB_Maps = result.features[0].attributes.NB_Maps ? result.features[0].attributes.NB_Maps : 0;
                // var iso2Value = ReportConfig.countryCodeExceptions.includes(result.features[0].attributes.ISO_ALPHA) ?
                var iso2Value;
                var countryCodeExceptions = ReportConfig.countryCodeExceptions
                for (var i = 0; i < countryCodeExceptions.length; i++) {
                  if (result.features[0].attributes.ISO_Code === countryCodeExceptions[i].ISO) {
                    dom.byId('flag-icon').classList = 'flag-icon flag-icon-'+countryCodeExceptions[i].ISO2.toLowerCase();
                  } else {
                    dom.byId('flag-icon').classList = 'flag-icon flag-icon-'+result.features[0].attributes.ISO_ALPHA2.toLowerCase();
                  }
                }

                dom.byId('land-count').innerHTML =  '<strong>' + NB_Maps.toLocaleString() + '</strong> indigenous and community lands mapped on Landmark';
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
          if (fixedTotal) {
            fixedTotal = fixedTotal.toFixed(2);
          } else {
            fixedTotal = data.attributes.Pct_F + data.attributes.Pct_NF;
          }

          var angle = (fixedTotal / 100) * 180;

          if (angle === 0) {
            angle = 180
          }

          var estimatedChart = Highcharts.chart('estimated-chart', {
            chart: {
              plotBackgroundColor: null,
              backgroundColor: '#404040',
              plotBorderWidth: 0,
              plotShadow: false,
              margin: [0, 0, 0, 0],
              spacingTop: 0,
              spacingBottom: 0,
              spacingLeft: 0,
              spacingRight: 0
            },
            colors: ['gray','#f4e0d7', '#e5aa92'],
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
              pointFormat: '<b>{point.y:.2f}%</b>'
            },
            plotOptions: {
              pie: {
                dataLabels: {
                  enabled: true,
                  distance: 10,
                  style: {
                    fontWeight: 'bold',
                    color: 'white'
                  }
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
                [(100 - data.attributes.Pct_F - data.attributes.Pct_NF).toFixed(2) + '% No <br> Data', 100 - data.attributes.Pct_F - data.attributes.Pct_NF > 0 ? 100 - data.attributes.Pct_F - data.attributes.Pct_NF : null],
                [data.attributes.Pct_F + '% <br><b>Acknowledged</b> <br><b>by gov</b>',   data.attributes.Pct_F > 0 ? data.attributes.Pct_F : null],
                [data.attributes.Pct_NF + '% <br><b>Not</b> <br><b>acknowledged</b>',       data.attributes.Pct_NF > 0 ? data.attributes.Pct_NF : null],
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
          var centerText = (parseFloat(chart1.series[0].data[1].percentage)+parseFloat(chart1.series[0].data[2].percentage)).toFixed(2)

          // Render the circle
          chart1.renderer.circle(xpos, ypos, circleradius).attr({
              fill: '#ddd',
          }).add();

          // Render the text
          var chart1Text = chart1.renderer.text(centerText + '%' + '<br> Total').css({
              width: circleradius * 2,
              color: '#4572A7',
              fontSize: '16px'
          }).attr({
              // why doesn't zIndex get the text in front of the chart?
              zIndex: 999
          }).add();

          var textBBox = chart1Text.getBBox();
          var x = chart1.plotLeft + (chart1.plotWidth  * 0.5) - (textBBox.width  * 0.5);
          var y = chart1.plotTop  + (chart1.plotHeight * 0.5) - (textBBox.height * 0.4);
          chart1Text.attr({x: x, y: y});
      });


      if (!data.attributes.Map_C_F && !data.attributes.Map_C_NF) {
        var commLandsChart = Highcharts.chart('community-lands-chart', {
          chart: {
            plotBackgroundColor: null,
            backgroundColor: '#404040',
            plotBorderWidth: 0,
            plotShadow: false
          },
          colors: ['gray'],
          title: {
            text: null
          },
          credits: {
            enabled: false
          },
          tooltip: { enabled: false },
          plotOptions: {
            pie: {
              dataLabels: {
                enabled: true,
                distance: 20,
                style: {
                  fontWeight: 'bold',
                  color: 'white'
                }
              },
              size:'50%'
            }
          },
          series: [{
            type: 'pie',
            innerSize: '60%',
            data: [
              ['No Data', 100 - data.attributes.Map_C_F - data.attributes.Map_C_NF > 0 ? 100 - data.attributes.Map_C_F - data.attributes.Map_C_NF : null]
            ]
          }]
        })
      } else {
            var commLandsChart = Highcharts.chart('community-lands-chart', {
              chart: {
                plotBackgroundColor: null,
                backgroundColor: '#404040',
                plotBorderWidth: 0,
                plotShadow: false,
                margin: [0, 0, 0, 0],
                spacingTop: 0,
                spacingBottom: 0,
                spacingLeft: 0,
                spacingRight: 0
              },
              colors: ['#f4e0d7', '#e5aa92', 'gray'],
              // title: {
              //   useHTML: true,
              //   shape: 'circle',
              //   // style: { "height": "100px", "color": "white", "background-color": "#055d7d", "padding": "20px", "border-radius": "50%", "fontSize": "18px" },
              //   // text: '<p class="chart-center">Lands held:</p> <p class="chart-center chart-percent"> ' + data.attributes.Map_C_T.toFixed(2) + '%</p>',
              //   align: 'center',
              //   verticalAlign: 'middle',
              //   y: 40
              // },
              title: {
                text: null
              },
              credits: {
                enabled: false
              },
              tooltip: {
                pointFormat: '<b>{point.y:.2f}%</b>'
              },
              plotOptions: {
                pie: {
                  dataLabels: {
                    enabled: true,
                    distance: 20,
                    style: {
                      fontWeight: 'bold',
                      color: 'white'
                    }
                  },
                  size:'40%'
                  // startAngle: -(data.attributes.Map_C_T / 100) * 180,
                  // endAngle: (data.attributes.Map_C_T / 100) * 180,
                  // center: ['50%', '75%']
                }
              },
              series: [{
                type: 'pie',
                // name: 'Browser share',
                innerSize: '60%',
                data: [
                  // [(100 - data.attributes.Map_C_F.toFixed(2) - data.attributes.Map_C_NF.toFixed(2)).toFixed(2) + '% No Data', 100 - data.attributes.Map_C_F - data.attributes.Map_C_NF > 0 ? 100 - data.attributes.Map_C_F - data.attributes.Map_C_NF : null],
                  // [data.attributes.Map_C_F + '% <br><b>Acknowledged</b> <br><b>by gov</b>',   data.attributes.Map_C_F > 0 ? data.attributes.Map_C_F : null],
                  // [data.attributes.Map_C_NF + '% <br><b>Not</b> <br><b>acknowledged</b>',     data.attributes.Map_C_NF > 0 ? data.attributes.Map_C_NF : null],
                  {
                    name: 'Acknowledged by Gov',
                    y: data.attributes.Map_C_F > 0 ? data.attributes.Map_C_F : null,
                    dataLabels: {
                      enabled: true,
                      y:-5,
                      color:"white",
                      crop: false,
                      overflow: 'none',
                      style: {
                        fontSize: "10px"
                      },
                       formatter: function(){
                         var map_C_F = data.attributes.Map_C_F ? data.attributes.Map_C_F.toFixed(2) : 0;
                         return data.attributes.Map_C_F + '% <br><b>Acknowledged</b> <br><b>by gov</b>'
                       }
                    }
                  },
                  {
                    name: 'Not Acknowledged by Gov',
                    y: data.attributes.Map_C_NF > 0 ? data.attributes.Map_C_NF : null,
                    dataLabels: {
                      enabled: true,
                      y:-5,
                      color:"white",
                      crop: false,
                      overflow: 'none',
                      style: {
                        fontSize: "10px"
                      },
                       formatter: function(){
                         var map_C_NF = data.attributes.Map_C_NF ? data.attributes.Map_C_NF.toFixed(2) : 0;
                         return data.attributes.Map_C_NF + '% <br><b>Not</b> <br><b>acknowledged</b>'
                       }
                    }
                  },
                  {
                    name: 'No Data',
                    y: 100 - data.attributes.Map_C_F - data.attributes.Map_C_NF > 0 ? 100 - data.attributes.Map_C_F - data.attributes.Map_C_NF : null,
                    dataLabels: {
                      enabled: true,
                      y:-5,
                      color:"white",
                      overflow: 'none',
                      crop: false,
                      style: {
                        fontSize: "10px"
                      },
                       formatter: function(){
                         return (100 - data.attributes.Map_C_F - data.attributes.Map_C_NF).toFixed(2) + '% No Data'
                       }
                    }
                  }
                ]
              }]
            },
            function(chart1) { // on complete
            var xpos = '50%';
            var ypos = '50%';
            var circleradius = 30;
            var centerText = (parseFloat(chart1.series[0].data[1].percentage)+parseFloat(chart1.series[0].data[2].percentage)).toFixed(2)

            // Render the circle
            chart1.renderer.circle(xpos, ypos, circleradius).attr({
                fill: '#ddd',
            }).add();

            // Render the text
            var chart1Text = chart1.renderer.text(centerText + '%' + '<br> Total').css({
                width: circleradius * 2,
                color: '#4572A7',
                fontSize: '10px'
            }).attr({
                // why doesn't zIndex get the text in front of the chart?
                zIndex: 999
            }).add();

            var textBBox = chart1Text.getBBox();
            var x = chart1.plotLeft + (chart1.plotWidth  * 0.5) - (textBBox.width  * 0.5);
            var y = chart1.plotTop  + (chart1.plotHeight * 0.5) - (textBBox.height * 0.25);
            chart1Text.attr({x: x, y: y});
        })};

        if (!data.attributes.Map_IP_F && !data.attributes.Map_IP_NF) {
          var indigenousLandsChart = Highcharts.chart('indigenous-lands-chart', {
            chart: {
              plotBackgroundColor: null,
              backgroundColor: '#404040',
              plotBorderWidth: 0,
              plotShadow: false
            },
            colors: ['gray'],
            title: {
              text: null
            },
            credits: {
              enabled: false
            },
            tooltip: { enabled: false },
            plotOptions: {
              pie: {
                dataLabels: {
                  enabled: true,
                  distance: 10,
                  style: {
                    fontWeight: 'bold',
                    color: 'white'
                  }
                },
                size:'50%'
              }
            },
            series: [{
              type: 'pie',
              innerSize: '60%',
              data: [
                ['No Data', 100 - data.attributes.Map_IP_F - data.attributes.Map_IP_NF > 0 ? 100 - data.attributes.Map_IP_F - data.attributes.Map_IP_NF : null]
              ]
            }]
          })
        } else {
            var indigenousLandsChart = Highcharts.chart('indigenous-lands-chart', {
              chart: {
                plotBackgroundColor: null,
                backgroundColor: '#404040',
                plotBorderWidth: 0,
                plotShadow: false,
                margin: [0, 0, 0, 0],
                spacingTop: 0,
                spacingBottom: 0,
                spacingLeft: 0,
                spacingRight: 0
              },
              colors: ['#f4e0d7', '#e5aa92','gray'],
              // title: {
              //   useHTML: true,
              //   shape: 'circle',
              //   // style: { "height": "100px", "color": "white", "background-color": "#055d7d", "padding": "20px", "border-radius": "50%", "fontSize": "18px" },
              //   // text: '<p class="chart-center">Lands held:</p> <p class="chart-center chart-percent"> ' + data.attributes.Map_IP_T.toFixed(2) + '%</p>',
              //   align: 'center',
              //   verticalAlign: 'middle',
              //   y: 40
              // },
              title: {
                text: null
              },
              credits: {
                enabled: false
              },
              tooltip: {
                pointFormat: '<b>{point.y:.2f}%</b>'
              },
              plotOptions: {
                pie: {
                  dataLabels: {
                    enabled: true,
                    distance: 10,
                    crop: false,
                    overflow: 'none',
                    style: {
                      fontWeight: 'bold',
                      color: 'white',
                      width: '10px',
                      overflow: 'visible'
                    }
                  },
                  size:'40%'
                  // startAngle: -(data.attributes.Map_IP_T / 100) * 180,
                  // endAngle: (data.attributes.Map_IP_T / 100) * 180,
                  // center: ['50%', '75%']
                }
              },
              series: [{
                type: 'pie',
                // name: 'Browser share',
                innerSize: '60%',
                data: [
                  // [(100 - data.attributes.Map_IP_F.toFixed(2) - data.attributes.Map_IP_NF.toFixed(2)).toFixed(2) + '% No Data', 100 - data.attributes.Map_IP_F - data.attributes.Map_IP_NF > 0 ? 100 - data.attributes.Map_IP_F - data.attributes.Map_IP_NF : null],
                  // [data.attributes.Map_IP_F.toFixed(2) + '% <br><b>Acknowledged</b> <br><b>by gov</b>',   data.attributes.Map_IP_F > 0 ? data.attributes.Map_IP_F : null],
                  // [data.attributes.Map_IP_NF.toFixed(2) + '% <br><b>Not</b> <br><b>acknowledged</b>',       data.attributes.Map_IP_NF > 0 ? data.attributes.Map_IP_NF : null],
                  // {
                  //   name: 'Proprietary or Undetectable',
                  //   y: 0.2,
                  //   dataLabels: {
                  //     enabled: false
                  //   }
                  // }
                  {
                    name: 'Acknowledged by Gov',
                    y: data.attributes.Map_IP_F > 0 ? data.attributes.Map_IP_F : null,
                    dataLabels: {
                      enabled: true,
                      y:-5,
                      color:"white",
                      crop: false,
                      overflow: 'none',
                      // useHTML: true,
                      // format: '<div class="chart-data-label__container">{data.attributes.Map_IP_F}% <span class="chart-data-label__name">Acknowledged by Gov</span>',
                      style: {
                        fontSize: "10px"
                      },
                       formatter: function(){
                         var map_IP_F = data.attributes.Map_IP_F ? data.attributes.Map_IP_F.toFixed(2) : 0;
                         return map_IP_F + '% <br><b>Acknowledged</b> <br><b>by gov</b>'
                       }
                    }
                  },
                  {
                    name: 'Not Acknowledged by Gov',
                    y: data.attributes.Map_IP_NF > 0 ? data.attributes.Map_IP_NF : null,
                    dataLabels: {
                      enabled: true,
                      y:-5,
                      color:"white",
                      crop: false,
                      overflow: 'none',
                      style: {
                        fontSize: "10px"
                      },
                       formatter: function(){
                         var map_IP_NF = data.attributes.Map_IP_NF ? data.attributes.Map_IP_NF.toFixed(2) : 0;
                         return map_IP_NF + '% <br><b>Not</b> <br><b>acknowledged</b>'
                       }
                    }
                  },
                  {
                    name: 'No Data',
                    y: 100 - data.attributes.Map_IP_F - data.attributes.Map_IP_NF > 0 ? 100 - data.attributes.Map_IP_F - data.attributes.Map_IP_NF : null,
                    dataLabels: {
                      enabled: true,
                      y:-5,
                      color:"white",
                      overflow: 'none',
                      crop: false,
                      style: {
                        fontSize: "10px"
                      },
                       formatter: function(){
                         return (100 - data.attributes.Map_IP_F - data.attributes.Map_IP_NF).toFixed(2) + '% No Data'
                       }
                    }
                  }
                ]
              }]
            },
            function(chart1) { // on complete
            var xpos = '50%';
            var ypos = '50%';
            var circleradius = 30;
            var centerText = (parseFloat(chart1.series[0].data[1].percentage)+parseFloat(chart1.series[0].data[2].percentage)).toFixed(2)

            // Render the circle
            chart1.renderer.circle(xpos, ypos, circleradius).attr({
                fill: '#ddd',
            }).add();

            // Render the text
            var chart1Text = chart1.renderer.text(centerText + '%' + '<br> Total').css({
                width: circleradius * 2,
                color: '#4572A7',
                fontSize: '10px'
            }).attr({
                // why doesn't zIndex get the text in front of the chart?
                zIndex: 999
            }).add();

            var textBBox = chart1Text.getBBox();
            var x = chart1.plotLeft + (chart1.plotWidth  * 0.5) - (textBBox.width  * 0.5);
            var y = chart1.plotTop  + (chart1.plotHeight * 0.5) - (textBBox.height * 0.25);
            chart1Text.attr({x: x, y: y});
        })};

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
