/** @jsx React.DOM */
define([
  'react', 'data/main/config'], function (React, dataConfig) {
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

    // componentDidMount: function() {
    //   var steeringNode = $("#injectPartners");
    //   steeringNode[0].innerHTML = dataConfig.SteeringGroupsText;
    // },
    
    render: function () {

      
        return (
          React.createElement("div", {className: "data-Accordion"}, 
            React.createElement("div", {style: {'display': (this.state.activePanel === '0' ? 'block' : 'none')}}, 
              React.createElement("h2", {className: "data-Accordion-Title"}, dataConfig.accordionSectionTitles[this.state.activePanel]), 
              React.createElement("p", null, React.createElement("i", null, dataConfig.dataText), dataConfig.dataText2, React.createElement("i", null, dataConfig.dataText3), dataConfig.dataText4)
              

            ), 
            React.createElement("div", {style: {'display': (this.state.activePanel === '1' ? 'block' : 'none')}}, 
              React.createElement("h2", {className: "data-Accordion-Title"}, dataConfig.accordionSectionTitles[this.state.activePanel]), 
              React.createElement("p", null, dataConfig.definitionText1a, React.createElement("i", null, dataConfig.dataText), dataConfig.definitionText1b), 
              React.createElement("ul", null, 
                React.createElement("li", null, React.createElement("strong", null, React.createElement("u", null, dataConfig.definitionText2a)), dataConfig.definitionText2b), 
                React.createElement("li", null, React.createElement("strong", null, React.createElement("u", null, dataConfig.definitionText3a)), dataConfig.definitionText3b), 
                React.createElement("li", null, React.createElement("strong", null, React.createElement("u", null, dataConfig.definitionText4a)), dataConfig.definitionText4b), 
                React.createElement("li", null, React.createElement("strong", null, React.createElement("u", null, dataConfig.definitionText5a)), dataConfig.definitionText5b), 
                React.createElement("li", null, React.createElement("strong", null, React.createElement("u", null, dataConfig.definitionText6a)), dataConfig.definitionText6b), 
                React.createElement("li", null, React.createElement("strong", null, React.createElement("u", null, dataConfig.definitionText7a)), dataConfig.definitionText7b)
              )
            ), 
            React.createElement("div", {style: {'display': (this.state.activePanel === '2' ? 'block' : 'none')}}, 
              React.createElement("h2", {className: "data-Accordion-Title"}, dataConfig.accordionSectionTitles[this.state.activePanel]), 
              React.createElement("p", null, dataConfig.dataQuality1, React.createElement("i", null, dataConfig.dataText3), dataConfig.dataQuality1b, React.createElement("i", null, dataConfig.dataText3), dataConfig.dataQuality1c, React.createElement("i", null, dataConfig.dataQuality1d)), 
              React.createElement("p", null, dataConfig.dataQuality2, React.createElement("a", {href: "http://www.gadm.org/"}, dataConfig.dataQuality2b), dataConfig.dataQuality2c), 
              React.createElement("p", null, dataConfig.dataQuality3), 

              React.createElement("ul", null, 
                React.createElement("li", null, React.createElement("strong", null, dataConfig.dataQuality4a), dataConfig.dataQuality4b, React.createElement("a", {href: "contact.html"}, dataConfig.dataQuality4c), dataConfig.dataQuality4d), 
                React.createElement("li", null, React.createElement("strong", null, dataConfig.dataQuality5a), dataConfig.dataQuality5b), 
                React.createElement("li", null, React.createElement("strong", null, dataConfig.dataQuality6a), dataConfig.dataQuality6b), 
                React.createElement("li", null, React.createElement("strong", null, dataConfig.dataQuality7a), dataConfig.dataQuality7b, React.createElement("i", null, dataConfig.dataQuality7c))
              ), 
              React.createElement("p", null, dataConfig.dataQuality8, React.createElement("i", null, dataConfig.dataText3), dataConfig.dataQuality8b, React.createElement("i", null, dataConfig.dataText3), dataConfig.dataQuality8c, React.createElement("i", null, dataConfig.dataText3), dataConfig.dataQuality8d), 
              React.createElement("p", null, dataConfig.dataQuality9)
            ), 
            React.createElement("div", {style: {'display': (this.state.activePanel === '3' ? 'block' : 'none')}}, 
              React.createElement("h2", {className: "data-Accordion-Title"}, dataConfig.accordionSectionTitles[this.state.activePanel]), 
              React.createElement("p", null, React.createElement("i", null, dataConfig.dataText3), dataConfig.dataCompleteness1), 
              React.createElement("p", null, dataConfig.dataCompleteness2a, React.createElement("i", null, dataConfig.dataText3), dataConfig.dataCompleteness2b, React.createElement("i", null, dataConfig.dataCompleteness2c), dataConfig.dataCompleteness2d), 

              React.createElement("table", {id: "data-completeness"}, 
                React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, dataConfig.dataCompleteness3a)), React.createElement("td", null, React.createElement("strong", null, dataConfig.dataCompleteness3b))), 

                React.createElement("tr", null, React.createElement("td", null, dataConfig.dataCompleteness4a), React.createElement("td", null, dataConfig.dataCompleteness4b)), 
                React.createElement("tr", null, React.createElement("td", null, dataConfig.dataCompleteness5a), React.createElement("td", null, dataConfig.dataCompleteness5b)), 
                React.createElement("tr", null, React.createElement("td", null, dataConfig.dataCompleteness6a), React.createElement("td", null, dataConfig.dataCompleteness6b)), 
                React.createElement("tr", null, React.createElement("td", null, dataConfig.dataCompleteness7a), React.createElement("td", null, dataConfig.dataCompleteness7b))
              ), 
              React.createElement("p", null, dataConfig.dataCompleteness8), 
              React.createElement("p", null, React.createElement("i", null, dataConfig.dataText3), dataConfig.dataCompleteness9a, React.createElement("a", {href: "contact.html"}, dataConfig.dataCompleteness9b))
              
            ), 
            React.createElement("div", {style: {'display': (this.state.activePanel === '4' ? 'block' : 'none')}}, 
              React.createElement("h2", {className: "data-Accordion-Title"}, dataConfig.accordionSectionTitles[this.state.activePanel]), 
              
              React.createElement("p", null, dataConfig.dataLevel1), 
              React.createElement("p", null, React.createElement("strong", null, dataConfig.dataLevel2)), 
              React.createElement("p", null, dataConfig.dataLevel3), 
              React.createElement("ol", null, 
                React.createElement("li", null, 
                React.createElement("strong", null, dataConfig.dataLevel4), 
                React.createElement("p", null, dataConfig.dataLevel5), 
                React.createElement("ul", null, 
                  React.createElement("li", null, React.createElement("strong", null, dataConfig.dataLevel6a), dataConfig.dataLevel6b), 
                  React.createElement("li", null, React.createElement("strong", null, dataConfig.dataLevel7a), dataConfig.dataLevel7b), 
                  React.createElement("li", null, React.createElement("strong", null, dataConfig.dataLevel8a), dataConfig.dataLevel8b)
                ), 
                React.createElement("p", null, dataConfig.dataLevel9), 
                React.createElement("ul", null, 
                  React.createElement("li", null, React.createElement("a", {href: "Africa_Methods.pdf"}, dataConfig.dataLevel10)), 
                  React.createElement("li", null, React.createElement("a", {href: "AmericasOceania_Methods.pdf"}, dataConfig.dataLevel11))
                )
                ), 


                React.createElement("li", null, 
                React.createElement("strong", null, dataConfig.dataLevel4), 
                React.createElement("p", null, dataConfig.dataLevel5), 
                React.createElement("ul", null, 
                  React.createElement("li", null, React.createElement("strong", null, dataConfig.dataLevel6a), dataConfig.dataLevel6b), 
                  React.createElement("li", null, React.createElement("strong", null, dataConfig.dataLevel7a), dataConfig.dataLevel7b), 
                  React.createElement("li", null, React.createElement("strong", null, dataConfig.dataLevel8a), dataConfig.dataLevel8b)
                ), 
                React.createElement("p", null, dataConfig.dataLevel9), 
                React.createElement("ul", null, 
                  React.createElement("li", null, React.createElement("a", {href: "Africa_Methods.pdf"}, dataConfig.dataLevel10)), 
                  React.createElement("li", null, React.createElement("a", {href: "AmericasOceania_Methods.pdf"}, dataConfig.dataLevel11))
                )
                )

                
              )
              
            )
          )
        );

    }

  });

  return AccordionContent;

  /* jshint ignore:end */

});