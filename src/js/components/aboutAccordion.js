/** @jsx React.DOM */
define([
  'react', 'components/AccordionContent','components/AccordionControls'], function (React, AccordionContent, AccordionControls) {
  'use strict';

  /* jshint ignore:start */

  var Accordion = React.createClass({displayName: "Accordion",

    getInitialState: function () {
      return {
        activePanel: '0'
      };
    },

    accordionOnClick: function(click) {
      var newPanel = click.target.getAttribute('data-name');
      this.setState({activePanel:newPanel});
    },
    
    render: function () {
      return (
        React.createElement("div", {className: "about-Accordion"}, 
          React.createElement(AccordionControls, {handleClick: this.accordionOnClick}), 
          React.createElement(AccordionContent, {activePanel: this.state.activePanel})
        )
      );
    }

  });

  return function (data, node) {
    return React.render(React.createElement(Accordion, null), document.getElementById(node));
  }

  /* jshint ignore:end */

});