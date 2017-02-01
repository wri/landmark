/** @jsx React.DOM */
define([
  'react',
  'dojo/topic',
  'map/MapConfig',
  'map/WidgetsController'
], function (React, topic, MapConfig, WidgetsController) {
  'use strict';


  var MobileFooter = React.createClass({

    toggleTree: function() {
      WidgetsController.toggleMobileTree();
    },

    toggleSearch: function() {
      WidgetsController.toggleMobileSearch();
    },

    toggleAnalysis: function() {
      var customGraphics = brApp.map.getLayer("CustomFeatures");
      WidgetsController.showAnalysisDialog(customGraphics);
    },

    toggleCountry: function() {
      WidgetsController.toggleMobileCountrySearch();
    },

    render: function () {

      return (
        <div className='mobile-footer-container'>
          <div className='mobile-footer-child' onClick={this.toggleTree}>
            <div>
              Layer
            </div>
          </div>
          <div className='mobile-footer-child' onClick={this.toggleCountry}>
            <div>
              Country
            </div>
          </div>
          <div className='mobile-footer-child' onClick={this.toggleSearch}>
            <div>
              Search
            </div>
          </div>
          <div className='mobile-footer-child' onClick={this.toggleAnalysis}>
            <div>
              Analyze
            </div>
          </div>
        </div>
      );
    }

  });

  return function (node) {
    return React.render(<MobileFooter />, document.getElementById(node));
  };

});
