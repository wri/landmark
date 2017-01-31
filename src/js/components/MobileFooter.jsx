/** @jsx React.DOM */
define([
  'react',
  'dojo/topic',
  'map/MapConfig'
], function (React, topic, MapConfig) {
  'use strict';


  var MobileFooter = React.createClass({

    getInitialState: function () {

        return {

        };
      },

    close: function () {
      // this.setState({visible: false})
    },

    dataMapper: function(array) {
      return <option value={array}>{array}</option>;
    },

    render: function () {

      return (
        <div className='mobile-footer-container'>
          <div className='mobile-footer-child'>Layer</div>
          <div className='mobile-footer-child'>Country</div>
          <div className='mobile-footer-child'>Search</div>
          <div className='mobile-footer-child'>Analyze</div>
        </div>
      );
    }

  });

  return function (node) {
    return React.render(<MobileFooter />, document.getElementById(node));
  };

});
