/** @jsx React.DOM */
define([
  'react', 'about/main/config',], function (React, aboutConfig) {
  'use strict';

  /* jshint ignore:start */

  var AccordionControls = React.createClass({displayName: "AccordionControls",

    getInitialState: function () {
      console.dir(this.props);
      return {
        
      };
    },
    
    componentWillReceiveProps: function(nextProps) {
      this.setState({activePanel: nextProps.activePanel})    

    },
    
    render: function () {

      var sectionTitles = aboutConfig.accordionSectionTitles.map(function(item, index) {
        if (index !=0) {
          return (
            React.createElement("div", {"data-name": index, onClick: this.props.handleClick, id: 'panel' + index, key: 'panel' + index, className: "panel-Title"}, 
              item
            )
          )
        } else {
      return (
          React.createElement("div", {"data-name": index, onClick: this.props.handleClick, id: 'panel' + index, key: 'panel' + index, className: "panel-Title active"}, 
            item
          )
            ) 
          }
        }, this);
        

      return (
        React.createElement("div", {className: "accordion-Controls"}, 
          React.createElement("div", {className: "accordion-Title"}, React.createElement("i", {className: "caret-down"})), 
          sectionTitles
        )
      );
    }

  });


  return AccordionControls;


  /* jshint ignore:end */

});