define([], function() {

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
          domId: 'perpetuity-comm'
        }, {
          attr: 'ind_IP_6',
          domId: 'perpetuity-indig'
        }, {
          attr: 'ind_C_7',
          domId: 'right-consent-comm'
        }, {
          attr: 'ind_IP_7',
          domId: 'right-consent-indig'
        }, {
          attr: 'ind_C_8',
          domId: 'right-trees-comm'
        }, {
          attr: 'ind_IP_8',
          domId: 'right-trees-indig'
        }, {
          attr: 'ind_C_9',
          domId: 'right-water-comm'
        }, {
          attr: 'ind_IP_9',
          domId: 'right-water-indig'
        }, {
          attr: 'ind_C_10',
          domId: 'land-rights-protected-comm'
        }, {
          attr: 'ind_IP_10',
          domId: 'land-rights-protected-indig'
        }],

        mapLayers: [{
          // url: 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_ind_FormalDoc/MapServer',
          url: 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_ind_Documented/MapServer',
          layerIds: [0, 1]
        }, {
          // url: 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_ind_FormalClaim/MapServer',
          url: 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_ind_FormalLandClaim/MapServer',
          layerIds: [0, 1]
        }, {
          // url: 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_ind_Occupied/MapServer',
          url: 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_ind_CustomaryTenure/MapServer',
          layerIds: [0, 1]
        }, {
          // url: 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_comm_Occupied/MapServer',
          url: 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_comm_CustomaryTenure/MapServer',
          layerIds: [0, 1]
        }, {
          // url: 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_comm_FormalDoc/MapServer',
          url: 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_comm_Documented/MapServer',
          layerIds: [0, 1]
        }, {
          // url: 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_comm_NoDoc/MapServer',
          url: 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_comm_NotDocumented/MapServer',
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
        ],
        fieldAliases: [
          'Country',
          'ISO ALPHA-2 Code',
          'ISO Country Code',
          'Country Land Area (hectares)',
          'Percent of Indigenous and Community Lands',
          'Percent of Indigenous and Community Lands Acknowledged by the Government',
          'Percent of Indigenous and Community Lands Not Acknowledged by the Government',
          'Indigenous Lands Not Titled',
          'Community Lands Not Titled',
          'Indigenous Lands Held or Used With Formal Land Claim',
          'Indigenous Lands held or Used With Formal Land Claim',
          'Community Lands Titled',
          'Community Lands Held or Used With Formal Land Claim',
          'Number of maps',
          'Indigenous Peoples Legal Status',
          'Indigenous Peoples Land Rights and Common Property',
          'Indigenous Peoples Formal Documentation',
          'Indigenous Peoples Legal Person',
          'Indigenous Peoples Legal Authority',
          'Indigenous Peoples Perpetuity',
          'Indigenous Peoples Right to Consent Before Land Acquisition',
          'Indigenous Peoples Rights to Trees',
          'Indigenous Peoples Rights to Water',
          'Indigenous Peoples Land Rights in Protected Areas',
          'Indigenous Lands Average',
          'Communities Legal Status',
          'Communities Land Rights and Common Property',
          'Communities Formal Documentation',
          'Communities Legal Person',
          'Communities Legal Authority',
          'Communities Perpetuity',
          'Communities Right to Consent Before Land Acquisition',
          'Communities Rights to Trees',
          'Communities Rights to Water',
          'Communities Land Rights in Protected Areas',
          'Communities Average'
        ]
    };

    return config;

});
