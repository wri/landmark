define([
    'map/ReportConfig',
    'dojo/on',
    // 'esri/map',
    // 'dojo/on',
    // 'esri/geometry/Extent',
    // 'dojo/dom',
    // 'esri/layers/ImageParameters',
    // 'esri/layers/ArcGISDynamicMapServiceLayer',
    // 'esri/tasks/query',
    // 'esri/tasks/QueryTask',

], function(ReportConfig, on) {
    'use strict';

    var Main = {
      init: function() {

        var self = this;

        on(document.getElementById('analysis-export'), 'click', function() {
            self.exportAnalysisResult(window.payload.csv);
        });

        // on.once(document.getElementById('exportAnalysis'), 'click', function() {
        //     self.exportAnalysisResult(brApp.csv);
        // });

        var identityData = { //Identity
          indigenous: 0,
          community: 0
        }
        var recognitionData = { //Form_Rec
          informal: 0,
          formal: 0
        }
        var documentationData = { //Doc_Status
          formalDoc: 0,
          noDoc: 0,
          occupied: 0,
          formalLand: 0,
          inProcess: 0
        }

        var tableBody = "<table id='analysisTable'><tr id='column-header'><td class='country'><b>Country</b></td><td class='name'><b>Name</b></td><td class='ident'><b>Identity</b></td><td class='offic_rec'><b>Formal Recognition</b></td><td class='rec_status'><b>Documentation Status</b></td><td class='rec_status'><b>GIS Area</b></td></tr>";
        //- var fields = ["Country", "Name", "Identity", "Formal Recognition", "Documentation Status", "Area_GIS"];
        //brApp.csv = fields.join(",") + '\n';

        function getTextContent(graphic, even) {
            if (graphic.feature.attributes.Identity === "Indigenous (self-identified)") {
                graphic.feature.attributes.Identity = "Indigenous";
            }
            if (graphic.feature.attributes.Identity === "Non-indigenous (self-identified)") {
                graphic.feature.attributes.Identity = "Community";
            }
            if (graphic.feature.attributes.Form_Rec === "Officially recognized (by law or decree)") {
                graphic.feature.attributes.Form_Rec = "Officially recognized";
            }

            var str;
            var areaGis = graphic.feature.attributes.Area_GIS ? parseFloat(graphic.feature.attributes.Area_GIS).toFixed(2) : '0.00';
            if (even === "even") {
                str = "<tr class='even-row'><td class='country'>" + graphic.feature.attributes.Country + "</td><td class='name'>" +
                    graphic.feature.attributes.Name + "</td><td class='ident'>" +
                    graphic.feature.attributes.Identity + "</td><td class='offic_rec'>" +
                    graphic.feature.attributes.Form_Rec + "</td><td class='rec_status'>" +
                    graphic.feature.attributes.Doc_Status + "</td><td class='rec_status'>" +
                    areaGis + "</td></tr>";
                var fieldValues = [graphic.feature.attributes.Country, graphic.feature.attributes.Name, graphic.feature.attributes.Identity, graphic.feature.attributes.Form_Rec, graphic.feature.attributes.Form_Rec, graphic.feature.attributes.Area_GIS];
                //- brApp.csv += fieldValues.join(",") + '\n';
            } else {
                str = "<tr class='odd-row'><td>" + graphic.feature.attributes.Country + "</td><td class='name'>" +
                    graphic.feature.attributes.Name + "</td><td class='ident'>" +
                    graphic.feature.attributes.Identity + "</td><td class='offic_rec'>" +
                    graphic.feature.attributes.Form_Rec + "</td><td class='rec_status'>" +
                    graphic.feature.attributes.Doc_Status + "</td><td class='rec_status'>" +
                    areaGis + "</td></tr>";
                var fieldValues = [graphic.feature.attributes.Country, graphic.feature.attributes.Name, graphic.feature.attributes.Identity, graphic.feature.attributes.Form_Rec, graphic.feature.attributes.Form_Rec, graphic.feature.attributes.Area_GIS];
                //- brApp.csv += fieldValues.join(",") + '\n';
            }
            return str;
        }

        for (var i = 0; i < window.payload.features.length; i++) {
            //if i is odd use odd row else use even row class
            if (i % 2 == 0) {
                tableBody = tableBody + getTextContent(window.payload.features[i], 'even');
            } else {
                tableBody = tableBody + getTextContent(window.payload.features[i], 'odd');
            }

            if (window.payload.features[i].feature.attributes.Identity === 'Indigenous') {
              identityData.indigenous++;
            } else if (window.payload.features[i].feature.attributes.Identity === 'Community') {
              identityData.community++;
            }

            if (window.payload.features[i].feature.attributes.Form_Rec === 'Not formally recognized') {
              recognitionData.informal++;
            } else if (window.payload.features[i].feature.attributes.Form_Rec === 'Formally recognized') {
              recognitionData.formal++;
            }

            if (window.payload.features[i].feature.attributes.Doc_Status === 'Formal documentation') {
              documentationData.formalDoc++;
            } else if (window.payload.features[i].feature.attributes.Doc_Status === 'No documentation') {
              documentationData.noDoc++;
            } else if (window.payload.features[i].feature.attributes.Doc_Status === 'Occupied or used without formal land petition') {
              documentationData.occupied++;
            } else if (window.payload.features[i].feature.attributes.Doc_Status === 'Formal land petition') {
              documentationData.formalLand++;
            } else if (window.payload.features[i].feature.attributes.Doc_Status === 'In process of documentation') {
              documentationData.inProcess++;
            }
        }

        tableBody += "</table>";

        document.getElementById('analysis-title').innerHTML = 'The area of interest intersects with ' + window.payload.features.length + ' indigenous and/or community lands';
        document.getElementById('analysis-table').innerHTML = tableBody;

        Highcharts.chart('identity-pie', {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            margin: [0, 0, 0, 0],
            spacingTop: 0,
            spacingBottom: 0,
            spacingLeft: 0,
            spacingRight: 0,
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45
            }
          },
          title: {
            margin: 0,
            text: 'Indigenous and Community lands <br><b style="color:#00A9DA;">Identity</b>',
            style: { 'font-size': '14px', 'color': '#00356C'}
          },
          credits: {
            enabled: false
          },
          exporting: {
            enabled: false
          },
          tooltip: {
            pointFormat: '<b>{point.y} features</b>'
          },
          plotOptions: {
            pie: {
              size:'50%',
              innerSize: '60%',
              depth: 45,
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b><br> {point.percentage:.1f} %',
                distance: 10,
                style: {
                  color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
              }
            }
          },
          series: [{
            colorByPoint: true,
            data: [{
              name: 'Indigenous',
              y: identityData.indigenous
            }, {
              name: 'Community',
              y: identityData.community
            }]
          }]
        });

        Highcharts.chart('recognition-pie', {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            margin: [0, 0, 0, 0],
            spacingTop: 0,
            spacingBottom: 0,
            spacingLeft: 0,
            spacingRight: 0,
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45
            }
          },
          title: {
            margin: 0,
            text: 'Indigenous and Community lands <br><b style="color:#00A9DA;">Recognition</b>',
            style: { 'font-size': '14px', 'color': '#00356C'}
          },
          credits: {
            enabled: false
          },
          exporting: {
            enabled: false
          },
          tooltip: {
            pointFormat: '<b>{point.y} features</b>'
          },
          plotOptions: {
            pie: {
              size:'50%',
              innerSize: '60%',
              depth: 45,
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b><br> {point.percentage:.1f} %',
                distance: 10,
                style: {
                  color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
              }
            }
          },
          series: [{
            colorByPoint: true,
            data: [{
              name: 'Not formally <br> recognized',
              y: recognitionData.informal
            }, {
              name: 'Formally <br> recognized',
              y: recognitionData.formal
            }]
          }]
        });

        Highcharts.chart('documentation-pie', {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            margin: [0, 0, 0, 0],
            spacingTop: 0,
            spacingBottom: 0,
            spacingLeft: 0,
            spacingRight: 0,
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45
            }
          },
          title: {
            margin: 0,
            text: 'Indigenous and Community lands <br><b style="color:#00A9DA;">Documentation</b>',
            style: { 'font-size': '14px', 'color': '#00356C'}
          },
          credits: {
            enabled: false
          },
          exporting: {
            enabled: false
          },
          tooltip: {
            pointFormat: '<b>{point.y} features</b>'
          },
          plotOptions: {
            pie: {
              size:'50%',
              innerSize: '60%',
              depth: 45,
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b><br> {point.percentage:.1f} %',
                distance: 10,
                style: {
                  color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
              }
            }
          },
          series: [{
            colorByPoint: true,
            data: [{
              name: 'Formal doc',
              y: documentationData.formalDoc
            }, {
              name: 'No doc',
              y: documentationData.noDoc
            }, {
              name: 'Occupied w/o <br> formal petition',
              y: documentationData.occupied
            }, {
              name: 'Formal <br> petition',
              y: documentationData.formalLand
            }, {
              name: 'Doc <br> in process',
              y: documentationData.inProcess
            }]
          }]
        });

      },

      exportAnalysisResult: function(text) {

          var blob = new Blob([text], {
              type: "text/csv;charset=utf-8;"
          });

          saveAs(blob, "LandMarkAnalysisResults.csv");

      },
    };

    return Main;

  });
