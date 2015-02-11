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
    },
    
    render: function () {



      return (
        <div className='about-Accordion'>
          <div style={{'display': (this.state.activePanel === '0' ? 'block' : 'none')}}>
            1
          </div>
          <div style={{'display': (this.state.activePanel === '1' ? 'block' : 'none')}}>
            {aboutConfig.purposeText}
          </div>
          <div style={{'display': (this.state.activePanel === '2' ? 'block' : 'none')}}>
            3
          </div>
        </div>
      );
    }

  });

  return AccordionContent;

  /* jshint ignore:end */

});