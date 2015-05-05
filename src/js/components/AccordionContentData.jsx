/** @jsx React.DOM */
define([
  'react', 'data/main/config'], function (React, dataConfig) {
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

    // componentDidMount: function() {
    //   var steeringNode = $("#injectPartners");
    //   steeringNode[0].innerHTML = dataConfig.SteeringGroupsText;
    // },
    
    render: function () {

      
        return (
          <div className='data-Accordion'>
            <div style={{'display': (this.state.activePanel === '0' ? 'block' : 'none')}}>
              <h2 className='data-Accordion-Title'>{dataConfig.accordionSectionTitles[this.state.activePanel]}</h2>
              <p><i>{dataConfig.dataText}</i>{dataConfig.dataText2}<i>{dataConfig.dataText3}</i>{dataConfig.dataText4}</p>
              

            </div>
            <div style={{'display': (this.state.activePanel === '1' ? 'block' : 'none')}}>
              <h2 className='data-Accordion-Title'>{dataConfig.accordionSectionTitles[this.state.activePanel]}</h2>
              <p>{dataConfig.definitionText1a}<i>{dataConfig.dataText}</i>{dataConfig.definitionText1b}</p>
              <ul>
                <li><strong><u>{dataConfig.definitionText2a}</u></strong>{dataConfig.definitionText2b}</li>
                <li><strong><u>{dataConfig.definitionText3a}</u></strong>{dataConfig.definitionText3b}</li>
                <li><strong><u>{dataConfig.definitionText4a}</u></strong>{dataConfig.definitionText4b}</li>
                <li><strong><u>{dataConfig.definitionText5a}</u></strong>{dataConfig.definitionText5b}</li>
                <li><strong><u>{dataConfig.definitionText6a}</u></strong>{dataConfig.definitionText6b}</li>
                <li><strong><u>{dataConfig.definitionText7a}</u></strong>{dataConfig.definitionText7b}</li>
              </ul>
            </div>
            <div style={{'display': (this.state.activePanel === '2' ? 'block' : 'none')}}>
              <h2 className='data-Accordion-Title'>{dataConfig.accordionSectionTitles[this.state.activePanel]}</h2>
              <p>{dataConfig.dataQuality1}<i>{dataConfig.dataText3}</i>{dataConfig.dataQuality1b}<i>{dataConfig.dataText3}</i>{dataConfig.dataQuality1c}<i>{dataConfig.dataQuality1d}</i></p>
              <p>{dataConfig.dataQuality2}<a href='http://www.gadm.org/'>{dataConfig.dataQuality2b}</a>{dataConfig.dataQuality2c}</p>
              <p>{dataConfig.dataQuality3}</p>

              <ul>
                <li><strong>{dataConfig.dataQuality4a}</strong>{dataConfig.dataQuality4b}<a href='contact.html'>{dataConfig.dataQuality4c}</a>{dataConfig.dataQuality4d}</li>
                <li><strong>{dataConfig.dataQuality5a}</strong>{dataConfig.dataQuality5b}</li>
                <li><strong>{dataConfig.dataQuality6a}</strong>{dataConfig.dataQuality6b}</li>
                <li><strong>{dataConfig.dataQuality7a}</strong>{dataConfig.dataQuality7b}<i>{dataConfig.dataQuality7c}</i></li>
              </ul>
              <p>{dataConfig.dataQuality8}<i>{dataConfig.dataText3}</i>{dataConfig.dataQuality8b}<i>{dataConfig.dataText3}</i>{dataConfig.dataQuality8c}<i>{dataConfig.dataText3}</i>{dataConfig.dataQuality8d}</p>
              <p>{dataConfig.dataQuality9}</p>
            </div>
            <div style={{'display': (this.state.activePanel === '3' ? 'block' : 'none')}}>
              <h2 className='data-Accordion-Title'>{dataConfig.accordionSectionTitles[this.state.activePanel]}</h2>
              <p><i>{dataConfig.dataText3}</i>{dataConfig.dataCompleteness1}</p>
              <p>{dataConfig.dataCompleteness2a}<i>{dataConfig.dataText3}</i>{dataConfig.dataCompleteness2b}<i>{dataConfig.dataCompleteness2c}</i>{dataConfig.dataCompleteness2d}</p>

              <table id='data-completeness'>
                <tr><td><strong>{dataConfig.dataCompleteness3a}</strong></td><td><strong>{dataConfig.dataCompleteness3b}</strong></td></tr>

                <tr><td>{dataConfig.dataCompleteness4a}</td><td>{dataConfig.dataCompleteness4b}</td></tr>
                <tr><td>{dataConfig.dataCompleteness5a}</td><td>{dataConfig.dataCompleteness5b}</td></tr>
                <tr><td>{dataConfig.dataCompleteness6a}</td><td>{dataConfig.dataCompleteness6b}</td></tr>
                <tr><td>{dataConfig.dataCompleteness7a}</td><td>{dataConfig.dataCompleteness7b}</td></tr>
              </table>
              <p>{dataConfig.dataCompleteness8}</p>
              <p><i>{dataConfig.dataText3}</i>{dataConfig.dataCompleteness9a}<a href='contact.html'>{dataConfig.dataCompleteness9b}</a></p>
              
            </div>
            <div style={{'display': (this.state.activePanel === '4' ? 'block' : 'none')}}>
              <h2 className='data-Accordion-Title'>{dataConfig.accordionSectionTitles[this.state.activePanel]}</h2>
              
              <p>{dataConfig.dataLevel1}</p>
              <p><strong>{dataConfig.dataLevel2}</strong></p>
              <p>{dataConfig.dataLevel3}</p>
              <ol>
                <li>
                <strong>{dataConfig.dataLevel4}</strong>
                <p>{dataConfig.dataLevel5}</p>
                <ul>
                  <li><strong>{dataConfig.dataLevel6a}</strong>{dataConfig.dataLevel6b}</li>
                  <li><strong>{dataConfig.dataLevel7a}</strong>{dataConfig.dataLevel7b}</li>
                  <li><strong>{dataConfig.dataLevel8a}</strong>{dataConfig.dataLevel8b}</li>
                </ul>
                <p>{dataConfig.dataLevel9}</p>
                <ul>
                  <li><a href='Africa_Methods.pdf'>{dataConfig.dataLevel10}</a></li>
                  <li><a href='AmericasOceania_Methods.pdf'>{dataConfig.dataLevel11}</a></li>
                </ul>
                </li>


                <li>
                <strong>{dataConfig.dataLevel4}</strong>
                <p>{dataConfig.dataLevel5}</p>
                <ul>
                  <li><strong>{dataConfig.dataLevel6a}</strong>{dataConfig.dataLevel6b}</li>
                  <li><strong>{dataConfig.dataLevel7a}</strong>{dataConfig.dataLevel7b}</li>
                  <li><strong>{dataConfig.dataLevel8a}</strong>{dataConfig.dataLevel8b}</li>
                </ul>
                <p>{dataConfig.dataLevel9}</p>
                <ul>
                  <li><a href='Africa_Methods.pdf'>{dataConfig.dataLevel10}</a></li>
                  <li><a href='AmericasOceania_Methods.pdf'>{dataConfig.dataLevel11}</a></li>
                </ul>
                </li>

                
              </ol>
              
            </div>
          </div>
        );

    }

  });

  return AccordionContent;

  /* jshint ignore:end */

});