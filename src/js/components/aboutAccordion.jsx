/** @jsx React.DOM */
define([
  'react', 'components/AccordionContent','components/AccordionControls'], function (React, AccordionContent, AccordionControls) {
  'use strict';

  /* jshint ignore:start */

  var Accordion = React.createClass({

    getInitialState: function () {
      return {
        activePanel: '0'
      };
    },

    accordionOnClick: function(activePanel) {
      // console.log(arguments);
      // var newPanel = click.target.getAttribute('data-name');
      // var panelToRender = $("#panel" + newPanel);
      // $(panelToRender).addClass("active");
      // var panelToLeave = $("#panel" + this.state.activePanel);
      // $(panelToLeave).removeClass("active");
      this.setState({activePanel:activePanel.toString()});
    },
    
    render: function () {
      return (
        <div className='about-Accordion-Whole'>
          <AccordionControls activePanel={this.state.activePanel} handleClick={this.accordionOnClick} />
          <AccordionContent activePanel={this.state.activePanel}/>
        </div>
      );
    }

  });

  return function (data, node) {
    return React.render(<Accordion />, document.getElementById(node));
  }

  /* jshint ignore:end */

});