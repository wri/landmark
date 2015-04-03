/** @jsx React.DOM */
define([
  'react', 'institutions/main/config'], function (React, institutionsConfig) {
  'use strict';

  /* jshint ignore:start */

  var AccordionContent = React.createClass({

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
          <div className='institutions-Accordion'>
            <div style={{'display': (this.state.activePanel === '0' ? 'block' : 'none')}}>
              <h2 className='institutions-Accordion-Title'>{institutionsConfig.accordionSectionTitles[this.state.activePanel]}</h2>
              <p>{institutionsConfig.purposeText1}</p>
              <p>{institutionsConfig.purposeText2}</p>
              <p>{institutionsConfig.purposeText3}</p>
              <p>{institutionsConfig.purposeText4}</p>

            </div>
            <div style={{'display': (this.state.activePanel === '1' ? 'block' : 'none')}}>
              <h2 className='institutions-Accordion-Title'>{institutionsConfig.accordionSectionTitles[this.state.activePanel]}</h2>
              <p>{institutionsConfig.aboutText1}</p>
              <p>{institutionsConfig.aboutText2}</p>
              <p>{institutionsConfig.aboutText3}</p>
            </div>
            <div style={{'display': (this.state.activePanel === '2' ? 'block' : 'none')}}>
              <h2 className='institutions-Accordion-Title'>{institutionsConfig.accordionSectionTitles[this.state.activePanel]}</h2>
              <p>{institutionsConfig.mapDevelopment1}</p>
              <p>{institutionsConfig.mapDevelopment2}</p>
              <p>{institutionsConfig.mapDevelopment3}</p>
              <p>{institutionsConfig.mapDevelopment4}</p>
              <p>{institutionsConfig.mapDevelopment5}</p>
            </div>
            <div style={{'display': (this.state.activePanel === '3' ? 'block' : 'none')}}>
              <h2 className='institutions-Accordion-Title'>{institutionsConfig.accordionSectionTitles[this.state.activePanel]}</h2>
              <div id='injectPartners'></div>
              
            </div>
          </div>
        );

    }

  });

  return AccordionContent;

  /* jshint ignore:end */

});