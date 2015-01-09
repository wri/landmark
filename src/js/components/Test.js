/** @jsx React.DOM */
define([
  'react'
], function (React) {

  var Test = React.createClass({displayName: "Test",
    /* jshint ignore:start */
    
    render: function () {
      return (
        React.createElement("div", null, 
          "Hello JSX"
        )
      );
    }
    /* jshint ignore:end */
  });

  return Test;

});