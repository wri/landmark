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
    
    
    render: function () {

      var sectionTitles = aboutConfig.accordionSectionTitles.map(function(item, index) {
        return (
          React.createElement("div", {"data-name": index, onClick: this.props.handleClick, key: 'panel' + index, className: "panel-Title"}, 
            item
          )
        ) 
      }, this);

      return (
        React.createElement("div", {className: "accordion-Controls"}, 
          sectionTitles
        )
      );
    }

  });


    return AccordionControls;


  /* jshint ignore:end */

});