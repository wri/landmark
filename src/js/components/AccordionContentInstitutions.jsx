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
      // var steeringNode = $("#injectPartners");
      // steeringNode[0].innerHTML = institutionsConfig.SteeringGroupsText;
    },

    setPanel: function() {

      switch (arguments[0].target.innerText) {
        case "Overview":
          //this.setState({"activePanel" : '0'});
          $("#panel0").click();
          break;
        case "Lead Developers":
          //this.setState({"activePanel" : '1'});
          $("#panel1").click();
          break;
        case "Steering Group":
          // this.setState({"activePanel" : '2'});
          $("#panel2").click();
          break;
        case "Data Providers":
          $("#panel3").click();
          // this.setState({"activePanel" : '3'});
          break;
        case "Supporters":
        $("#panel4").click();
          //this.setState({"activePanel" : '4'});
          break;
      }
    },
    
    render: function () {

      
        return (
          <div className='institutions-Accordion'>
            <div style={{'display': (this.state.activePanel === '0' ? 'block' : 'none')}}>
              <h2 className='institutions-Accordion-Title'>{institutionsConfig.accordionSectionTitles[this.state.activePanel]}</h2>
              <p><i>{institutionsConfig.overviewText1a}</i>{institutionsConfig.overviewText1b}<a href='about.html'>{institutionsConfig.overviewText1c}</a>{institutionsConfig.overviewText1d}<i>{institutionsConfig.overviewText1e}</i>{institutionsConfig.overviewText1f}<u onClick={this.setPanel}>{institutionsConfig.overviewText1g}</u>{institutionsConfig.overviewText1h}<u onClick={this.setPanel}>{institutionsConfig.overviewText1i}</u>{institutionsConfig.overviewText1j}<u onClick={this.setPanel}>{institutionsConfig.overviewText1k}</u>{institutionsConfig.overviewText1l}<u onClick={this.setPanel}>{institutionsConfig.overviewText1m}</u>{institutionsConfig.overviewText1n}</p>

            </div>
            <div style={{'display': (this.state.activePanel === '1' ? 'block' : 'none')}}>
              <h2 className='institutions-Accordion-Title'>{institutionsConfig.accordionSectionTitles[this.state.activePanel]}</h2>
              <p>{institutionsConfig.leadDev1a}<i>{institutionsConfig.overviewText1a}</i>{institutionsConfig.leadDev1b}<u onClick={this.setPanel}>{institutionsConfig.leadDev1c}</u>{institutionsConfig.leadDev1d}<a target='_blank' href='http://www.blueraster.com'>{institutionsConfig.leadDev1e}</a>{institutionsConfig.leadDev1f}</p>

              <table id='institutions-developers'>
                <tr><td><a className='developers-website' href='http://www.wri.org' target='_blank'><img src='css/images/wriLogo.png' /></a></td><td><p><strong>{institutionsConfig.leadDevRow2b}</strong></p><strong>{institutionsConfig.leadDevRow2c}</strong>{institutionsConfig.leadDevRow2d}<p><strong>{institutionsConfig.leadDevRow2e}</strong>{institutionsConfig.leadDevRow2f}</p><p><strong>{institutionsConfig.leadDevRow2g}</strong>{institutionsConfig.leadDevRow2h}</p><p><strong>{institutionsConfig.leadDevRow2i}</strong>{institutionsConfig.leadDevRow2j}</p></td></tr>
                <tr><td><a className='developers-website' href='http://www.ibcperu.org/' target='_blank'><img src='css/images/bienLogo.png' /></a></td><td><p><strong>{institutionsConfig.leadDevRow1b}</strong></p><strong>{institutionsConfig.leadDevRow1c}</strong>{institutionsConfig.leadDevRow1d}<p><strong>{institutionsConfig.leadDevRow1e}</strong>{institutionsConfig.leadDevRow1f}</p><p><strong>{institutionsConfig.leadDevRow1g}</strong>{institutionsConfig.leadDevRow1h}</p><p><strong>{institutionsConfig.leadDevRow1i}</strong>{institutionsConfig.leadDevRow1j}</p></td></tr>
                <tr><td><a className='developers-website' href='http://www.iheal.univ-paris3.fr/en/recherche/waipt-project' target='_blank'><img src='css/images/waiptIcon.png' /></a></td><td><p><strong>{institutionsConfig.leadDevRow3b}</strong></p><strong>{institutionsConfig.leadDevRow3c}</strong>{institutionsConfig.leadDevRow3d}<p><strong>{institutionsConfig.leadDevRow3e}</strong>{institutionsConfig.leadDevRow3f}</p><p><strong>{institutionsConfig.leadDevRow3g}</strong>{institutionsConfig.leadDevRow3h}</p><p><strong>{institutionsConfig.leadDevRow3i}</strong>{institutionsConfig.leadDevRow3j}</p></td></tr>
              </table>
            </div>

            <div style={{'display': (this.state.activePanel === '2' ? 'block' : 'none')}}>
              <h2 className='institutions-Accordion-Title'>{institutionsConfig.accordionSectionTitles[this.state.activePanel]}</h2>
              <p>{institutionsConfig.steeringGroup1a}<i>{institutionsConfig.overviewText1a}</i>{institutionsConfig.steeringGroup1b}</p>

              <table id='institutions-steering-group'>
                <tr><td><a className='developers-website' href='http://www.aman.or.id/' target='_blank'><img src='css/images/amanLogo.png' /></a></td><td><p><strong>{institutionsConfig.steeringGroup2b}</strong></p><strong>{institutionsConfig.steeringGroup2c}</strong>{institutionsConfig.steeringGroup2d}<p><strong>{institutionsConfig.steeringGroup2e}</strong>{institutionsConfig.steeringGroup2f}</p><p><strong>{institutionsConfig.steeringGroup2g}</strong>{institutionsConfig.steeringGroup2h}</p><p><strong>{institutionsConfig.steeringGroup2i}</strong>{institutionsConfig.steeringGroup2j}</p></td></tr>
                <tr><td><a className='developers-website' href='http://www.forestpeoples.org/' target='_blank'><img src='css/images/forestPeoplesLogo.gif' /></a></td><td><p><strong>{institutionsConfig.steeringGroup3b}</strong></p><strong>{institutionsConfig.steeringGroup3c}</strong>{institutionsConfig.steeringGroup3d}<p><strong>{institutionsConfig.steeringGroup3e}</strong>{institutionsConfig.steeringGroup3f}</p><p><strong>{institutionsConfig.steeringGroup3g}</strong>{institutionsConfig.steeringGroup3h}</p><p><strong>{institutionsConfig.steeringGroup3i}</strong>{institutionsConfig.steeringGroup3j}</p></td></tr>
                <tr><td><a className='developers-website' href='http://fes.org.in/' target='_blank'><img src='css/images/fesLogo.gif' /></a></td><td><p><strong>{institutionsConfig.steeringGroup4b}</strong></p><strong>{institutionsConfig.steeringGroup4c}</strong>{institutionsConfig.steeringGroup4d}<p><strong>{institutionsConfig.steeringGroup4e}</strong>{institutionsConfig.steeringGroup3f}</p><p><strong>{institutionsConfig.steeringGroup4g}</strong>{institutionsConfig.steeringGroup4h}</p><p><strong>{institutionsConfig.steeringGroup4i}</strong>{institutionsConfig.steeringGroup4j}</p></td></tr>

                <tr><td><a className='developers-website' href='http://www.ibcperu.org/' target='_blank'><img src='css/images/bienLogo.png' /></a></td><td><p><strong>{institutionsConfig.steeringGroup5b}</strong></p><strong>{institutionsConfig.steeringGroup5c}</strong>{institutionsConfig.steeringGroup5d}<p><strong>{institutionsConfig.steeringGroup5e}</strong>{institutionsConfig.steeringGroup5f}</p><p><strong>{institutionsConfig.steeringGroup5g}</strong>{institutionsConfig.steeringGroup5h}</p><p><strong>{institutionsConfig.steeringGroup5i}</strong>{institutionsConfig.steeringGroup5j}</p></td></tr>
                <tr><td><a className='developers-website' href='http://www.landcoalition.org/' target='_blank'><img src='css/images/landCOLogo.png' /></a></td><td><p><strong>{institutionsConfig.steeringGroup6b}</strong></p><strong>{institutionsConfig.steeringGroup6c}</strong>{institutionsConfig.steeringGroup6d}<p><strong>{institutionsConfig.steeringGroup6e}</strong>{institutionsConfig.steeringGroup6f}</p><p><strong>{institutionsConfig.steeringGroup6g}</strong>{institutionsConfig.steeringGroup6h}</p><p><strong>{institutionsConfig.steeringGroup6i}</strong>{institutionsConfig.steeringGroup6j}</p></td></tr>

                <tr><td><p>{institutionsConfig.steeringGroup7aa}</p><p>{institutionsConfig.steeringGroup7a}</p></td><td><p><strong>{institutionsConfig.steeringGroup7b}</strong></p><strong>{institutionsConfig.steeringGroup7c}</strong>{institutionsConfig.steeringGroup7d}<p><strong>{institutionsConfig.steeringGroup7e}</strong>{institutionsConfig.steeringGroup7f}</p><p><strong>{institutionsConfig.steeringGroup7g}</strong>{institutionsConfig.steeringGroup7h}</p></td></tr>

                <tr><td><a className='developers-website' href='http://www.pafid.org.ph/' target='_blank'><img src='css/images/pafidLogo.png' /></a></td><td><p><strong>{institutionsConfig.steeringGroup8b}</strong></p><strong>{institutionsConfig.steeringGroup8c}</strong>{institutionsConfig.steeringGroup8d}<p><strong>{institutionsConfig.steeringGroup8e}</strong>{institutionsConfig.steeringGroup8f}</p><p><strong>{institutionsConfig.steeringGroup8g}</strong>{institutionsConfig.steeringGroup8h}</p><p><strong>{institutionsConfig.steeringGroup8i}</strong>{institutionsConfig.steeringGroup8j}</p></td></tr>
                <tr><td><a className='developers-website' href='http://www.rainforestfoundationuk.org/' target='_blank'><img src='css/images/rainUKLogo.png' /></a></td><td><p><strong>{institutionsConfig.steeringGroup9b}</strong></p><strong>{institutionsConfig.steeringGroup9c}</strong>{institutionsConfig.steeringGroup9d}<p><strong>{institutionsConfig.steeringGroup9e}</strong>{institutionsConfig.steeringGroup9f}</p><p><strong>{institutionsConfig.steeringGroup9g}</strong>{institutionsConfig.steeringGroup9h}</p><p><strong>{institutionsConfig.steeringGroup9i}</strong>{institutionsConfig.steeringGroup9j}</p></td></tr>
                <tr><td><a className='developers-website' href='htttp://www.rightsandresources.org/' target='_blank'><img src='css/images/rightsLogo.jpg' /></a></td><td><p><strong>{institutionsConfig.steeringGroup10b}</strong></p><strong>{institutionsConfig.steeringGroup10c}</strong>{institutionsConfig.steeringGroup10d}<p><strong>{institutionsConfig.steeringGroup10e}</strong>{institutionsConfig.steeringGroup10f}</p><p><strong>{institutionsConfig.steeringGroup10g}</strong>{institutionsConfig.steeringGroup10h}</p><p><strong>{institutionsConfig.steeringGroup10i}</strong>{institutionsConfig.steeringGroup10j}</p></td></tr>
                <tr><td><a className='developers-website' href='http://www.iheal.univ-paris3.fr/en/recherche/waipt-project' target='_blank'><img src='css/images/waiptIcon.png' /></a></td><td><p><strong>{institutionsConfig.steeringGroup11b}</strong></p><strong>{institutionsConfig.steeringGroup11c}</strong>{institutionsConfig.steeringGroup11d}<p><strong>{institutionsConfig.steeringGroup11e}</strong>{institutionsConfig.steeringGroup11f}</p><p><strong>{institutionsConfig.steeringGroup11g}</strong>{institutionsConfig.steeringGroup11h}</p><p><strong>{institutionsConfig.steeringGroup11i}</strong>{institutionsConfig.steeringGroup11j}</p></td></tr>
                <tr><td><a className='developers-website' href='http://www.wri.org/' target='_blank'><img src='css/images/wriLogo.png' /></a></td><td><p><strong>{institutionsConfig.steeringGroup12b}</strong></p><strong>{institutionsConfig.steeringGroup12c}</strong>{institutionsConfig.steeringGroup12d}<p><strong>{institutionsConfig.steeringGroup12e}</strong>{institutionsConfig.steeringGroup12f}</p><p><strong>{institutionsConfig.steeringGroup12g}</strong>{institutionsConfig.steeringGroup12h}</p><p><strong>{institutionsConfig.steeringGroup12i}</strong>{institutionsConfig.steeringGroup12j}</p></td></tr>


              </table>
            </div>
            <div style={{'display': (this.state.activePanel === '3' ? 'block' : 'none')}}>
              <h2 className='institutions-Accordion-Title'>{institutionsConfig.accordionSectionTitles[this.state.activePanel]}</h2>
              
              <p>{institutionsConfig.dataProviders1a}<i>{institutionsConfig.overviewText1a}</i>{institutionsConfig.dataProviders1v}</p>
              <p><i><u className="levelTitle">{institutionsConfig.dataProviders2a}</u></i></p>


              <table id='institutions-providers'>

                <tr><td><p>{institutionsConfig.dataProviders4a}</p></td><td><p><strong>{institutionsConfig.dataProviders4b}</strong>{institutionsConfig.dataProviders4c}</p><p><strong>{institutionsConfig.dataProviders4d}</strong>{institutionsConfig.dataProviders4e}</p><p><strong>{institutionsConfig.dataProviders4f}</strong>{institutionsConfig.dataProviders4g}</p></td></tr>
                <tr><td><p>{institutionsConfig.dataProviders3a}</p></td><td><p><strong>{institutionsConfig.dataProviders3b}</strong>{institutionsConfig.dataProviders3c}</p><p><strong>{institutionsConfig.dataProviders3d}</strong>{institutionsConfig.dataProviders3e}</p><p><strong>{institutionsConfig.dataProviders3f}</strong>{institutionsConfig.dataProviders3g}</p><p><a href='www.iheal.univ-paris3.fr/en/recherche/waipt-project'>{institutionsConfig.dataProviders3h}</a></p></td></tr>


                <tr><td><p>{institutionsConfig.dataProviders5a}</p></td><td><p><strong>{institutionsConfig.dataProviders5b}</strong>{institutionsConfig.dataProviders5c}</p><p><strong>{institutionsConfig.dataProviders5d}</strong>{institutionsConfig.dataProviders5e}</p><p><strong>{institutionsConfig.dataProviders5f}</strong>{institutionsConfig.dataProviders5g}</p><p><a href='www.iheal.univ-paris3.fr/en/recherche/waipt-project'>{institutionsConfig.dataProviders5h}</a></p></td></tr>
                
                <tr><td><p>{institutionsConfig.dataProviders6a}</p></td><td><p><strong>{institutionsConfig.dataProviders6b}</strong>{institutionsConfig.dataProviders6c}</p><p><strong>{institutionsConfig.dataProviders6d}</strong>{institutionsConfig.dataProviders6e}</p><p><strong>{institutionsConfig.dataProviders6f}</strong>{institutionsConfig.dataProviders6g}</p><p><a href='www.iheal.univ-paris3.fr/en/recherche/waipt-project'>{institutionsConfig.dataProviders6h}</a></p></td></tr>
                
                <tr><td><p>{institutionsConfig.dataProviders7a}</p></td><td><p><strong>{institutionsConfig.dataProviders7b}</strong>{institutionsConfig.dataProviders7c}</p><p><strong>{institutionsConfig.dataProviders7d}</strong>{institutionsConfig.dataProviders7e}</p><p><strong>{institutionsConfig.dataProviders7f}</strong>{institutionsConfig.dataProviders7g}</p><p><a href='www.iheal.univ-paris3.fr/en/recherche/waipt-project'>{institutionsConfig.dataProviders7h}</a></p></td></tr>
                
                <tr><td><p>{institutionsConfig.dataProviders8a}</p></td><td><p><strong>{institutionsConfig.dataProviders8b}</strong>{institutionsConfig.dataProviders8c}</p><p><strong>{institutionsConfig.dataProviders8d}</strong>{institutionsConfig.dataProviders8e}</p><p><strong>{institutionsConfig.dataProviders8f}</strong>{institutionsConfig.dataProviders8g}</p><p><a href='www.iheal.univ-paris3.fr/en/recherche/waipt-project'>{institutionsConfig.dataProviders8h}</a></p></td></tr>
                
                <tr><td><p>{institutionsConfig.dataProviders9a}</p></td><td><p><strong>{institutionsConfig.dataProviders9b}</strong>{institutionsConfig.dataProviders9c}</p><p><strong>{institutionsConfig.dataProviders9d}</strong>{institutionsConfig.dataProviders9e}</p><p><strong>{institutionsConfig.dataProviders9f}</strong>{institutionsConfig.dataProviders9g}</p><p><a href='www.iheal.univ-paris3.fr/en/recherche/waipt-project'>{institutionsConfig.dataProviders9h}</a></p></td></tr>
                
                <tr><td><p>{institutionsConfig.dataProviders10a}</p></td><td><p><strong>{institutionsConfig.dataProviders10b}</strong>{institutionsConfig.dataProviders10c}</p><p><strong>{institutionsConfig.dataProviders10d}</strong>{institutionsConfig.dataProviders10e}</p><p><strong>{institutionsConfig.dataProviders10f}</strong>{institutionsConfig.dataProviders10g}</p><p><a href='www.iheal.univ-paris3.fr/en/recherche/waipt-project'>{institutionsConfig.dataProviders10h}</a></p></td></tr>
                
                <tr><td><p>{institutionsConfig.dataProviders11a}</p></td><td><p><strong>{institutionsConfig.dataProviders11b}</strong>{institutionsConfig.dataProviders11c}</p><p><strong>{institutionsConfig.dataProviders11d}</strong>{institutionsConfig.dataProviders11e}</p><p><strong>{institutionsConfig.dataProviders11f}</strong>{institutionsConfig.dataProviders11g}</p><p><a href='www.iheal.univ-paris3.fr/en/recherche/waipt-project'>{institutionsConfig.dataProviders11h}</a></p></td></tr>
                
                <tr><td><p>{institutionsConfig.dataProviders12a}</p></td><td><p><strong>{institutionsConfig.dataProviders12b}</strong>{institutionsConfig.dataProviders12c}</p><p><strong>{institutionsConfig.dataProviders12d}</strong>{institutionsConfig.dataProviders12e}</p><p><strong>{institutionsConfig.dataProviders12f}</strong>{institutionsConfig.dataProviders12g}</p><p><a href='www.iheal.univ-paris3.fr/en/recherche/waipt-project'>{institutionsConfig.dataProviders12h}</a></p></td></tr>
                
                <tr><td><p>{institutionsConfig.dataProviders13a}</p></td><td><p><strong>{institutionsConfig.dataProviders13b}</strong>{institutionsConfig.dataProviders13c}</p><p><strong>{institutionsConfig.dataProviders13d}</strong>{institutionsConfig.dataProviders13e}</p><p><strong>{institutionsConfig.dataProviders13f}</strong>{institutionsConfig.dataProviders13g}</p><p><a href='www.iheal.univ-paris3.fr/en/recherche/waipt-project'>{institutionsConfig.dataProviders13h}</a></p></td></tr>
                
                <tr><td><p>{institutionsConfig.dataProviders14a}</p></td><td><p><strong>{institutionsConfig.dataProviders14b}</strong>{institutionsConfig.dataProviders14c}</p><p><strong>{institutionsConfig.dataProviders14d}</strong>{institutionsConfig.dataProviders14e}</p><p><strong>{institutionsConfig.dataProviders14f}</strong>{institutionsConfig.dataProviders14g}</p><p><a href='www.iheal.univ-paris3.fr/en/recherche/waipt-project'>{institutionsConfig.dataProviders14h}</a></p></td></tr>
                
                <tr><td><p>{institutionsConfig.dataProviders15a}</p></td><td><p><strong>{institutionsConfig.dataProviders15b}</strong>{institutionsConfig.dataProviders15c}</p><p><strong>{institutionsConfig.dataProviders15d}</strong>{institutionsConfig.dataProviders15e}</p><p><strong>{institutionsConfig.dataProviders15f}</strong>{institutionsConfig.dataProviders15g}</p><p><a href='www.iheal.univ-paris3.fr/en/recherche/waipt-project'>{institutionsConfig.dataProviders15h}</a></p></td></tr>
                
                <tr><td><p>{institutionsConfig.dataProviders16a}</p></td><td><p><strong>{institutionsConfig.dataProviders16b}</strong>{institutionsConfig.dataProviders16c}</p><p><strong>{institutionsConfig.dataProviders16d}</strong>{institutionsConfig.dataProviders16e}</p><p><strong>{institutionsConfig.dataProviders16f}</strong>{institutionsConfig.dataProviders16g}</p><p><a href='www.iheal.univ-paris3.fr/en/recherche/waipt-project'>{institutionsConfig.dataProviders16h}</a></p></td></tr>


              </table>

              <div dangerouslySetInnerHTML={{__html: institutionsConfig.dataProviders17}}></div>

              <div dangerouslySetInnerHTML={{__html: institutionsConfig.dataProviders18}}></div>

              <div dangerouslySetInnerHTML={{__html: institutionsConfig.dataProviders19}}></div>

              
              
            </div>
            <div style={{'display': (this.state.activePanel === '4' ? 'block' : 'none')}}>
              <h2 className='institutions-Accordion-Title'>{institutionsConfig.accordionSectionTitles[this.state.activePanel]}</h2>
              <div dangerouslySetInnerHTML={{__html: institutionsConfig.suppporters1}}></div>
              
            </div>
          </div>
        );

    }

  });

  return AccordionContent;

  /* jshint ignore:end */

});