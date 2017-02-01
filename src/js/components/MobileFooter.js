/** @jsx React.DOM */
define([
  'react',
  'dojo/topic',
  'map/MapConfig',
  'map/WidgetsController'
], function (React, topic, MapConfig, WidgetsController) {
  'use strict';


  var MobileFooter = React.createClass({displayName: "MobileFooter",

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
        React.createElement("div", {className: "mobile-footer-container"}, 
          React.createElement("div", {className: "mobile-footer-child", onClick: this.toggleTree}, "Layer"), 
          React.createElement("div", {className: "mobile-footer-child", onClick: this.toggleCountry}, "Country"), 
          React.createElement("div", {className: "mobile-footer-child", onClick: this.toggleSearch}, "Search"), 
          React.createElement("div", {className: "mobile-footer-child", onClick: this.toggleAnalysis}, "Analyze")
        )
      );
    }

  });

  return function (node) {
    return React.render(React.createElement(MobileFooter, null), document.getElementById(node));
  };

});
