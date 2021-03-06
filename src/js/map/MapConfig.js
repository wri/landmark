define(["esri/InfoTemplate"], function(InfoTemplate) {

    var landTenureURL = 'http://gis.wri.org/arcgis/rest/services/LandMark/land_tenure/MapServer';
    var percentLandsUrl = 'http://gis.wri.org/arcgis/rest/services/LandMark/pct_comm_lands/MapServer';

    var community_indigenous_FormalClaim = 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_ind_FormalLandClaim/MapServer';
    var community_indigenous_FormalDoc = 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_ind_Documented/MapServer';
    // var community_indigenous_InProcess = 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_ind_InProcess/MapServer';
    var community_indigenous_NoDoc = 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_ind_NotDocumented/MapServer';
    var community_indigenous_Occupied = 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_ind_CustomaryTenure/MapServer';

    var community_community_FormalClaim = 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_comm_FormalLandClaim/MapServer';
    var community_community_FormalDoc = 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_comm_Documented/MapServer';
    // var community_community_InProcess = 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_comm_InProcess/MapServer';
    var community_community_NoDoc = 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_comm_NotDocumented/MapServer';
    var community_community_Occupied = 'http://gis.wri.org/arcgis/rest/services/LandMark/comm_comm_CustomaryTenure/MapServer';

    var MapConfig = {

        options: {
            sliderPosition: 'top-right',
            basemap: 'osm',
            centerX: 102.46,
            centerY: 13.47,
            zoom: 3
        },

        layers: {

          'percentLandsFeature': {
              url: 'http://gis.wri.org/arcgis/rest/services/LandMark/pct_comm_lands/MapServer/1',
              type: 'feature',
              visible: false
          }, //How should these work? No styles, then highlight onHover? YES!
          //only visible when their parent layer is visible? YES!
          //Should only polygon layers get the hover (what about dots?) BOTH!
          //USE ONE NATIONAL LEVEL LAYER TO HIGHLIGHT ALLLL OF THE NAT LEVEL LAYERS!
          //GIVE ALL FEATURELAYERS A NULL SYMBOL ON CREATION!

          //Percent of Indigenous and Community Lands layer
          'percentLands': {
              url: percentLandsUrl,
              type: 'dynamic',
              defaultLayers: [-1], //[1,2,3,4]
              visible: true
          },

            //Analysis Layer
            'analysisLayer': {
                url: "http://gis.wri.org/arcgis/rest/services/LandMark/comm_analysis/MapServer",
                type: 'dynamic',
                defaultLayers: [0,1], //[1,2,3,4]
                visible: false
            },
            'landTenure': {
                url: landTenureURL,
                type: 'dynamic',
                // Not all the layers are present in the tree, when they are, include 0 - 9
                defaultLayers: [-1], //[0,1,2,3,4,5,6,7,8,9]
                visible: true
            },

            // CommunityLevel
            'indigenous_FormalClaim': {
                url: community_indigenous_FormalClaim,
                type: 'dynamic',
                minZoom: 2315000,
                defaultLayers: [0,1],
                visible: true
            },
            'indigenous_FormalClaimFeature': {
                url: community_indigenous_FormalClaim + '/1',
                type: 'feature',
                visible: true
            },
            'indigenous_FormalClaimFeaturePoint': {
                url: community_indigenous_FormalClaim + '/0',
                type: 'feature',
                visible: true
            },
            'indigenous_FormalDoc': {
                url: community_indigenous_FormalDoc,
                type: 'dynamic',
                minZoom: 2315000,
                defaultLayers: [0,1],
                visible: true
            },
            'indigenous_FormalDocFeature': {
                url: community_indigenous_FormalDoc + '/1',
                type: 'feature',
                visible: true
            },
            'indigenous_FormalDocFeaturePoint': {
                url: community_indigenous_FormalDoc + '/0',
                type: 'feature',
                visible: true
            },
            // 'indigenous_InProcess': {
            //     url: community_indigenous_InProcess,
            //     type: 'dynamic',
            //     minZoom: 2315000,
            //     defaultLayers: [0,1],
            //     visible: true
            // },
            // 'indigenous_InProcessFeature': {
            //     url: community_indigenous_InProcess + '/1',
            //     type: 'feature',
            //     visible: true
            // },
            // 'indigenous_InProcessFeaturePoint': {
            //     url: community_indigenous_InProcess + '/0',
            //     type: 'feature',
            //     visible: true
            // },
            'indigenous_NoDoc': {
                url: community_indigenous_NoDoc,
                type: 'dynamic',
                minZoom: 2315000,
                defaultLayers: [0,1],
                visible: true
            },
            'indigenous_NoDocFeature': {
                url: community_indigenous_NoDoc + '/1',
                type: 'feature',
                visible: true
            },
            'indigenous_NoDocFeaturePoint': {
                url: community_indigenous_NoDoc + '/0',
                type: 'feature',
                visible: true
            },
            'indigenous_Occupied': {
                url: community_indigenous_Occupied,
                type: 'dynamic',
                minZoom: 2315000,
                defaultLayers: [0,1],
                visible: true
            },
            'indigenous_OccupiedFeature': {
                url: community_indigenous_Occupied + '/1',
                type: 'feature',
                visible: true
            },
            'indigenous_OccupiedFeaturePoint': {
                url: community_indigenous_Occupied + '/0',
                type: 'feature',
                visible: true
            },
            'community_FormalClaim': {
                url: community_community_FormalClaim,
                type: 'dynamic',
                minZoom: 2315000,
                defaultLayers: [0,1],
                visible: true
            },
            'community_FormalClaimFeature': {
                url: community_community_FormalClaim + '/1',
                type: 'feature',
                visible: true
            },
            'community_FormalClaimFeaturePoint': {
                url: community_community_FormalClaim + '/0',
                type: 'feature',
                visible: true
            },
            'community_FormalDoc': {
                url: community_community_FormalDoc,
                type: 'dynamic',
                minZoom: 2315000,
                defaultLayers: [0,1],
                visible: true
            },
            'community_FormalDocFeature': {
                url: community_community_FormalDoc + '/1',
                type: 'feature',
                visible: true
            },
            'community_FormalDocFeaturePoint': {
                url: community_community_FormalDoc + '/0',
                type: 'feature',
                visible: true
            },
            // 'community_InProcess': {
            //     url: community_community_InProcess,
            //     type: 'dynamic',
            //     minZoom: 2315000,
            //     defaultLayers: [0,1],
            //     visible: true
            // },
            // 'community_InProcessFeature': {
            //     url: community_community_InProcess + '/1',
            //     type: 'feature',
            //     visible: true
            // },
            // 'community_InProcessFeaturePoint': {
            //     url: community_community_InProcess + '/0',
            //     type: 'feature',
            //     visible: true
            // },
            'community_NoDoc': {
                url: community_community_NoDoc,
                type: 'dynamic',
                minZoom: 2315000,
                defaultLayers: [0,1],
                visible: true
            },
            'community_NoDocFeature': {
                url: community_community_NoDoc + '/1',
                type: 'feature',
                visible: true
            },
            'community_NoDocFeaturePoint': {
                url: community_community_NoDoc + '/0',
                type: 'feature',
                visible: true
            },
            'community_Occupied': {
                url: community_community_Occupied,
                type: 'dynamic',
                minZoom: 2315000,
                defaultLayers: [0,1],
                visible: true
            },
            'community_OccupiedFeature': {
                url: community_community_Occupied + '/1',
                type: 'feature',
                visible: true
            },
            'community_OccupiedFeaturePoint': {
                url: community_community_Occupied + '/0',
                type: 'feature',
                visible: true
            },
            'indigenous_FormalClaim_Tiled': {
                url: community_indigenous_FormalClaim,
                type: 'tiled',
                defaultLayers: [0,1],
                visible: true
            },
            'indigenous_FormalDoc_Tiled': {
                url: community_indigenous_FormalDoc,
                type: 'tiled',
                defaultLayers: [0,1],
                visible: true
            },
            // 'indigenous_InProcess_Tiled': {
            //     url: community_indigenous_InProcess,
            //     type: 'tiled',
            //     defaultLayers: [0,1],
            //     visible: true
            // },
            'indigenous_NoDoc_Tiled': {
                url: community_indigenous_NoDoc,
                type: 'tiled',
                defaultLayers: [0,1],
                visible: true
            },
            'indigenous_Occupied_Tiled': {
                url: community_indigenous_Occupied,
                type: 'tiled',
                defaultLayers: [0,1],
                visible: true
            },
            'community_FormalClaim_Tiled': {
                url: community_community_FormalClaim,
                type: 'tiled',
                defaultLayers: [0,1],
                visible: true
            },
            'community_FormalDoc_Tiled': {
                url: community_community_FormalDoc,
                type: 'tiled',
                defaultLayers: [0,1],
                visible: true
            },
            // 'community_InProcess_Tiled': {
            //     url: community_community_InProcess,
            //     type: 'tiled',
            //     defaultLayers: [0,1],
            //     visible: true
            // },
            'community_NoDoc_Tiled': {
                url: community_community_NoDoc,
                type: 'tiled',
                defaultLayers: [0,1],
                visible: true
            },
            'community_Occupied_Tiled': {
                url: community_community_Occupied,
                type: 'tiled',
                defaultLayers: [0,1],
                visible: true
            },


            // 'indigenousLands': {
            //     url: indigenousLandsUrl,
            //     type: 'dynamic',
            //     // Not all the layers are present in the tree, when they are, include 0 - 9
            //     defaultLayers: [1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14], //[0,1,2,3,4,5,6,7,8,9]
            //     visible: true
            // },

            'CustomFeatures': {
                type: 'graphic',
                infoTemplate: {
                    content: "<table><tr><td>Unique ID:</td><td>${WRI_ID:checkAvailable}</td></tr></table>"
                }
            }
        },

        geometryServiceURL: "http://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer",


        // If adding content to the tree, the ID must be unique and present, and the label must be present
        // Other Options
        // children: array of children objects
        // checked: true/false, default checked of the checkbox, default is false
        // collapsed: true/false, default state of the node containing children, default is false
        // disabled: true/false, should the node be disabled or not, default is false
        // noCheckbox: true/false, should there be a checkbox on this tree node

        communityLevelLayers: [{
            label: 'Acknowledged by government',
            isCategory: true,
            group: 'indigenousLands'
          },
          {
            label: 'Documented',
            id: 'indigenous_FormalDoc',
            checked: true,
            group: 'indigenousLands'
          },
          // {
          //   label: 'In process of documentation',
          //   id: 'indigenous_InProcess',
          //   checked: true,
          //   group: 'indigenousLands'
          // },
          {
            label: 'Not documented',
            id: 'indigenous_NoDoc',
            checked: true,
            group: 'indigenousLands'
          },
          {
            label: 'Not acknowledged by government',
            isCategory: true,
            group: 'indigenousLands'
          },
          {
            label: 'Held or used with formal land claim submitted',
            id: 'indigenous_FormalClaim',
            checked: true,
            group: 'indigenousLands'
          },
          {
            label: 'Held or used under customary tenure',
            id: 'indigenous_Occupied',
            checked: true,
            group: 'indigenousLands'
          },
          {
            label: 'Acknowledged by government',
            isCategory: true,
            group: 'communityLands'
          },
          {
            label: 'Documented',
            id: 'community_FormalDoc',
            checked: true,
            group: 'communityLands'
          },
          // {
          //   label: 'In process of documentation',
          //   id: 'community_InProcess',
          //   checked: true,
          //   group: 'communityLands'
          // },
          {
            label: 'Not documented',
            id: 'community_NoDoc',
            checked: true,
            group: 'communityLands'
          },
          {
            label: 'Not acknowledged by government',
            isCategory: true,
            group: 'communityLands'
          },
          {
            label: 'Held or used with formal land claim submitted',
            id: 'community_FormalClaim',
            checked: true,
            group: 'communityLands'
          },
          {
            label: 'Held or used under customary tenure',
            id: 'community_Occupied',
            checked: true,
            group: 'communityLands'
        }],

        // communityLevelTreeData: [{
        //     label: 'Indigenous Lands (self recognized)',
        //     id: 'indigenousLands',
        //     checked: true,
        //     noCheckbox: false,
        //     info: indigenousLandsInfo,
        //     children: [{
        //         label: 'Officially recognized (by law or decree)',
        //         id: 'indigenousOfficial',
        //         checked: true,
        //         children: [{
        //             label: 'Formal Document/Title',
        //             id: 'indigenousFormalTitle',
        //             checked: true
        //         }, {
        //             label: 'In process of titling',
        //             id: 'indigenousInProcess',
        //             checked: true
        //         }]
        //     }, {
        //         label: 'Not officially recognized',
        //         id: 'indigenousUnofficial',
        //         checked: true,
        //         children: [{
        //             label: 'Formal land claim',
        //             id: 'indigenousLandClaim',
        //             checked: true
        //         }, {
        //             label: 'Occupied/used without formal land claim',
        //             id: 'indigenousNoLandClaim',
        //             checked: true
        //         }]
        //     }]
        // }, {
        //     label: 'Community Lands',
        //     id: 'communityLands',
        //     collapsed: false,
        //     info: landTenureSecurityInfo,
        //     checked: true,
        //     //disabled: true,
        //     children: [{
        //         label: 'Officially recognized (by law or decree)',
        //         id: 'communityOfficial',
        //         checked: true,
        //         children: [{
        //             label: 'Formal Document/Title',
        //             id: 'communityFormalTitle',
        //             checked: true
        //         }, {
        //             label: 'In process of titling',
        //             id: 'communityInProcess',
        //             checked: true
        //         }]
        //     }, {
        //         label: 'Not officially recognized',
        //         id: 'communityUnofficial',
        //         checked: true,
        //         children: [{
        //             label: 'Formal land claim',
        //             id: 'communityLandClaim',
        //             checked: true
        //         }, {
        //             label: 'Occupied/used without formal land claim',
        //             id: 'communityNoLandClaim',
        //             checked: true
        //         }]
        //     }]
        // }],


        landTenureCommunityLayers: [{
            label: 'AVERAGE SCORE',
            id: 'averageScoreTenure',
            question: "The average score for the 10 indicators of the legal security of community lands.",
            layer: 0
        }, {
        label: '1.	LEGAL STATUS ',
            id: 'legalStatusTenure',
            question: "Does the law recognize all rights that communities exercise over their lands as lawful forms of ownership?",
            layer: 1
        }, {
            label: '2.	LAND RIGHTS AND COMMON PROPERTY ',
            id: 'landRightsTenure',
            question: "Does the law give community land rights the same level of protection as the rights under other tenure systems?",
            layer: 1
        }, {
            label: '3.	FORMAL DOCUMENTATION ',
            id: 'formalDocTenure',
            question: "Does the law require the government to provide communities with a formal title and map to their land?",
            layer: 1
        }, {
            label: '4.	LEGAL PERSON',
            id: 'legalPersonTenure',
            question: "Does the law recognize the community as a legal person for the purposes of land ownership?",
            layer: 1
        }, {
            label: '5.	LEGAL AUTHORITY',
            id: 'legalAuthorityTenure',
            question: "Does the law recognize the community as the legal authority over the land?",
            layer: 1
        }, {
            label: '6.	PERPETUITY',
            id: 'perpetuityTenure',
            question: "Do the law and formal title recognize that community land rights may be held in perpetuity?",
            layer: 1
        }, {
            label: '7.	RIGHT TO CONSENT BEFORE LAND ACQUISITION',
            id: 'rightToConsentTenure',
            question: "Does the law require the consent of communities before government or an outsider may acquire their land?",
            layer: 1
        }, {
            label: '8.	RIGHTS TO TREES ',
            id: 'rightToTreesTenure',
            question: "Does the law explicitly recognize that community land includes the rights to all trees on the land?",
            layer: 1
        }, {
            label: '9.	RIGHTS TO WATER ',
            id: 'rightToWaterTenure',
            question: "Does the law explicitly recognize that community land includes the rights to local water sources on the land?",
            layer: 1
        }, {
            label: '10.	LAND RIGHTS IN PROTECTED AREAS',
            id: 'landRightsProtectedAreasTenure',
            question: "Does the law uphold community land rights in the ownership and governance of national parks and other protected areas?",
            layer: 1
        }, {
            label: 'NONE',
            id: 'none',
            layer: 0
        }], //, {
        //     label: 'Resource Rights: Sub-surface minerals',
        //     id: 'subsurfaceMinerals',
        //     question: "Are sub-surface minerals (i.e., not surface minerals) within community lands under community jurisdiction?",
        //     layer: 0
        // }, {
        //     label: 'Resource Rights: Oil and natural gas',
        //     id: 'oilAndGasTenure',
        //     question: "Are oil, natural gas and other forms of hydrocarbons within community lands under community jurisdiction?",
        //     layer: 0
        // }, {
        //     label: 'Right to consent',
        //     id: 'rightToConsent',
        //     question: "Is community consent required before an outside actor, including government, can acquire community land (excluding compulsory land acquisition)?",
        //     layer: 0
        // }, {
        //     label: 'Land acquisition',
        //     id: 'landAcquisition',
        //     question: "Is an outside actor, including government, required to prove that sought land is not claimed or registered as community land?",
        //     layer: 0
        // }, {
        //     label: 'Cadaster obligation',
        //     id: 'cadasterObligation',
        //     question: "Must government develop an official map of all legal tenure types, including community land?",
        //     layer: 0
        // }, {
        //     label: 'Dispute resolution mechanism',
        //     id: 'disputeMechanism',
        //     question: "Are dispute resolution mechanisms established for land conflicts with actors outside the community?",
        //     layer: 0
        // }, {
        //     label: 'Equal Rights to Land: Women',
        //     id: 'womenEqualLand',
        //     question: "Are land interests of women community members equally protected?",
        //     layer: 0
        // }, {
        //     label: 'Equal Rights to Land: New Members',
        //     id: 'newMembersEqualLand',
        //     question: "Are land interests of people joining the community by marriage, settlement or other customarily-approved means equally protected?",
        //     layer: 0
        // }, {
        //     label: 'Equal Rights to Land: Minorities',
        //     id: 'minoritiesEqualLand',
        //     question: "Are land interests of minorities by virtue of ethnicity, livelihood or other distinctive attribute equally protected?",
        //     layer: 0
        // }],

        landTenureIndigenousLayers: [{
          label: 'AVERAGE SCORE',
          id: 'averageScoreTenure',
          question: "The average score for the 10 indicators of the legal security of indigenous lands.",
          layer: 2
        }, {
        label: '1.	LEGAL STATUS ',
            id: 'legalStatusTenure',
            question: "Does the law recognize all rights that Indigenous peoples exercise over their lands as lawful forms of ownership?",
            layer: 3
        }, {
            label: '2.	LAND RIGHTS AND COMMON PROPERTY ',
            id: 'landRightsTenure',
            question: "Does the law give indigenous land rights the same level of protection as the rights under other tenure systems?",
            layer: 3
        }, {
            label: '3.	FORMAL DOCUMENTATION ',
            id: 'formalDocTenure',
            question: "Does the law require the government to provide Indigenous peoples with a formal title and map to their land?",
            layer: 3
        }, {
            label: '4.	LEGAL PERSON',
            id: 'legalPersonTenure',
            question: "Does the law recognize Indigenous peoples as a legal person for the purposes of land ownership?",
            layer: 3
        }, {
            label: '5.	LEGAL AUTHORITY',
            id: 'legalAuthorityTenure',
            question: "Does the law recognize Indigenous peoples as the legal authority over the land?",
            layer: 3
        }, {
            label: '6.	PERPETUITY',
            id: 'perpetuityTenure',
            question: "Do the law and formal title recognize that indigenous land rights may be held in perpetuity?",
            layer: 3
        }, {
            label: '7.	RIGHT TO CONSENT BEFORE LAND ACQUISITION',
            id: 'rightToConsentTenure',
            question: "Does the law require the consent of Indigenous peoples before government or an outsider may acquire their land?",
            layer: 3
        }, {
            label: '8.	RIGHTS TO TREES ',
            id: 'rightToTreesTenure',
            question: "Does the law explicitly recognize that indigenous land includes the rights to all trees on the land?",
            layer: 3
        }, {
            label: '9.	RIGHTS TO WATER ',
            id: 'rightToWaterTenure',
            question: "Does the law explicitly recognize that indigenous land includes the rights to local water sources on the land?",
            layer: 3
        }, {
            label: '10.	LAND RIGHTS IN PROTECTED AREAS',
            id: 'landRightsProtectedAreasTenure',
            question: "Does the law uphold indigenous land rights in the ownership and governance of national parks and other protected areas?",
            layer: 3
        }, {
            label: 'NONE',
            id: 'none',
            layer: -1
        }],


        percentIndigenousLayersCombined: [{
          label: 'Traditional or Customary Rights',
          id: 'percentIndigAndCommunity',
          subTitle: true
        }, {
          label: 'Acknowledged by government',
          id: 'combinedFormal',
          question: false,
          layer: 2,
          subLayer: true
        }, {
          label: 'Not acknowledged by government',
          id: 'combinedInformal',
          question: false,
          layer: 3,
          subLayer: true
        }, {
          label: 'Total',
          id: 'combinedTotal',
          question: false,
          layer: 1,
          subLayer: true
        }, {
          label: 'None',
          id: 'none',
          question: false,
          layer: -1,
          subLayer: true
        }
        // ,
        // {
        //   label: 'Indigenous Lands (only) - Coming soon',
        //   id: 'percentIndigNational',
        //   subTitle: true,
        //   comingSoon: true
        // },
        // {
        //   label: 'Total',
        //   id: 'indigTotal',
        //   question: false,
        //   layer: 5,
        //   subLayer: true,
        //   comingSoon: true
        // }, {
        //   label: 'Formally recognized',
        //   id: 'indigFormal',
        //   question: false,
        //   layer: 6,
        //   subLayer: true,
        //   comingSoon: true
        // }, {
        //   label: 'Not formally recognized',
        //   id: 'indigInformal',
        //   question: false,
        //   layer: 7,
        //   subLayer: true,
        //   comingSoon: true
        // }, {
        //   label: 'Community Lands (only) - Coming soon',
        //   id: 'percentNonIndigenous',
        //   subTitle: true,
        //   comingSoon: true
        // }, {
        //   label: 'Total',
        //   id: 'commTotal',
        //   question: false,
        //   layer: 9,
        //   subLayer: true,
        //   comingSoon: true
        // }, {
        //   label: 'Formally recognized',
        //   id: 'commFormal',
        //   question: false,
        //   layer: 10,
        //   subLayer: true,
        //   comingSoon: true
        // }, {
        //   label: 'Not formally recognized',
        //   id: 'commInformal',
        //   question: false,
        //   layer: 11,
        //   subLayer: true,
        //   comingSoon: true
        // }
      ],
        // Only leafs in the tree should control any layers, use blank arrays for any branch or root nodes
        layerMapping: {
            'indigenousLands': [],
            'indigenousOfficial': [],
            'indigenousUnofficial': [],
            'indigenousFormalTitle': [1, 6],
            'indigenousInProcess': [2, 7],
            'indigenousLandClaim': [3, 8],
            'indigenousNoLandClaim': [4, 9],
            'communityLands': [],
            'communityOfficial': [],
            'communityUnofficial': [],
            'communityFormalTitle': [11],
            'communityInProcess': [12],
            'communityLandClaim': [13],
            'communityNoLandClaim': [14]

        }

        // layerMappingCommunityLans: { //Add these arrays to layerMapping above
        //     'communityLands': [6, 7, 8, 9],
        //     'communityOfficial': [6, 7],
        //     'communityUnofficial': [8, 9],
        //     'communityFormalTitle': [6],
        //     'communityInProcess': [7],
        //     'communityLandClaim': [8]
        // }
    };

    return MapConfig;

});
