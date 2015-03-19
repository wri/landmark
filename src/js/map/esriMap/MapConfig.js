define(["esri/InfoTemplate"], function(InfoTemplate) {

    // var indigenousLandsUrl = 'http://gis-stage.wri.org/arcgis/rest/services/CommunityLands/CommunityLands/MapServer';
    var indigenousLandsUrl = 'http://gis-stage.wri.org/arcgis/rest/services/IndigenousCommunityLands/CommunityLevel/MapServer';

    var nationalLevelUrl = 'http://gis-stage.wri.org/arcgis/rest/services/IndigenousCommunityLands/NationalLevel/MapServer';

    var indigenousLandsInfo = "Placeholder so this layer's info icon appears in the tree";
    var landTenureSecurityInfo = "Placeholder so this layer's info icon appears in the tree";

    var MapConfig = {

        // nationalLevelInfoTemplatePercent: new InfoTemplate(item.value,
        //     "<div class='odd-row'><div class='popup-header'>Percent of Country Area Held or Used by Indigenous Peoples and Communities</div>" + item.feature.attributes['Percent Indigenous and Community Land'] + "% (" + item.feature.attributes['Contributor of % Community Lands Data'] + ", " + item.feature.attributes['Year of Pct Indigenous & Community Lands Data'] + ")</div>" +
        //     "<div class='even-row'><div class='popup-header'>Percent of Country Area Held or Used by Indigenous Peoples</div>" + item.feature.attributes['Percent of Indigenous Lands'] + "% (" + item.feature.attributes['Contributor of Percent Indigenous Lands Data'] + ", " + item.feature.attributes['Year of Pct Indigenous Lands Data'] + ")</div>" +
        //     "<div class='odd-row'><div class='popup-header'>Percent of Country Area Held or Used by Communities (Non-Indigenous)</div>" + item.feature.attributes['Percent Community Lands'] + "% (" + item.feature.attributes['Contributor of % Community Lands Data'] + ", " + item.feature.attributes['Year of % Community Lands Data'] + ")</div>" +
        //     "<div class='popup-last'>Last Updated: " + item.feature.attributes['Date of Last Update'] + '<span id="additionalInfo"> Additional Info</span></div>'

        // ),

        options: {
            sliderPosition: 'top-right',
            basemap: 'gray',
            centerX: -19,
            centerY: 19,
            zoom: 3
        },

        layers: {
            'indigenousLands': {
                url: indigenousLandsUrl,
                type: 'dynamic',
                // Not all the layers are present in the tree, when they are, include 0 - 9
                defaultLayers: [0, 1, 2, 3, 4], //[0,1,2,3,4,5,6,7,8,9]
                visible: true
            },
            // 'communityLands': {
            //     url: indigenousLandsUrl,
            //     type: 'dynamic',
            //     defaultLayers: [5, 6, 7, 8, 9], //[0,1,2,3,4,5,6,7,8,9]
            //     visible: true
            // },
            'nationalLevel': {
                url: nationalLevelUrl,
                type: 'dynamic',
                defaultLayers: [], //[1,2,3,4]
                // infoTemplate: {
                //     title: "${Country}",
                //     content: "<div class='odd-row'><div class='popup-header'>Percent of Country Area Held or Used by Indigenous Peoples and Communities</div>${Country}</div>"
                // }
                visible: true
            },
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
        communityLevelTreeData: [{
            label: 'Indigenous Lands (self recognized)',
            id: 'indigenousLands',
            checked: true,
            info: indigenousLandsInfo,
            children: [{
                label: 'Officially recognized (by law or decree)',
                id: 'indigenousOfficial',
                checked: true,
                children: [{
                    label: 'Formal Document/Title',
                    id: 'indigenousFormalTitle',
                    checked: true
                }, {
                    label: 'In process of titling',
                    id: 'indigenousInProcess',
                    checked: true
                }]
            }, {
                label: 'Not officially recognized',
                id: 'indigenousUnofficial',
                checked: true,
                children: [{
                    label: 'Formal land claim',
                    id: 'indigenousLandClaim',
                    checked: true
                }, {
                    label: 'Occupied/used without formal land claim',
                    id: 'indigenousNoLandClaim',
                    disabled: true
                }]
            }]
        }, {
            label: 'Community Lands',
            id: 'communityLands',
            collapsed: true,
            disabled: true,
            children: [{
                label: 'Officially recognized (by law or decree)',
                id: 'communityOfficial',
                children: [{
                    label: 'Formal Document/Title',
                    id: 'communityFormalTitle'
                }, {
                    label: 'In process of titling',
                    id: 'communityInProcess'
                }]
            }, {
                label: 'Not officially recognized',
                id: 'communityUnofficial',
                children: [{
                    label: 'Formal land claim',
                    id: 'communityLandClaim'
                }, {
                    label: 'Occupied/used without formal land claim',
                    id: 'communityNoLandClaim'
                }]
            }]
        }],


        landTenureCommunityLayers: [
            {
                label: 'Legal Force',
                id: 'legalForceTenure',
                question: "Do community land rights, including customary rights, have the same legal force as statutory rights?"

            }, {
                label: 'Perpetuity',
                id: 'perpetuityTenure',
                question: "Are community land rights - customary and statutory - perpetual (i.e., not just for a fixed term)?"

            }, {
                label: 'Common Property',
                id: 'commonPropertyTenure',
                question: "Does government recognize all community land, including homesteads, family farms and common property (e.g., forests, pasture)?"

            }, {
                label: 'Unregistered Land',
                id: 'unregisteredTenure',
                question: "Does government recognize community land rights even if not formally demarcated or registered?"

            }, {
                label: 'Registration Procedures',
                id: 'registrationTenure',
                question: "Are there established procedures for formally registering community land rights in a public registry?"

            }, {
                label: 'Self-governance',
                id: 'selfGovernanceTenure',
                question: "Are community institutions - traditional or modern - recognized as the legal authority over community lands?"

            }, {
                label: 'Trees and forests',
                id: 'treesForestsRights',
                question: "Are trees and forests within community lands under community jurisdiction?"
            }, {
                label: 'Waters',
                id: 'watersRights',
                question: "Are waters (including groundwater, rivers and natural water bodies) within community lands under community jurisdiction?"
            }, {
                label: 'Wildlife',
                id: 'wildlifeRights',
                question: "Are wildlife (i.e., wild animals) within community lands under community jurisdiction?"
            }, {
                label: 'Sub-surface minerals',
                id: 'subsurfaceMinerals',
                question: "Are sub-surface minerals (i.e., not surface minerals) within community lands under community jurisdiction?"
            }, {
                label: 'Oil and natural gas',
                id: 'oilAndGasTenure',
                question: "Are oil, natural gas and other forms of hydrocarbons within community lands under community jurisdiction?"
            }, {
                label: 'Right to consent',
                id: 'rightToConsent',
                question: "Is community consent required before an outside actor, including government, can acquire community land (excluding compulsory land acquisition)?"
            }, {
                label: 'Land acquisition',
                id: 'landAcquisition',
                question: "Is an outside actor, including government, required to prove that sought land is not claimed or registered as community land?"
            }, {
                label: 'Cadaster obligation',
                id: 'cadasterObligation',
                question: "Must government develop an official map of all legal tenure types, including community land?"
            }, {
                label: 'Dispute resolution mechanism',
                id: 'disputeMechanism',
                question: "Are dispute resolution mechanisms established for land conflicts with actors outside the community?"
            }, {
                label: 'Equal Rights to Land: Women',
                id: 'womenEqualLand',
                question: "Are land interests of women community members equally protected?"
            }, {
                label: 'Equal Rights to Land: New Members',
                id: 'newMembersEqualLand',
                question: "Are land interests of people joining the community by marriage, settlement or other customarily-approved means equally protected?"
            }, {
                label: 'Equal Rights to Land: Minorities',
                id: 'minoritiesEqualLand',
                question: "Are land interests of minorities by virtue of ethnicity, livelihood or other distinctive attribute equally protected?"
            }
        ],

        landTenureIndigenousLayers: [
            {
                label: 'Legal Force',
                id: 'legalForceTenure',
                question: "Do indigenous land rights, including customary rights, have the same legal force as statutory rights?"
            }, {
                label: 'Perpetuity',
                id: 'perpetuityTenure',
                question: "Are indigenous land rights - customary and statutory - perpetual (i.e., not just for a fixed term)?"

            }, {
                label: 'Common Property',
                id: 'commonPropertyTenure',
                question: "Does government recognize all indigenous land, including homesteads, family farms and common property (e.g., forests, pasture)?"

            }, {
                label: 'Unregistered Land',
                id: 'unregisteredTenure',
                question: "Does government recognize indigenous land rights even if not formally demarcated or registered?"

            }, {
                label: 'Registration Procedures',
                id: 'registrationTenure',
                question: "Are there established procedures for formally registering indigenous land rights in a public registry?"

            }, {
                label: 'Self-governance',
                id: 'selfGovernanceTenure',
                question: "Are indigenous institutions - traditional or modern - recognized as the legal authority over indigenous lands?"

            }, {
                label: 'Resource Rights: Trees and forests',
                id: 'treesForestsRights',
                question: false
            }, {
                label: 'Resource Rights: Waters',
                id: 'watersRights',
                question: "Are waters (including groundwater, rivers and natural water bodies) within community lands under community jurisdiction?"
            }, {
                label: 'Resource Rights: Wildlife',
                id: 'wildlifeRights',
                question: "Are wildlife (i.e., wild animals) within indigenous lands under indigenous jurisdiction?"
            }, {
                label: 'Sub-surface minerals',
                id: 'subsurfaceMinerals',
                question: "Are sub-surface minerals (i.e., not surface minerals)  within indigenous lands under indigenous jurisdiction?"
            }, {
                label: 'Oil and natural gas',
                id: 'unregisteredTenure',
                question: "Are oil, natural gas and other forms of hydrocarbons  within indigenous lands under indigenous jurisdiction?"
            }, {
                label: 'Right to consent',
                id: 'rightToConsent',
                question: "Is consent of the indigenous group required before an outside actor, including government, can acquire indigenous land (excluding compulsory land acquisition)?"
            }, {
                label: 'Land acquisition',
                id: 'landAcquisition',
                question: "Is an outside actor, including government, required to prove that sought land is not claimed or registered as indigenous land?"
            }, {
                label: 'Cadaster obligation',
                id: 'cadasterObligation',
                question: "Must government develop an official map of all legal tenure types, including indigenous land?"
            }, {
                label: 'Dispute resolution mechanism',
                id: 'disputeMechanism',
                question: "Are dispute resolution mechanisms established for land conflicts with actors outside the indigenous group?"
            }, {
                label: 'Equal Rights to Land: Women',
                id: 'womenEqualLand',
                question: "Are land interests of women indigenous members equally protected?"
            }, {
                label: 'Equal Rights to Land: New Members',
                id: 'newMembersEqualLand',
                question: "Are land interests of people joining the indigenous community by marriage, settlement or other customarily-approved means equally protected?"
            }, {
                label: 'Equal Rights to Land: Minorities',
                id: 'minoritiesEqualLand',
                question: "Are land interests of minorities by virtue of ethnicity, livelihood or other distinctive attribute equally protected?"
            }
        ],





        /* OLD MAY BE ABLE TO DELETE SOON BELOW */

        nationalLevelTreeData: [{
            label: 'Indicators of Community Land Tenure Security, as Stated by Law:',
            id: 'tenureSecurityLandsCommunity',
            checked: true,
            info: landTenureSecurityInfo,
            children: [{
                label: 'Legal Force',
                id: 'legalForceTenure',
                question: "Do community land rights, including customary rights, have the same legal force as statutory rights?"

            }, {
                label: 'Perpetuity',
                id: 'perpetuityTenure',
                question: "Are community land rights - customary and statutory - perpetual (i.e., not just for a fixed term)?"

            }, {
                label: 'Common Property',
                id: 'commonPropertyTenure',
                question: "Does government recognize all community land, including homesteads, family farms and common property (e.g., forests, pasture)?"

            }, {
                label: 'Unregistered Land',
                id: 'unregisteredTenure',
                question: "Does government recognize community land rights even if not formally demarcated or registered?"

            }, {
                label: 'Registration Procedures',
                id: 'registrationTenure',
                question: "Are there established procedures for formally registering community land rights in a public registry?"

            }, {
                label: 'Self-governance',
                id: 'selfGovernanceTenure',
                question: "Are community institutions - traditional or modern - recognized as the legal authority over community lands?"

            }, {
                // label: 'Resource Rights',
                // id: 'resourceRightsTenure',
                // checked: false,
                // children: [{
                label: 'Trees and forests',
                id: 'treesForestsRights',
                question: "Are trees and forests within community lands under community jurisdiction?"
            }, {
                label: 'Waters',
                id: 'watersRights',
                question: "Are waters (including groundwater, rivers and natural water bodies) within community lands under community jurisdiction?"
            }, {
                label: 'Wildlife',
                id: 'wildlifeRights',
                question: "Are wildlife (i.e., wild animals) within community lands under community jurisdiction?"
                // }]
            }, {
                label: 'Sub-surface minerals',
                id: 'subsurfaceMinerals',
                question: "Are sub-surface minerals (i.e., not surface minerals) within community lands under community jurisdiction?"
            }, {
                label: 'Oil and natural gas',
                id: 'oilAndGasTenure',
                question: "Are oil, natural gas and other forms of hydrocarbons within community lands under community jurisdiction?"
            }, {
                label: 'Right to consent',
                id: 'rightToConsent',
                question: "Is community consent required before an outside actor, including government, can acquire community land (excluding compulsory land acquisition)?"
            }, {
                label: 'Land acquisition',
                id: 'landAcquisition',
                question: "Is an outside actor, including government, required to prove that sought land is not claimed or registered as community land?"
            }, {
                label: 'Cadaster obligation',
                id: 'cadasterObligation',
                question: "Must government develop an official map of all legal tenure types, including community land?"
            }, {
                label: 'Dispute resolution mechanism',
                id: 'disputeMechanism',
                question: "Are dispute resolution mechanisms established for land conflicts with actors outside the community?"
            }, {
                label: 'Equal Rights to Land',
                id: 'equalRightsLand',
                question: false,
                children: [{
                    label: 'Women',
                    id: 'womenEqualLand',
                    question: "Are land interests of women community members equally protected?"
                }, {
                    label: 'New Members',
                    id: 'newMembersEqualLand',
                    question: "Are land interests of people joining the community by marriage, settlement or other customarily-approved means equally protected?"
                }, {
                    label: 'Minorities',
                    id: 'minoritiesEqualLand',
                    question: "Are land interests of minorities by virtue of ethnicity, livelihood or other distinctive attribute equally protected?"
                }]
            }]
        }],

        nationalLevelTreeDataIndigenous: [{
            label: 'Indicators of Indigenous Land Tenure Security, as Stated by Law:',
            id: 'tenureSecurityLandsIndigenous',
            question: false,
            info: landTenureSecurityInfo,
            children: [{
                label: 'Legal Force',
                id: 'legalForceTenure',
                question: "Do indigenous land rights, including customary rights, have the same legal force as statutory rights?"
            }, {
                label: 'Perpetuity',
                id: 'perpetuityTenure',
                question: "Are indigenous land rights - customary and statutory - perpetual (i.e., not just for a fixed term)?"

            }, {
                label: 'Common Property',
                id: 'commonPropertyTenure',
                question: "Does government recognize all indigenous land, including homesteads, family farms and common property (e.g., forests, pasture)?"

            }, {
                label: 'Unregistered Land',
                id: 'unregisteredTenure',
                question: "Does government recognize indigenous land rights even if not formally demarcated or registered?"

            }, {
                label: 'Registration Procedures',
                id: 'registrationTenure',
                question: "Are there established procedures for formally registering indigenous land rights in a public registry?"

            }, {
                label: 'Self-governance',
                id: 'selfGovernanceTenure',
                question: "Are indigenous institutions - traditional or modern - recognized as the legal authority over indigenous lands?"

            }, {
                label: 'Resource Rights',
                id: 'resourceRightsTenure',
                question: "Are the following natural resources within indigenous lands under indigenous jurisdiction?",
                children: [{
                    label: 'Trees and forests',
                    id: 'treesForestsRights',
                    question: false
                }, {
                    label: 'Waters',
                    id: 'watersRights',
                    question: "Are waters (including groundwater, rivers and natural water bodies) within community lands under community jurisdiction?"
                }, {
                    label: 'Wildlife',
                    id: 'wildlifeRights',
                    question: "Are wildlife (i.e., wild animals) within indigenous lands under indigenous jurisdiction?"
                }]
            }, {
                label: 'Sub-surface minerals',
                id: 'subsurfaceMinerals',
                question: "Are sub-surface minerals (i.e., not surface minerals)  within indigenous lands under indigenous jurisdiction?"
            }, {
                label: 'Oil and natural gas',
                id: 'unregisteredTenure',
                question: "Are oil, natural gas and other forms of hydrocarbons  within indigenous lands under indigenous jurisdiction?"
            }, {
                label: 'Right to consent',
                id: 'rightToConsent',
                question: "Is consent of the indigenous group required before an outside actor, including government, can acquire indigenous land (excluding compulsory land acquisition)?"
            }, {
                label: 'Land acquisition',
                id: 'landAcquisition',
                question: "Is an outside actor, including government, required to prove that sought land is not claimed or registered as indigenous land?"
            }, {
                label: 'Cadaster obligation',
                id: 'cadasterObligation',
                question: "Must government develop an official map of all legal tenure types, including indigenous land?"
            }, {
                label: 'Dispute resolution mechanism',
                id: 'disputeMechanism',
                question: "Are dispute resolution mechanisms established for land conflicts with actors outside the indigenous group?"
            }, {
                label: 'Equal Rights to Land',
                id: 'equalRightsLand',
                question: false,
                children: [{
                    label: 'Women',
                    id: 'womenEqualLand',
                    question: "Are land interests of women indigenous members equally protected?"
                }, {
                    label: 'New Members',
                    id: 'newMembersEqualLand',
                    question: "Are land interests of people joining the indigenous community by marriage, settlement or other customarily-approved means equally protected?"
                }, {
                    label: 'Minorities',
                    id: 'minoritiesEqualLand',
                    question: "Are land interests of minorities by virtue of ethnicity, livelihood or other distinctive attribute equally protected?"
                }]
            }]
        }],

        nationalLevelPercentData: [{
            label: 'Indigenous Peoples and Communities',
            id: 'percentIndigAndCommunity',
            question: true
        }, {
            label: 'Indigenous Peoples only',
            id: 'percentIndigNational',
            question: false
        }, {
            label: 'Communities (Non-indigenous) only',
            id: 'percentNonIndigenous',
            question: false

        }],

        /* OLD MAY BE ABLE TO DELETE SOON ABOVE */

        layerMapping: {
            'indigenousLands': [1, 2, 3, 4],
            'indigenousOfficial': [1, 2],
            'indigenousUnofficial': [3, 4],
            'indigenousFormalTitle': [1],
            'indigenousInProcess': [2],
            'indigenousLandClaim': [3]
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