define([
    'main/config',
    'map/ReportController'
], function(AppConfig, ReportController) {

    var Main = {
      init: function() {
        this.launchApp();
      },

      launchApp: function() {
        ReportController.init();
      }
    };

    return Main;

});
