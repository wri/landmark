define([
    'esri/Color',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/renderers/UniqueValueRenderer',
    'esri/symbols/SimpleMarkerSymbol'

], function(Color, SimpleFillSymbol, SimpleLineSymbol, UniqueValueRenderer, SimpleMarkerSymbol) {
    'use strict';

    var hoverSymbol, pointHoverSymbol;

    /**
     * This Class is a good place to store popup templates and symbols that are used in more then one location
     * so we have an easy way to modify these in the future
     */

    var Assets = {

        /**
         * Returns a symbol to be used for drawn or uploaded features
         * @return {object} returns a esri symbol for graphic objects
         */
        getDrawUploadSymbol: function() {
            return new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0]), 2),
                new Color([255, 255, 255, 0.5]));
        },

        getDrawUploadSymbolPoint: function() {
            return new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10,
              new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
              new Color([255,0,0]), 1),
              new Color([0,255,0,0.95]));
        },

        getHoverSymbol: () => {
          if (hoverSymbol) { return hoverSymbol; }
          hoverSymbol = new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color('#4099CE'), 3),
            new Color([210, 210, 210, 0.0])
          );
          return hoverSymbol;
        },

        getPointHoverSymbol: () => {
          if (pointHoverSymbol) { return pointHoverSymbol; }
          pointHoverSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 8,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
            new Color('#4099CE'), 1),
            new Color('#4099CE'));
          return pointHoverSymbol;
        },

        /**
         *	@param {string} fieldName - Field Name to be used in the Unique Value Renderer
         * @return {UniqueValueRenderer - object} The Created Unique Value Renderer Ready to Use on a Dynamic Layer
         */
        getUniqueValueRendererForNationalDataWithField: function(fieldName, layer) {

            var noReviewSymbol, lawSilentSymbol, legalAddressesSymbol,
                legalMeetsSymbol, legalFullyMeetsSymbol, notApplicableSymbol,
                renderer;

            // // Set up all the symbols
            // noReviewSymbol = new SimpleFillSymbol().setColor(new Color([30, 30, 30, 0.90]));
            // lawSilentSymbol = new SimpleFillSymbol().setColor(new Color([215, 25, 28, 0.90]));
            // legalAddressesSymbol = new SimpleFillSymbol().setColor(new Color([253, 174, 97, 0.90]));
            // legalMeetsSymbol = new SimpleFillSymbol().setColor(new Color([166, 217, 106, 0.90]));
            // legalFullyMeetsSymbol = new SimpleFillSymbol().setColor(new Color([26, 150, 65, 0.90]));
            // notApplicableSymbol = new SimpleFillSymbol().setColor(new Color([248, 248, 255, 0.90]));

            // // Create the renderer with a default value
            // renderer = new UniqueValueRenderer(notApplicableSymbol, fieldName);

            //todo: opacity 20% for Avg_Scr

            notApplicableSymbol = brApp.landTenureRenderer.uniqueValueInfos[5].symbol;
            renderer = new UniqueValueRenderer(notApplicableSymbol, fieldName);

            renderer.addValue({
                value: brApp.landTenureRenderer.uniqueValueInfos[0].value,
                symbol: brApp.landTenureRenderer.uniqueValueInfos[0].symbol,
                label: brApp.landTenureRenderer.uniqueValueInfos[0].label
            });

            renderer.addValue({
                value: brApp.landTenureRenderer.uniqueValueInfos[1].value,
                symbol: brApp.landTenureRenderer.uniqueValueInfos[1].symbol,
                label: brApp.landTenureRenderer.uniqueValueInfos[1].label
            });

            renderer.addValue({
                value: brApp.landTenureRenderer.uniqueValueInfos[2].value,
                symbol: brApp.landTenureRenderer.uniqueValueInfos[2].symbol,
                label: brApp.landTenureRenderer.uniqueValueInfos[2].label
            });

            renderer.addValue({
                value: brApp.landTenureRenderer.uniqueValueInfos[3].value,
                symbol: brApp.landTenureRenderer.uniqueValueInfos[3].symbol,
                label: brApp.landTenureRenderer.uniqueValueInfos[3].label
            });

            renderer.addValue({
                value: brApp.landTenureRenderer.uniqueValueInfos[4].value,
                symbol: brApp.landTenureRenderer.uniqueValueInfos[4].symbol,
                label: brApp.landTenureRenderer.uniqueValueInfos[4].label
            });

            renderer.addValue({
                value: brApp.landTenureRenderer.uniqueValueInfos[5].value,
                symbol: brApp.landTenureRenderer.uniqueValueInfos[5].symbol,
                label: brApp.landTenureRenderer.uniqueValueInfos[5].label
            });

            // renderer.addValue({
            //     value: brApp.landTenureRenderer.uniqueValueInfos[6].value,
            //     symbol: brApp.landTenureRenderer.uniqueValueInfos[6].symbol,
            //     label: brApp.landTenureRenderer.uniqueValueInfos[6].label
            // });

            renderer.attributeField = fieldName;

            // Add Values to the Unique Value Renderer attached with label for the legend and the correct symbol
            // value is relative to the field Name
            // renderer.addValue({
            //     value: 0,
            //     symbol: noReviewSymbol,
            //     label: "No review yet done"
            // });

            // renderer.addValue({
            //     value: 1,
            //     symbol: lawSilentSymbol,
            //     label: "The law is either silent on an issue or there is express exclusion"
            // });

            // renderer.addValue({
            //     value: 2,
            //     symbol: legalAddressesSymbol,
            //     label: "The legal framework addresses the indicator but not substantively"
            // });

            // renderer.addValue({
            //     value: 3,
            //     symbol: legalMeetsSymbol,
            //     label: "The legal framework substantially meets the indicator"
            // });

            // renderer.addValue({
            //     value: 4,
            //     symbol: legalFullyMeetsSymbol,
            //     label: "The legal framework fully meets the indicator"
            // });

            // renderer.addValue({
            //     value: 9,
            //     symbol: notApplicableSymbol,
            //     label: "The indicator is not applicable"
            // });

            return renderer;

            //return response.drawingInfo.renderer;

        },

        getNationalLevelIndicatorCode: function() {
            var nationalIndicatorCode;
            switch (brApp.currentLayer) {
                case "averageScoreTenure":
                    nationalIndicatorCode = "Avg_Scr";
                    break;
                case "legalStatusTenure":
                    nationalIndicatorCode = "1";
                    break;
                case "landRightsTenure":
                    nationalIndicatorCode = "2";
                    break;
                case "formalDocTenure":
                    nationalIndicatorCode = "3";
                    break;
                case "legalPersonTenure":
                    nationalIndicatorCode = "4";
                    break;
                case "legalAuthorityTenure":
                    nationalIndicatorCode = "5";
                    break;
                case "perpetuityTenure":
                    nationalIndicatorCode = "6";
                    break;
                case "rightToConsentTenure":
                    nationalIndicatorCode = "7";
                    break;
                case "rightToTreesTenure":
                    nationalIndicatorCode = "8";
                    break;
                case "rightToWaterTenure":
                    nationalIndicatorCode = "9";
                    break;
                case "landRightsProtectedAreasTenure":
                    nationalIndicatorCode = "10";
                    break;
                // case "subsurfaceMinerals":
                //     nationalIndicatorCode = "7d";
                //     break;
                // case "oilAndGasTenure":
                //     nationalIndicatorCode = "7e";
                //     break;
                // case "rightToConsent":
                //     nationalIndicatorCode = "8";
                //     break;
                // case "landAcquisition":
                //     nationalIndicatorCode = "9";
                //     break;
                // case "cadasterObligation":
                //     nationalIndicatorCode = "10";
                //     break;
                // case "disputeMechanism":
                //     nationalIndicatorCode = "11";
                //     break;
                // case "womenEqualLand":
                //     nationalIndicatorCode = "12a";
                //     break;
                // case "newMembersEqualLand":
                //     nationalIndicatorCode = "12b";
                //     break;
                // case "minoritiesEqualLand":
                //     nationalIndicatorCode = "12c";
                //     break;
            }

            return nationalIndicatorCode;

        }

    };

    return Assets;

});
