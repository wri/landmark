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
            <div className='footer-logo-container tree-logo-container'></div>
            <div className='footer-button-text'>
              Map Selection
            </div>
          </div>
          <div className='mobile-footer-child' onClick={this.toggleCountry}>
            <div className='footer-logo-container country-logo-container'></div>
            <div className='footer-button-text'>
              Country Profiles
            </div>
          </div>
          <div className='mobile-footer-child' onClick={this.toggleSearch}>
            <div className='footer-logo-container search-logo-container'></div>
            <div className='footer-button-text'>
              Search
            </div>
          </div>
          <div className='mobile-footer-child' onClick={this.toggleAnalysis}>
            <div className='footer-logo-container analysis-logo-container'></div>
            <div className='footer-button-text'>
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
