/** @jsx React.DOM */
define([
  'react'
], function (React) {

  var Test = React.createClass({
    /* jshint ignore:start */
    
    render: function () {
      return (
        <div>
          Hello JSX
        </div>
      );
    }
    /* jshint ignore:end */
  });

  return Test;

});