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
              <p>{aboutConfig.purposeText1}</p>
              <p>{aboutConfig.purposeText2}</p>
              <p>{aboutConfig.purposeText3}</p>
              <p>{aboutConfig.purposeText4}</p>

            </div>
            <div style={{'display': (this.state.activePanel === '1' ? 'block' : 'none')}}>
              <h2 className='about-Accordion-Title'>{aboutConfig.accordionSectionTitles[this.state.activePanel]}</h2>
              <p>{aboutConfig.aboutText1}</p>
              <p>{aboutConfig.aboutText2}</p>
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
      // <ul className='aboutSteeringText'>
      //           <li className='about-Steering-WRI' dangerouslySetInnerHTML={{__html: aboutConfig.wriText}} />
      //           <li className='about-Steering-delBien'>{aboutConfig.delBienText}</li>
      //           <li className='about-Steering-WAIP'>{aboutConfig.WAIPText}<a href={aboutConfig.WAIPTextLink}>{aboutConfig.WAIPTextLink}</a></li>
      //           <li className='about-Steering-rightsResources'>{aboutConfig.rightsResourcesText}</li>
      //           <li className='about-Steering-forestPeoples'>{aboutConfig.forestPeoplesText}</li>
      //           <li className='about-Steering-internationalLand'>{aboutConfig.internationalLandText}</li>
      //           <li className='about-Steering-rainUK'>{aboutConfig.rainUKText}</li>
      //           <li className='about-Steering-FES'>{aboutConfig.FESText}</li>
      //           <li className='about-Steering-PAFID'>{aboutConfig.PAFIDText}</li>
      //           <li className='about-Steering-aliansi'>{aboutConfig.aliansiText}</li>
      //           <li className='about-Steering-lizAlden'>{aboutConfig.lizAldenText}</li>
      //         </ul>

      //}, this);
    }

  });

  return AccordionContent;

  /* jshint ignore:end */

});