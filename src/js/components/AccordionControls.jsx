/** @jsx React.DOM */
define([
  'react', 'about/main/config',], function (React, aboutConfig) {
  'use strict';

  /* jshint ignore:start */

  var AccordionControls = React.createClass({

    getInitialState: function () {
      console.dir(this.props);
      return {
        
      };
    },
    
    componentWillReceiveProps: function(nextProps) {
      this.setState({activePanel: nextProps.activePanel})    

    },
    
    render: function () {

      var sectionTitles = aboutConfig.accordionSectionTitles.map(function(item, index) {
        if (index !=0) {
          return (
            <div data-name={index} onClick={this.props.handleClick} id={'panel' + index} key={'panel' + index} className='panel-Title'>
              {item}
            </div>
          )
        } else {
      return (
          <div data-name={index} onClick={this.props.handleClick} id={'panel' + index} key={'panel' + index} className='panel-Title active'>
            {item}
          </div>
            ) 
          }
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