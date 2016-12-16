define([
    'main/config',
    'esri/map',
    'dojo/on',
    'esri/geometry/Extent',
    'esri/layers/FeatureLayer'

], function(AppConfig, Map, on, Extent, FeatureLayer) {
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
              visible: true
            });
            this.map = map;

            on.once(countries, 'graphic-draw', function (evt) {
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
