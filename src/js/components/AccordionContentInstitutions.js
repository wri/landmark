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
          React.createElement("div", {className: "institutions-Accordion"}, 
            React.createElement("div", {style: {'display': (this.state.activePanel === '0' ? 'block' : 'none')}}, 
              React.createElement("h2", {className: "institutions-Accordion-Title"}, institutionsConfig.accordionSectionTitles[this.state.activePanel]), 
              React.createElement("p", null, React.createElement("i", null, institutionsConfig.overviewText1a), institutionsConfig.overviewText1b, React.createElement("a", {href: "about.html"}, institutionsConfig.overviewText1c), institutionsConfig.overviewText1d, React.createElement("i", null, institutionsConfig.overviewText1e), institutionsConfig.overviewText1f, React.createElement("u", {onClick: this.setPanel}, institutionsConfig.overviewText1g), institutionsConfig.overviewText1h, React.createElement("u", {onClick: this.setPanel}, institutionsConfig.overviewText1i), institutionsConfig.overviewText1j, React.createElement("u", {onClick: this.setPanel}, institutionsConfig.overviewText1k), institutionsConfig.overviewText1l, React.createElement("u", {onClick: this.setPanel}, institutionsConfig.overviewText1m), institutionsConfig.overviewText1n)

            ), 
            React.createElement("div", {style: {'display': (this.state.activePanel === '1' ? 'block' : 'none')}}, 
              React.createElement("h2", {className: "institutions-Accordion-Title"}, institutionsConfig.accordionSectionTitles[this.state.activePanel]), 
              React.createElement("p", null, institutionsConfig.leadDev1a, React.createElement("i", null, institutionsConfig.overviewText1a), institutionsConfig.leadDev1b, React.createElement("u", {onClick: this.setPanel}, institutionsConfig.leadDev1c), institutionsConfig.leadDev1d, React.createElement("a", {target: "_blank", href: "http://www.blueraster.com"}, institutionsConfig.leadDev1e), institutionsConfig.leadDev1f), 

              React.createElement("table", {id: "institutions-developers"}, 
                React.createElement("tr", null, React.createElement("td", null, React.createElement("a", {className: "developers-website", href: "http://www.wri.org", target: "_blank"}, React.createElement("img", {src: "css/images/wriLogo.png"}))), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.leadDevRow2b)), React.createElement("strong", null, institutionsConfig.leadDevRow2c), institutionsConfig.leadDevRow2d, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.leadDevRow2e), institutionsConfig.leadDevRow2f), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.leadDevRow2g), institutionsConfig.leadDevRow2h), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.leadDevRow2i), institutionsConfig.leadDevRow2j))), 
                React.createElement("tr", null, React.createElement("td", null, React.createElement("a", {className: "developers-website", href: "http://www.ibcperu.org/", target: "_blank"}, React.createElement("img", {src: "css/images/bienLogo.png"}))), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.leadDevRow1b)), React.createElement("strong", null, institutionsConfig.leadDevRow1c), institutionsConfig.leadDevRow1d, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.leadDevRow1e), institutionsConfig.leadDevRow1f), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.leadDevRow1g), institutionsConfig.leadDevRow1h), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.leadDevRow1i), institutionsConfig.leadDevRow1j))), 
                React.createElement("tr", null, React.createElement("td", null, React.createElement("a", {className: "developers-website", href: "http://www.iheal.univ-paris3.fr/en/recherche/waipt-project", target: "_blank"}, React.createElement("img", {src: "css/images/waiptIcon.png"}))), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.leadDevRow3b)), React.createElement("strong", null, institutionsConfig.leadDevRow3c), institutionsConfig.leadDevRow3d, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.leadDevRow3e), institutionsConfig.leadDevRow3f), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.leadDevRow3g), institutionsConfig.leadDevRow3h), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.leadDevRow3i), institutionsConfig.leadDevRow3j)))
              )
            ), 

            React.createElement("div", {style: {'display': (this.state.activePanel === '2' ? 'block' : 'none')}}, 
              React.createElement("h2", {className: "institutions-Accordion-Title"}, institutionsConfig.accordionSectionTitles[this.state.activePanel]), 
              React.createElement("p", null, institutionsConfig.steeringGroup1a, React.createElement("i", null, institutionsConfig.overviewText1a), institutionsConfig.steeringGroup1b), 

              React.createElement("table", {id: "institutions-steering-group"}, 
                React.createElement("tr", null, React.createElement("td", null, React.createElement("a", {className: "developers-website", href: "http://www.aman.or.id/", target: "_blank"}, React.createElement("img", {src: "css/images/amanLogo.png"}))), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup2b)), React.createElement("strong", null, institutionsConfig.steeringGroup2c), institutionsConfig.steeringGroup2d, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup2e), institutionsConfig.steeringGroup2f), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup2g), institutionsConfig.steeringGroup2h), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup2i), institutionsConfig.steeringGroup2j))), 
                React.createElement("tr", null, React.createElement("td", null, React.createElement("a", {className: "developers-website", href: "http://www.forestpeoples.org/", target: "_blank"}, React.createElement("img", {src: "css/images/forestPeoplesLogo.gif"}))), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup3b)), React.createElement("strong", null, institutionsConfig.steeringGroup3c), institutionsConfig.steeringGroup3d, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup3e), institutionsConfig.steeringGroup3f), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup3g), institutionsConfig.steeringGroup3h), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup3i), institutionsConfig.steeringGroup3j))), 
                React.createElement("tr", null, React.createElement("td", null, React.createElement("a", {className: "developers-website", href: "http://fes.org.in/", target: "_blank"}, React.createElement("img", {src: "css/images/fesLogo.gif"}))), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup4b)), React.createElement("strong", null, institutionsConfig.steeringGroup4c), institutionsConfig.steeringGroup4d, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup4e), institutionsConfig.steeringGroup3f), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup4g), institutionsConfig.steeringGroup4h), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup4i), institutionsConfig.steeringGroup4j))), 

                React.createElement("tr", null, React.createElement("td", null, React.createElement("a", {className: "developers-website", href: "http://www.ibcperu.org/", target: "_blank"}, React.createElement("img", {src: "css/images/bienLogo.png"}))), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup5b)), React.createElement("strong", null, institutionsConfig.steeringGroup5c), institutionsConfig.steeringGroup5d, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup5e), institutionsConfig.steeringGroup5f), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup5g), institutionsConfig.steeringGroup5h), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup5i), institutionsConfig.steeringGroup5j))), 
                React.createElement("tr", null, React.createElement("td", null, React.createElement("a", {className: "developers-website", href: "http://www.landcoalition.org/", target: "_blank"}, React.createElement("img", {src: "css/images/landCOLogo.png"}))), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup6b)), React.createElement("strong", null, institutionsConfig.steeringGroup6c), institutionsConfig.steeringGroup6d, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup6e), institutionsConfig.steeringGroup6f), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup6g), institutionsConfig.steeringGroup6h), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup6i), institutionsConfig.steeringGroup6j))), 

                React.createElement("tr", null, React.createElement("td", null, React.createElement("p", null, institutionsConfig.steeringGroup7aa), React.createElement("p", null, institutionsConfig.steeringGroup7a)), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup7b)), React.createElement("strong", null, institutionsConfig.steeringGroup7c), institutionsConfig.steeringGroup7d, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup7e), institutionsConfig.steeringGroup7f), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup7g), institutionsConfig.steeringGroup7h))), 

                React.createElement("tr", null, React.createElement("td", null, React.createElement("a", {className: "developers-website", href: "http://www.pafid.org.ph/", target: "_blank"}, React.createElement("img", {src: "css/images/pafidLogo.png"}))), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup8b)), React.createElement("strong", null, institutionsConfig.steeringGroup8c), institutionsConfig.steeringGroup8d, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup8e), institutionsConfig.steeringGroup8f), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup8g), institutionsConfig.steeringGroup8h), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup8i), institutionsConfig.steeringGroup8j))), 
                React.createElement("tr", null, React.createElement("td", null, React.createElement("a", {className: "developers-website", href: "http://www.rainforestfoundationuk.org/", target: "_blank"}, React.createElement("img", {src: "css/images/rainUKLogo.png"}))), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup9b)), React.createElement("strong", null, institutionsConfig.steeringGroup9c), institutionsConfig.steeringGroup9d, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup9e), institutionsConfig.steeringGroup9f), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup9g), institutionsConfig.steeringGroup9h), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup9i), institutionsConfig.steeringGroup9j))), 
                React.createElement("tr", null, React.createElement("td", null, React.createElement("a", {className: "developers-website", href: "htttp://www.rightsandresources.org/", target: "_blank"}, React.createElement("img", {src: "css/images/rightsLogo.jpg"}))), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup10b)), React.createElement("strong", null, institutionsConfig.steeringGroup10c), institutionsConfig.steeringGroup10d, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup10e), institutionsConfig.steeringGroup10f), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup10g), institutionsConfig.steeringGroup10h), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup10i), institutionsConfig.steeringGroup10j))), 
                React.createElement("tr", null, React.createElement("td", null, React.createElement("a", {className: "developers-website", href: "http://www.iheal.univ-paris3.fr/en/recherche/waipt-project", target: "_blank"}, React.createElement("img", {src: "css/images/waiptIcon.png"}))), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup11b)), React.createElement("strong", null, institutionsConfig.steeringGroup11c), institutionsConfig.steeringGroup11d, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup11e), institutionsConfig.steeringGroup11f), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup11g), institutionsConfig.steeringGroup11h), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup11i), institutionsConfig.steeringGroup11j))), 
                React.createElement("tr", null, React.createElement("td", null, React.createElement("a", {className: "developers-website", href: "http://www.wri.org/", target: "_blank"}, React.createElement("img", {src: "css/images/wriLogo.png"}))), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup12b)), React.createElement("strong", null, institutionsConfig.steeringGroup12c), institutionsConfig.steeringGroup12d, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup12e), institutionsConfig.steeringGroup12f), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup12g), institutionsConfig.steeringGroup12h), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.steeringGroup12i), institutionsConfig.steeringGroup12j)))


              )
            ), 
            React.createElement("div", {style: {'display': (this.state.activePanel === '3' ? 'block' : 'none')}}, 
              React.createElement("h2", {className: "institutions-Accordion-Title"}, institutionsConfig.accordionSectionTitles[this.state.activePanel]), 
              
              React.createElement("p", null, institutionsConfig.dataProviders1a, React.createElement("i", null, institutionsConfig.overviewText1a), institutionsConfig.dataProviders1v), 
              React.createElement("p", null, React.createElement("i", null, React.createElement("u", {className: "levelTitle"}, institutionsConfig.dataProviders2a))), 


              React.createElement("table", {id: "institutions-providers"}, 

                React.createElement("tr", null, React.createElement("td", null, React.createElement("p", null, institutionsConfig.dataProviders4a)), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders4b), institutionsConfig.dataProviders4c), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders4d), institutionsConfig.dataProviders4e), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders4f), institutionsConfig.dataProviders4g))), 
                React.createElement("tr", null, React.createElement("td", null, React.createElement("p", null, institutionsConfig.dataProviders3a)), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders3b), institutionsConfig.dataProviders3c), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders3d), institutionsConfig.dataProviders3e), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders3f), institutionsConfig.dataProviders3g), React.createElement("p", null, React.createElement("a", {href: "www.iheal.univ-paris3.fr/en/recherche/waipt-project"}, institutionsConfig.dataProviders3h)))), 


                React.createElement("tr", null, React.createElement("td", null, React.createElement("p", null, institutionsConfig.dataProviders5a)), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders5b), institutionsConfig.dataProviders5c), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders5d), institutionsConfig.dataProviders5e), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders5f), institutionsConfig.dataProviders5g), React.createElement("p", null, React.createElement("a", {href: "www.iheal.univ-paris3.fr/en/recherche/waipt-project"}, institutionsConfig.dataProviders5h)))), 
                
                React.createElement("tr", null, React.createElement("td", null, React.createElement("p", null, institutionsConfig.dataProviders6a)), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders6b), institutionsConfig.dataProviders6c), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders6d), institutionsConfig.dataProviders6e), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders6f), institutionsConfig.dataProviders6g), React.createElement("p", null, React.createElement("a", {href: "www.iheal.univ-paris3.fr/en/recherche/waipt-project"}, institutionsConfig.dataProviders6h)))), 
                
                React.createElement("tr", null, React.createElement("td", null, React.createElement("p", null, institutionsConfig.dataProviders7a)), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders7b), institutionsConfig.dataProviders7c), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders7d), institutionsConfig.dataProviders7e), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders7f), institutionsConfig.dataProviders7g), React.createElement("p", null, React.createElement("a", {href: "www.iheal.univ-paris3.fr/en/recherche/waipt-project"}, institutionsConfig.dataProviders7h)))), 
                
                React.createElement("tr", null, React.createElement("td", null, React.createElement("p", null, institutionsConfig.dataProviders8a)), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders8b), institutionsConfig.dataProviders8c), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders8d), institutionsConfig.dataProviders8e), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders8f), institutionsConfig.dataProviders8g), React.createElement("p", null, React.createElement("a", {href: "www.iheal.univ-paris3.fr/en/recherche/waipt-project"}, institutionsConfig.dataProviders8h)))), 
                
                React.createElement("tr", null, React.createElement("td", null, React.createElement("p", null, institutionsConfig.dataProviders9a)), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders9b), institutionsConfig.dataProviders9c), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders9d), institutionsConfig.dataProviders9e), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders9f), institutionsConfig.dataProviders9g), React.createElement("p", null, React.createElement("a", {href: "www.iheal.univ-paris3.fr/en/recherche/waipt-project"}, institutionsConfig.dataProviders9h)))), 
                
                React.createElement("tr", null, React.createElement("td", null, React.createElement("p", null, institutionsConfig.dataProviders10a)), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders10b), institutionsConfig.dataProviders10c), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders10d), institutionsConfig.dataProviders10e), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders10f), institutionsConfig.dataProviders10g), React.createElement("p", null, React.createElement("a", {href: "www.iheal.univ-paris3.fr/en/recherche/waipt-project"}, institutionsConfig.dataProviders10h)))), 
                
                React.createElement("tr", null, React.createElement("td", null, React.createElement("p", null, institutionsConfig.dataProviders11a)), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders11b), institutionsConfig.dataProviders11c), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders11d), institutionsConfig.dataProviders11e), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders11f), institutionsConfig.dataProviders11g), React.createElement("p", null, React.createElement("a", {href: "www.iheal.univ-paris3.fr/en/recherche/waipt-project"}, institutionsConfig.dataProviders11h)))), 
                
                React.createElement("tr", null, React.createElement("td", null, React.createElement("p", null, institutionsConfig.dataProviders12a)), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders12b), institutionsConfig.dataProviders12c), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders12d), institutionsConfig.dataProviders12e), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders12f), institutionsConfig.dataProviders12g), React.createElement("p", null, React.createElement("a", {href: "www.iheal.univ-paris3.fr/en/recherche/waipt-project"}, institutionsConfig.dataProviders12h)))), 
                
                React.createElement("tr", null, React.createElement("td", null, React.createElement("p", null, institutionsConfig.dataProviders13a)), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders13b), institutionsConfig.dataProviders13c), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders13d), institutionsConfig.dataProviders13e), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders13f), institutionsConfig.dataProviders13g), React.createElement("p", null, React.createElement("a", {href: "www.iheal.univ-paris3.fr/en/recherche/waipt-project"}, institutionsConfig.dataProviders13h)))), 
                
                React.createElement("tr", null, React.createElement("td", null, React.createElement("p", null, institutionsConfig.dataProviders14a)), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders14b), institutionsConfig.dataProviders14c), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders14d), institutionsConfig.dataProviders14e), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders14f), institutionsConfig.dataProviders14g), React.createElement("p", null, React.createElement("a", {href: "www.iheal.univ-paris3.fr/en/recherche/waipt-project"}, institutionsConfig.dataProviders14h)))), 
                
                React.createElement("tr", null, React.createElement("td", null, React.createElement("p", null, institutionsConfig.dataProviders15a)), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders15b), institutionsConfig.dataProviders15c), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders15d), institutionsConfig.dataProviders15e), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders15f), institutionsConfig.dataProviders15g), React.createElement("p", null, React.createElement("a", {href: "www.iheal.univ-paris3.fr/en/recherche/waipt-project"}, institutionsConfig.dataProviders15h)))), 
                
                React.createElement("tr", null, React.createElement("td", null, React.createElement("p", null, institutionsConfig.dataProviders16a)), React.createElement("td", null, React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders16b), institutionsConfig.dataProviders16c), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders16d), institutionsConfig.dataProviders16e), React.createElement("p", null, React.createElement("strong", null, institutionsConfig.dataProviders16f), institutionsConfig.dataProviders16g), React.createElement("p", null, React.createElement("a", {href: "www.iheal.univ-paris3.fr/en/recherche/waipt-project"}, institutionsConfig.dataProviders16h))))


              ), 

              React.createElement("div", {dangerouslySetInnerHTML: {__html: institutionsConfig.dataProviders17}}), 

              React.createElement("div", {dangerouslySetInnerHTML: {__html: institutionsConfig.dataProviders18}}), 

              React.createElement("div", {dangerouslySetInnerHTML: {__html: institutionsConfig.dataProviders19}})

              
              
            ), 
            React.createElement("div", {style: {'display': (this.state.activePanel === '4' ? 'block' : 'none')}}, 
              React.createElement("h2", {className: "institutions-Accordion-Title"}, institutionsConfig.accordionSectionTitles[this.state.activePanel]), 
              React.createElement("div", {dangerouslySetInnerHTML: {__html: institutionsConfig.suppporters1}})
              
            )
          )
        );

    }

  });

  return AccordionContent;

  /* jshint ignore:end */

});