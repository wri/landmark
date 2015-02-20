/** @jsx React.DOM */
define([
  'react', 'about/main/config',], function (React, aboutConfig) {
  'use strict';

  /* jshint ignore:start */

  var AccordionControls = React.createClass({displayName: "AccordionControls",

    getInitialState: function () {
      return {
       activePanel: this.props.activePanel
      };
    },
    
    componentWillReceiveProps: function(nextProps) {
      this.setState({activePanel: nextProps.activePanel})    

    },
    
    render: function () {

      var sectionTitles = aboutConfig.accordionSectionTitles.map(function(item, index) {

      return (

          React.createElement("div", {"data-name": index, onClick: this.props.handleClick.bind(this,index), id: 'panel' + index, key: 'panel' + index, className: 'panel-Title '+(index===parseInt(this.state.activePanel) ? 'active':null)}, 
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