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
      //componentDidMount to inject the injectDiv from a config file 
    },

    componentDidMount: function() {
      var steeringNode = $("#injectPartners");
      steeringNode[0].innerHTML = aboutConfig.SteeringGroupsText;
    },
    
    render: function () {

      //var sectionTitles = aboutConfig.accordionSectionTitles.map(function(item, index) {
      
        return (
          React.createElement("div", {className: "about-Accordion"}, 
            React.createElement("div", {style: {'display': (this.state.activePanel === '0' ? 'block' : 'none')}}, 
              React.createElement("h2", {className: "about-Accordion-Title"}, aboutConfig.accordionSectionTitles[this.state.activePanel]), 
              React.createElement("p", null, aboutConfig.purposeText1), 
              React.createElement("p", null, aboutConfig.purposeText2), 
              React.createElement("p", null, aboutConfig.purposeText3), 
              React.createElement("p", null, aboutConfig.purposeText4)

            ), 
            React.createElement("div", {style: {'display': (this.state.activePanel === '1' ? 'block' : 'none')}}, 
              React.createElement("h2", {className: "about-Accordion-Title"}, aboutConfig.accordionSectionTitles[this.state.activePanel]), 
              React.createElement("p", null, aboutConfig.aboutText1), 
              React.createElement("p", null, aboutConfig.aboutText2), 
              React.createElement("p", null, aboutConfig.aboutText3)
            ), 
            React.createElement("div", {style: {'display': (this.state.activePanel === '2' ? 'block' : 'none')}}, 
              React.createElement("h2", {className: "about-Accordion-Title"}, aboutConfig.accordionSectionTitles[this.state.activePanel]), 
              React.createElement("p", null, aboutConfig.mapDevelopment1), 
              React.createElement("p", null, aboutConfig.mapDevelopment2), 
              React.createElement("p", null, aboutConfig.mapDevelopment3), 
              React.createElement("p", null, aboutConfig.mapDevelopment4), 
              React.createElement("p", null, aboutConfig.mapDevelopment5)
            ), 
            React.createElement("div", {style: {'display': (this.state.activePanel === '3' ? 'block' : 'none')}}, 
              React.createElement("h2", {className: "about-Accordion-Title"}, aboutConfig.accordionSectionTitles[this.state.activePanel]), 
              React.createElement("div", {id: "injectPartners"})
              
            )
          )
        );

    }

  });

  return AccordionContent;

  /* jshint ignore:end */

});