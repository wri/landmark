/** @jsx React.DOM */
define([
  'react', 'institutions/main/config'], function (React, institutionsConfig) {
  'use strict';

  /* jshint ignore:start */

  var AccordionControls = React.createClass({

    getInitialState: function () {
      return {
       activePanel: this.props.activePanel
      };
    },
    
    componentWillReceiveProps: function(nextProps) {
      this.setState({activePanel: nextProps.activePanel})    

    },
    
    render: function () {

      var sectionTitles = institutionsConfig.accordionSectionTitles.map(function(item, index) {

      return (

          <div data-name={index} onClick={this.props.handleClick.bind(this,index)} id={'panel' + index} key={'panel' + index} className={'panel-Title '+(index===parseInt(this.state.activePanel) ? 'active':null)} >
            {item}
          </div>
            ) 
        }, this);
        

      return (
        <div className='accordion-Controls'>
          
          {sectionTitles}
        </div>
      );
    }

  });


  return AccordionControls;


  /* jshint ignore:end */

});