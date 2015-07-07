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
                  React.createElement("li", null, React.createElement("a", {href: "http://communityland.s3.amazonaws.com/pdfs/Africa_MethodsPercentCommunityLands.pdf", target: "_blank"}, dataConfig.dataLevel10)), 
                  React.createElement("li", null, React.createElement("a", {href: "http://communityland.s3.amazonaws.com/pdfs/AmericasOceania_MethodsPercentCommunityLands.pdf", target: "_blank"}, dataConfig.dataLevel11))
                )
                ), 


                React.createElement("li", null, 
                React.createElement("p", null, React.createElement("strong", null, dataConfig.dataLevel12a), dataConfig.dataLevel12b), 
                React.createElement("span", null, React.createElement("u", null, React.createElement("i", null, dataConfig.dataLevel13))), 


                React.createElement("table", {id: "indicators-table"}, 
                  React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, dataConfig.dataLevel14a)), React.createElement("td", null, React.createElement("strong", null, dataConfig.dataLevel14b))), 

                  React.createElement("tr", {className: "odd-row"}, React.createElement("td", null, dataConfig.dataCompletenessTable1a), React.createElement("td", null, dataConfig.dataCompletenessTable1b)), 
                  React.createElement("tr", null, React.createElement("td", null, dataConfig.dataCompletenessTable2a), React.createElement("td", null, dataConfig.dataCompletenessTable2b)), 
                  React.createElement("tr", {className: "odd-row"}, React.createElement("td", null, dataConfig.dataCompletenessTable3a), React.createElement("td", null, dataConfig.dataCompletenessTable3b)), 
                  React.createElement("tr", null, React.createElement("td", null, dataConfig.dataCompletenessTable4a), React.createElement("td", null, dataConfig.dataCompletenessTable4b)), 
                  React.createElement("tr", {className: "odd-row"}, React.createElement("td", null, dataConfig.dataCompletenessTable5a), React.createElement("td", null, dataConfig.dataCompletenessTable5b)), 
                  React.createElement("tr", null, React.createElement("td", null, dataConfig.dataCompletenessTable6a), React.createElement("td", null, dataConfig.dataCompletenessTable6b)), 
                  React.createElement("tr", {className: "odd-row"}, React.createElement("td", null, dataConfig.dataCompletenessTable7a), React.createElement("td", null, dataConfig.dataCompletenessTable7b)), 
                  React.createElement("tr", null, React.createElement("td", null, dataConfig.dataCompletenessTable8a), React.createElement("td", null, dataConfig.dataCompletenessTable8b)), 
                  React.createElement("tr", {className: "odd-row"}, React.createElement("td", null, dataConfig.dataCompletenessTable9a), React.createElement("td", null, dataConfig.dataCompletenessTable9b)), 
                  React.createElement("tr", null, React.createElement("td", null, dataConfig.dataCompletenessTable10a), React.createElement("td", null, dataConfig.dataCompletenessTable10b)), 
                  React.createElement("tr", {className: "odd-row"}, React.createElement("td", null, dataConfig.dataCompletenessTable11a), React.createElement("td", null, dataConfig.dataCompletenessTable11b)), 
                  React.createElement("tr", null, React.createElement("td", null, dataConfig.dataCompletenessTable12a), React.createElement("td", null, dataConfig.dataCompletenessTable12b)), 
                  React.createElement("tr", {className: "odd-row"}, React.createElement("td", null, dataConfig.dataCompletenessTable13a), React.createElement("td", null, dataConfig.dataCompletenessTable13b)), 
                  React.createElement("tr", null, React.createElement("td", null, dataConfig.dataCompletenessTable14a), React.createElement("td", null, dataConfig.dataCompletenessTable14b)), 
                  React.createElement("tr", {className: "odd-row"}, React.createElement("td", null, dataConfig.dataCompletenessTable15a), React.createElement("td", null, dataConfig.dataCompletenessTable15b)), 
                  React.createElement("tr", null, React.createElement("td", null, dataConfig.dataCompletenessTable16a), React.createElement("td", null, dataConfig.dataCompletenessTable16b)), 
                  React.createElement("tr", {className: "odd-row"}, React.createElement("td", null, dataConfig.dataCompletenessTable17a), React.createElement("td", null, dataConfig.dataCompletenessTable17b)), 
                  React.createElement("tr", null, React.createElement("td", null, dataConfig.dataCompletenessTable18a), React.createElement("td", null, dataConfig.dataCompletenessTable18b)), 
                  React.createElement("tr", {className: "odd-row"}, React.createElement("td", null, dataConfig.dataCompletenessTable19a), React.createElement("td", null, dataConfig.dataCompletenessTable19b))
                ), 

              React.createElement("p", null, dataConfig.dataLevel15), 

              React.createElement("ul", null, 
                React.createElement("li", null, React.createElement("a", {href: "http://communityland.s3.amazonaws.com/pdfs/IndicatorsCommunityLandTenureSecurityGuidelines.pdf", target: "_blank"}, dataConfig.dataLevel16))


              ), 
              React.createElement("p", null, React.createElement("strong", null, dataConfig.dataLevel17)), 
              React.createElement("p", null, dataConfig.dataLevel18), 
              React.createElement("p", null, dataConfig.dataLevel19), 

              React.createElement("img", {id: "dataChart", src: "css/images/dataChart.png", alt: "Community Level Data Organization", width: "500"}), 

              React.createElement("p", null, dataConfig.dataLevel20a, React.createElement("a", {href: "contact.html"}, dataConfig.dataLevel20b), dataConfig.dataLevel20c), 
              React.createElement("p", null, dataConfig.dataLevel21), 

              React.createElement("table", {id: "names-table"}, 
                  

                  React.createElement("tr", {className: "names-top-row"}, React.createElement("td", {colSpan: "2"}, dataConfig.dataNamesTableHeader)), 

                  React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, dataConfig.dataNamesTable1a)), React.createElement("td", null, dataConfig.dataNamesTable1b)), 
                  React.createElement("tr", {className: "odd-row-names"}, React.createElement("td", null, React.createElement("strong", null, dataConfig.dataNamesTable2a)), React.createElement("td", null, dataConfig.dataNamesTable2b, React.createElement("i", null, dataConfig.dataNamesTable2c))), 
                  React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, dataConfig.dataNamesTable3a)), React.createElement("td", null, React.createElement("span", null, dataConfig.dataNamesTable3b), React.createElement("p", null, dataConfig.dataNamesTable3c), React.createElement("p", null, React.createElement("u", null, dataConfig.dataNamesTable3d)), React.createElement("ul", null, React.createElement("li", null, dataConfig.dataNamesTable3e), React.createElement("li", null, dataConfig.dataNamesTable3f)), React.createElement("p", null, React.createElement("u", null, dataConfig.dataNamesTable3g)), React.createElement("ul", null, React.createElement("li", null, dataConfig.dataNamesTable3h), React.createElement("li", null, dataConfig.dataNamesTable3i)), React.createElement("p", null, dataConfig.dataNamesTable3j))), 
                  React.createElement("tr", {className: "odd-row-names"}, React.createElement("td", null, React.createElement("strong", null, dataConfig.dataNamesTable4a)), React.createElement("td", null, dataConfig.dataNamesTable4b)), 
                  React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, dataConfig.dataNamesTable5a)), React.createElement("td", null, dataConfig.dataNamesTable5b, React.createElement("i", null, dataConfig.dataNamesTable5c))), 
                  React.createElement("tr", {className: "odd-row-names"}, React.createElement("td", null, React.createElement("strong", null, dataConfig.dataNamesTable6a)), React.createElement("td", null, dataConfig.dataNamesTable6b, React.createElement("i", null, dataConfig.dataNamesTable6c))), 
                  React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, dataConfig.dataNamesTable7a)), React.createElement("td", null, dataConfig.dataNamesTable7b, React.createElement("i", null, dataConfig.dataNamesTable7c), dataConfig.dataNamesTable7d, React.createElement("i", null, dataConfig.dataNamesTable7e))), 
                  React.createElement("tr", {className: "odd-row-names"}, React.createElement("td", null, React.createElement("strong", null, dataConfig.dataNamesTable8a)), React.createElement("td", null, dataConfig.dataNamesTable8b)), 
                  React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, dataConfig.dataNamesTable9a)), React.createElement("td", null, dataConfig.dataNamesTable9b, React.createElement("i", null, dataConfig.dataNamesTable9c))), 
                  React.createElement("tr", {className: "odd-row-names"}, React.createElement("td", null, React.createElement("strong", null, dataConfig.dataNamesTable10a)), React.createElement("td", null, dataConfig.dataNamesTable10b, React.createElement("i", null, dataConfig.dataNamesTable10c))), 
                  React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, dataConfig.dataNamesTable11a)), React.createElement("td", null, dataConfig.dataNamesTable11b)), 
                  React.createElement("tr", {className: "odd-row-names"}, React.createElement("td", null, React.createElement("strong", null, dataConfig.dataNamesTable12a)), React.createElement("td", null, dataConfig.dataNamesTable12b)), 
                  React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, dataConfig.dataNamesTable13a)), React.createElement("td", null, dataConfig.dataNamesTable13b))

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