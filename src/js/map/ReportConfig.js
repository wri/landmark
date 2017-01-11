define([], function() {
    'use strict';

    var config = {

        reportAttributes: [{
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
        }],

        mapLayers: [{
          url: 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_ind_FormalDoc/MapServer',
          layerIds: [0, 1]
        }, {
          url: 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_ind_FormalClaim/MapServer',
          layerIds: [0, 1]
        }, {
          url: 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_ind_Occupied/MapServer',
          layerIds: [0, 1]
        }, {
          url: 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_comm_Occupied/MapServer',
          layerIds: [0, 1]
        }, {
          url: 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_comm_FormalDoc/MapServer',
          layerIds: [0, 1]
        }, {
          url: 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_comm_NoDoc/MapServer',
          layerIds: [0, 1]
        }],

        countrySnapUrl: 'http://gis.wri.org/arcgis/rest/services/LandMark/Country_Snapshots/MapServer',
        countrySnapIndex: 0,

        countryCodeExceptions: [
          {ISO: "CL-", ISO2: "FR"},
          {ISO: "KO-", ISO2: "KR"},
          {ISO: "SMX", ISO2: "XX"},
          {ISO: "SP-", ISO2: "CL"},
          {ISO: "GBR1", ISO2: "GB"},
          {ISO: "GBR2", ISO2: "GB"},
          {ISO: "GBR3", ISO2: "GB"},
          {ISO: "GBR4", ISO2: "GB"}
        ]
    };

    return config;

});
