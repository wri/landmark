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
          <div className='mobile-footer-child' onClick={this.toggleTree} >Layer</div>
          <div className='mobile-footer-child' onClick={this.toggleCountry} >Country</div>
          <div className='mobile-footer-child' onClick={this.toggleSearch} >Search</div>
          <div className='mobile-footer-child' onClick={this.toggleAnalysis} >Analyze</div>
        </div>
      );
    }

  });

  return function (node) {
    return React.render(<MobileFooter />, document.getElementById(node));
  };

});
