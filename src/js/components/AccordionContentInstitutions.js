/** @jsx React.DOM */
define([
  'react', 'institutions/main/config'], function (React, institutionsConfig) {
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
      steeringNode[0].innerHTML = institutionsConfig.SteeringGroupsText;
    },
    
    render: function () {

      
        return (
          React.createElement("div", {className: "institutions-Accordion"}, 
            React.createElement("div", {style: {'display': (this.state.activePanel === '0' ? 'block' : 'none')}}, 
              React.createElement("h2", {className: "institutions-Accordion-Title"}, institutionsConfig.accordionSectionTitles[this.state.activePanel]), 
              React.createElement("p", null, institutionsConfig.purposeText1), 
              React.createElement("p", null, institutionsConfig.purposeText2), 
              React.createElement("p", null, institutionsConfig.purposeText3), 
              React.createElement("p", null, institutionsConfig.purposeText4)

            ), 
            React.createElement("div", {style: {'display': (this.state.activePanel === '1' ? 'block' : 'none')}}, 
              React.createElement("h2", {className: "institutions-Accordion-Title"}, institutionsConfig.accordionSectionTitles[this.state.activePanel]), 
              React.createElement("p", null, institutionsConfig.aboutText1), 
              React.createElement("p", null, institutionsConfig.aboutText2), 
              React.createElement("p", null, institutionsConfig.aboutText3)
            ), 
            React.createElement("div", {style: {'display': (this.state.activePanel === '2' ? 'block' : 'none')}}, 
              React.createElement("h2", {className: "institutions-Accordion-Title"}, institutionsConfig.accordionSectionTitles[this.state.activePanel]), 
              React.createElement("p", null, institutionsConfig.mapDevelopment1), 
              React.createElement("p", null, institutionsConfig.mapDevelopment2), 
              React.createElement("p", null, institutionsConfig.mapDevelopment3), 
              React.createElement("p", null, institutionsConfig.mapDevelopment4), 
              React.createElement("p", null, institutionsConfig.mapDevelopment5)
            ), 
            React.createElement("div", {style: {'display': (this.state.activePanel === '3' ? 'block' : 'none')}}, 
              React.createElement("h2", {className: "institutions-Accordion-Title"}, institutionsConfig.accordionSectionTitles[this.state.activePanel]), 
              React.createElement("div", {id: "injectPartners"})
              
            )
          )
        );

    }

  });

  return AccordionContent;

  /* jshint ignore:end */

});