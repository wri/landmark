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
              React.createElement("p", null, React.createElement("i", null, aboutConfig.purposeText1), aboutConfig.purposeText2, React.createElement("i", null, aboutConfig.purposeText2b), aboutConfig.purposeText2c), 
              React.createElement("ul", null, 
                React.createElement("li", null, aboutConfig.purposeText3), 
                React.createElement("li", null, aboutConfig.purposeText4), 
                React.createElement("li", null, aboutConfig.purposeText5), 
                React.createElement("li", null, aboutConfig.purposeText6), 
                React.createElement("li", null, aboutConfig.purposeText7), 
                React.createElement("li", null, aboutConfig.purposeText8)
              ), 
              React.createElement("p", null, React.createElement("i", null, aboutConfig.purposeText2b), aboutConfig.purposeText9), 
              React.createElement("ul", null, 
                React.createElement("li", null, aboutConfig.purposeText10), 
                React.createElement("li", null, aboutConfig.purposeText11)
              ), 
              React.createElement("p", null, aboutConfig.purposeText12, React.createElement("a", {href: "data.html"}, aboutConfig.purposeText12b), aboutConfig.purposeText12c)
              

            ), 
            React.createElement("div", {style: {'display': (this.state.activePanel === '1' ? 'block' : 'none')}}, 
              React.createElement("h2", {className: "about-Accordion-Title"}, aboutConfig.accordionSectionTitles[this.state.activePanel]), 
              React.createElement("p", null, React.createElement("i", null, aboutConfig.purposeText2b), aboutConfig.aboutText1), 
              React.createElement("p", null, aboutConfig.aboutText2, React.createElement("i", null, aboutConfig.purposeText2b), aboutConfig.aboutText2b), 
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