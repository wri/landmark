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
    
    
    render: function () {

      var sectionTitles = aboutConfig.accordionSectionTitles.map(function(item, index) {
        return (
          <div data-name={index} onClick={this.props.handleClick} key={'panel' + index} className='panel-Title'>
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