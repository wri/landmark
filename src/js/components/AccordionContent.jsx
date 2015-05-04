/** @jsx React.DOM */
define([
  'react', 'about/main/config'], function (React, aboutConfig) {
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
      steeringNode[0].innerHTML = aboutConfig.SteeringGroupsText;
    },
    
    render: function () {

      //var sectionTitles = aboutConfig.accordionSectionTitles.map(function(item, index) {
      
        return (
          <div className='about-Accordion'>
            <div style={{'display': (this.state.activePanel === '0' ? 'block' : 'none')}}>
              <h2 className='about-Accordion-Title'>{aboutConfig.accordionSectionTitles[this.state.activePanel]}</h2>
              <p><i>{aboutConfig.purposeText1}</i>{aboutConfig.purposeText2}<i>{aboutConfig.purposeText2b}</i>{aboutConfig.purposeText2c}</p>
              <ul>
                <li>{aboutConfig.purposeText3}</li>
                <li>{aboutConfig.purposeText4}</li>
                <li>{aboutConfig.purposeText5}</li>
                <li>{aboutConfig.purposeText6}</li>
                <li>{aboutConfig.purposeText7}</li>
                <li>{aboutConfig.purposeText8}</li>
              </ul>
              <p><i>{aboutConfig.purposeText2b}</i>{aboutConfig.purposeText9}</p>
              <ul>
                <li>{aboutConfig.purposeText10}</li>
                <li>{aboutConfig.purposeText11}</li>
              </ul>
              <p>{aboutConfig.purposeText12}<a href='data.html'>{aboutConfig.purposeText12b}</a>{aboutConfig.purposeText12c}</p>
              

            </div>
            <div style={{'display': (this.state.activePanel === '1' ? 'block' : 'none')}}>
              <h2 className='about-Accordion-Title'>{aboutConfig.accordionSectionTitles[this.state.activePanel]}</h2>
              <p><i>{aboutConfig.purposeText2b}</i>{aboutConfig.aboutText1}</p>
              <p>{aboutConfig.aboutText2}<i>{aboutConfig.purposeText2b}</i>{aboutConfig.aboutText2b}</p>
              <p>{aboutConfig.aboutText3}</p>
            </div>
            <div style={{'display': (this.state.activePanel === '2' ? 'block' : 'none')}}>
              <h2 className='about-Accordion-Title'>{aboutConfig.accordionSectionTitles[this.state.activePanel]}</h2>
              <p>{aboutConfig.mapDevelopment1}</p>
              <p>{aboutConfig.mapDevelopment2}</p>
              <p>{aboutConfig.mapDevelopment3}</p>
              <p>{aboutConfig.mapDevelopment4}</p>
              <p>{aboutConfig.mapDevelopment5}</p>
            </div>
            <div style={{'display': (this.state.activePanel === '3' ? 'block' : 'none')}}>
              <h2 className='about-Accordion-Title'>{aboutConfig.accordionSectionTitles[this.state.activePanel]}</h2>
              <div id='injectPartners'></div>
              
            </div>
          </div>
        );

    }

  });

  return AccordionContent;

  /* jshint ignore:end */

});