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

      //var sectionTitles = aboutConfig.accordionSectionTitles.map(function(item, index) {
      
        return (
          React.createElement("div", {className: "about-Accordion"}, 
            React.createElement("div", {style: {'display': (this.state.activePanel === '0' ? 'block' : 'none')}}, 
              React.createElement("h2", {className: "about-Accordion-Title"}, aboutConfig.accordionSectionTitles[this.state.activePanel]), 
              React.createElement("p", null, aboutConfig.purposeText1), 
              React.createElement("p", null, aboutConfig.purposeText2), 
              React.createElement("p", null, aboutConfig.purposeText3), 
              React.createElement("p", null, aboutConfig.purposeText4), 
              React.createElement("p", null, aboutConfig.purposeText5), 
              React.createElement("p", null, aboutConfig.purposeText6), 
              React.createElement("p", null, aboutConfig.purposeText7)
            ), 
            React.createElement("div", {style: {'display': (this.state.activePanel === '1' ? 'block' : 'none')}}, 
              React.createElement("h2", {className: "about-Accordion-Title"}, aboutConfig.accordionSectionTitles[this.state.activePanel]), 
              React.createElement("p", null, aboutConfig.mapDevelopment1), 
              React.createElement("p", null, aboutConfig.mapDevelopment2), 
              React.createElement("p", null, aboutConfig.mapDevelopment3), 
              React.createElement("p", null, aboutConfig.mapDevelopment4), 
              React.createElement("p", null, aboutConfig.mapDevelopment5)
            ), 
            React.createElement("div", {style: {'display': (this.state.activePanel === '2' ? 'block' : 'none')}}, 
              React.createElement("h2", {className: "about-Accordion-Title"}, aboutConfig.accordionSectionTitles[this.state.activePanel]), 
              React.createElement("ul", {className: "aboutSteeringText"}, 
                React.createElement("li", {className: "about-Steering-WRI"}, aboutConfig.wriText), 
                React.createElement("li", {className: "about-Steering-delBien"}, aboutConfig.delBienText), 
                React.createElement("li", {className: "about-Steering-WAIP"}, aboutConfig.WAIPText, React.createElement("a", {href: aboutConfig.WAIPTextLink}, aboutConfig.WAIPTextLink)), 
                React.createElement("li", {className: "about-Steering-rightsResources"}, aboutConfig.rightsResourcesText), 
                React.createElement("li", {className: "about-Steering-forestPeoples"}, aboutConfig.forestPeoplesText), 
                React.createElement("li", {className: "about-Steering-internationalLand"}, aboutConfig.internationalLandText), 
                React.createElement("li", {className: "about-Steering-rainUK"}, aboutConfig.rainUKText), 
                React.createElement("li", {className: "about-Steering-FES"}, aboutConfig.FESText), 
                React.createElement("li", {className: "about-Steering-PAFID"}, aboutConfig.PAFIDText), 
                React.createElement("li", {className: "about-Steering-aliansi"}, aboutConfig.aliansiText), 
                React.createElement("li", {className: "about-Steering-lizAlden"}, aboutConfig.lizAldenText)
              )
            )
          )
        );
      //}, this);
    }

  });

  return AccordionContent;

  /* jshint ignore:end */

});