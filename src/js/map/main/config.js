define([], function() {
    'use strict';

    var config = {

        corsEnabledServers: ["utility.arcgisonline.com"],

        defaultState: {
            x: -19,
            y: 19,
            l: 3 //,
            //lyrs: 'Active_Fires'
        },

        portalGenerateFeaturesURL: 'http://www.arcgis.com/sharing/rest/content/features/generate',

        // Launch Button to Close Dialog added in Code
        // welcomeDialogContent: "<h2 class='launch-dialog-title'>About Global Map of Indigenous and Community Lands</h2>" +
        //     "<p class='launch-dialog-subtitle'>A partnership covened by the Instituto del Bien Comun and the World" +
        //     "Resources Institute in collaboration with numerous other organizations.</p>" +
        //     "<p class='launch-dialog-content'>Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam" +
        //     " varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris." +
        //     " Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis" +
        //     " risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt" +
        //     " sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi." +
        //     " Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet," +
        //     " felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu.</p>"

        welcomeDialogContent: "<div style='font-size:14px;'><p class='launch-dialog-content'>The <i>Global Platform of Indigenous and Community Lands (Global Platform)</i> is a dynamic, online mapping tool that provides critical information on collective land and natural resource rights around the world. The <i>Global Platform</i> supports local livelihoods and well-being by increasing the visibility of indigenous and community lands, and presenting crucial information on the state of land rights. It provides indigenous peoples and communities with a way to show the world the land and resources that they hold and use, and to be proactive in responding to the growing threats they face.</p><p>The <i>Instituto del Bien Común</i> (IBC) and the World Resources Institute (WRI) have co-led the development of the <i>Global Platform</i> with guidance from a Steering Group that includes some of the world’s leading land rights organizations (see <i>About</i> page).  The <i>Global Platform</i> presents national and local level information, providing both an overview of collective land rights within each country and detailed information on the location and legal status of specific indigenous and communities lands.</p><p>We need your help to ensure that the <i>Global Platform</i> is current and comprehensive. The status of collective land rights and the state of indigenous and community lands can change when national laws and regulations are reformed, when communities map and demarcate their lands, and when indigenous peoples register their lands for formal recognition.</p><p>We call on individuals and organizations with first-hand knowledge of indigenous and community lands to help complete the <i>Global Platform</i>.  Many representatives of indigenous peoples and communities, civil society organizations, governments and researchers from around the world have contributed to the current database, but there remain many gaps. We encourage all users to explore the <i>Global Platform</i>, provide feedback on how to improve the tool, and, for those who hold data, work with us to add your information on indigenous and community lands (<i>Contact Us).</p></div>"
    };

    return config;

});