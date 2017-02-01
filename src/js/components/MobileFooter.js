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
          React.createElement("div", {className: "mobile-footer-child", onClick: this.toggleTree}, 
            React.createElement("div", {className: "footer-logo-container tree-logo-container"}), 
            React.createElement("div", {className: "footer-button-text"}, 
              "Layer"
            )
          ), 
          React.createElement("div", {className: "mobile-footer-child", onClick: this.toggleCountry}, 
            React.createElement("div", {className: "footer-logo-container country-logo-container"}), 
            React.createElement("div", {className: "footer-button-text"}, 
              "Country"
            )
          ), 
          React.createElement("div", {className: "mobile-footer-child", onClick: this.toggleSearch}, 
            React.createElement("div", {className: "footer-logo-container search-logo-container"}), 
            React.createElement("div", {className: "footer-button-text"}, 
              "Search"
            )
          ), 
          React.createElement("div", {className: "mobile-footer-child", onClick: this.toggleAnalysis}, 
            React.createElement("div", {className: "footer-logo-container analysis-logo-container"}), 
            React.createElement("div", {className: "footer-button-text"}, 
              "Analyze"
            )
          )
        )
      );
    }

  });

  return function (node) {
    return React.render(React.createElement(MobileFooter, null), document.getElementById(node));
  };

});
