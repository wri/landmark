define([], function() {
    'use strict';

    var config = {

        corsEnabledServers: ["utility.arcgisonline.com"],

        defaultState: {
            x: -102.46,
            y: 13.47,
            l: 3 //,
            //lyrs: 'Active_Fires'
        },

        portalGenerateFeaturesURL: 'http://www.arcgis.com/sharing/rest/content/features/generate',

        printUrl: 'http://gis.wri.org/arcgis/rest/services/ExportWebMap/GPServer/Export%20Web%20Map',

        // Launch Button to Close Dialog added in Code
        // welcomeDialogContent: "<h2 class='launch-dialog-title'>About Global Map of Indigenous and Community Lands</h2>" +
        //     "<p class='launch-dialog-subtitle'>A partnership convened by the Instituto del Bien Comun and the World" +
        //     "Resources Institute in collaboration with numerous other organizations.</p>" +
        //     "<p class='launch-dialog-content'>Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam" +
        //     " varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris." +
        //     " Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis" +
        //     " risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt" +
        //     " sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi." +
        //     " Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet," +
        //     " felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu.</p>"

        welcomeDialogContent: "<div style='font-size:14px;'><p class='launch-dialog-content'>LandMark is a work in progress. New maps and information are continuously added to the platform, but many gaps remain. <span class='introTextStrong'>Note that the absence of data does not indicate the absence of indigenous or community land.</span> Please help us to improve the completeness of the platform by sharing your information on indigenous and community lands (<a class='introTextTitle' href='./contact-us/' target='_blank'>Contact Us</a>).</p></div>"
    };

    return config;

});
