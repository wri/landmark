/** @jsx React.DOM */
define([
  'react', 'about/main/config'], function (React, aboutConfig) {
  'use strict';

  /* jshint ignore:start */

  var AccordionContent = React.createClass({displayName: "AccordionContent",

    getInitialState: function () {
      return {
        activePanel: this.props.activePanel
      };
    },
    
    componentWillReceiveProps: function(nextProps) {
      this.setState({activePanel: nextProps.activePanel})    
    },
    
    render: function () {



      return (
        React.createElement("div", {className: "about-Accordion"}, 
          React.createElement("div", {style: {'display': (this.state.activePanel === '0' ? 'block' : 'none')}}, 
            "1"
          ), 
          React.createElement("div", {style: {'display': (this.state.activePanel === '1' ? 'block' : 'none')}}, 
            aboutConfig.purposeText
          ), 
          React.createElement("div", {style: {'display': (this.state.activePanel === '2' ? 'block' : 'none')}}, 
            "3"
          )
        )
      );
    }

  });

  return AccordionContent;

  /* jshint ignore:end */

});