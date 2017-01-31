/** @jsx React.DOM */
define([
  'react',
  'dojo/topic',
  'map/MapConfig'
], function (React, topic, MapConfig) {
  'use strict';


  var MobileFooter = React.createClass({displayName: "MobileFooter",

    getInitialState: function () {

        return {

        };
      },

    close: function () {
      // this.setState({visible: false})
    },

    dataMapper: function(array) {
      return React.createElement("option", {value: array}, array);
    },

    render: function () {

      return (
        React.createElement("div", {className: "mobile-footer-container"}, 
          React.createElement("div", {className: "mobile-footer-child"}, "Layer"), 
          React.createElement("div", {className: "mobile-footer-child"}, "Country"), 
          React.createElement("div", {className: "mobile-footer-child"}, "Search"), 
          React.createElement("div", {className: "mobile-footer-child"}, "Analyze")
        )
      );
    }

  });

  return function (node) {
    return React.render(React.createElement(MobileFooter, null), document.getElementById(node));
  };

});
