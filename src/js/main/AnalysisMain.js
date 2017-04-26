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

        var tableBody = "<table id='analysisTable'><thead><tr id='column-header'><td align='left' class='country'><b>Country</b></td><td align='left' class='name'><b>Name</b></td><td align='left' class='ident'><b>Identity</b></td><td align='left' class='offic_rec'><b>Recognition Status</b></td><td align='left' class='rec_status'><b>Documentation Status</b></td><td align='left' class='rec_status'><b>GIS Area</b></td></tr></thead><tbody>";
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

            var areaGis = graphic.feature.attributes.Area_GIS && graphic.feature.attributes.Area_GIS !== 'Null' ? parseFloat(parseFloat(graphic.feature.attributes.Area_GIS).toFixed(2)).toLocaleString() : '0.00';

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

            if (window.payload.features[i].feature.attributes.Form_Rec === 'Not acknowledged by govt') {
              recognitionData.informal++;
            } else if (window.payload.features[i].feature.attributes.Form_Rec === 'Acknowledged by govt') {
              recognitionData.formal++;
            }

            if (window.payload.features[i].feature.attributes.Doc_Status === 'Documented') {
              documentationData.formalDoc++;
            } else if (window.payload.features[i].feature.attributes.Doc_Status === 'Not documented') {
              documentationData.noDoc++;
            } else if (window.payload.features[i].feature.attributes.Doc_Status === 'Held or used under customary tenure') {
              documentationData.occupied++;
            } else if (window.payload.features[i].feature.attributes.Doc_Status === 'Held or used with formal land claim submitted') {
              documentationData.formalLand++;
            }
        }

        tableBody += "</tbody></table>";

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
            type: 'pie'
          },
          colors: ['#F7A35C','#95CEFF'],
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
            formatter: function() {
              return this.point.name + '<br><b>' + this.point.y + ' features</b>'
            }
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
                formatter: function() {
                  if (this.point.percentage != 0) {
                    return '<b>' + this.point.name + '</b><br>' + this.point.percentage.toFixed(1) + '%';
                  } else {
                    return null;
                  }
                },
                // format: '<b>{point.name}</b><br> {point.percentage:.1f} %',
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
            type: 'pie'
          },
          colors: ['#B8E16A','#47AB47'],
          title: {
            margin: 0,
            text: 'Indigenous and Community lands <br><b style="color:#00A9DA;">Recognition Status</b>',
            style: { 'font-size': '14px', 'color': '#00356C'}
          },
          credits: {
            enabled: false
          },
          exporting: {
            enabled: false
          },
          tooltip: {
            formatter: function() {
              return this.point.name + '<br><b>' + this.point.y + ' features</b>'
            }
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
                formatter: function() {
                  if (this.point.percentage != 0) {
                    return '<b>' + this.point.name + '</b><br>' + this.point.percentage.toFixed(1) + '%';
                  } else {
                    return null;
                  }
                },
                // format: '<b>{point.name}</b><br> {point.percentage:.1f} %',
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
              name: 'Not acknowledged <br> by govt',
              y: recognitionData.informal
            }, {
              name: 'Acknowledged <br> by govt',
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
            type: 'pie'
          },
          colors: ['#E5A5F8','#C670E6', '#8908C4', '#A73CD5'],
          title: {
            margin: 0,
            text: 'Indigenous and Community lands <br><b style="color:#00A9DA;">Documentation Status</b>',
            style: { 'font-size': '14px', 'color': '#00356C'}
          },
          credits: {
            enabled: false
          },
          exporting: {
            enabled: false
          },
          tooltip: {
            formatter: function() {
              return this.point.name + '<br><b>' + this.point.y + ' features</b>'
            }
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
                formatter: function() {
                  if (this.point.percentage != 0) {
                    return '<b>' + this.point.name + '</b><br>' + this.point.percentage.toFixed(1) + '%';
                  } else {
                    return null;
                  }
                },
                // format: '<b>{point.name}</b><br> {point.percentage:.1f} %',
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
              name: 'Held or used <br> under <br> customary <br> tenure',
              y: documentationData.occupied
            }, {
              name: 'Formal land <br> claim <br> submitted',
              y: documentationData.formalLand
            }, {
              name: 'Documented',
              y: documentationData.formalDoc
            }, {
              name: 'Not documented',
              y: documentationData.noDoc
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
