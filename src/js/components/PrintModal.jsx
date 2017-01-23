/** @jsx React.DOM */
define([
  'react',
  'dojo/topic',
  'map/MapConfig',
  'components/Wrapper',
  'map/WidgetsController'
], function (React, topic, MapConfig, Wrapper, WidgetsController) {
  'use strict';


  var PrintModal = React.createClass({

    getInitialState: function () {

        return {
          visible: true,
          mapTitle: 'Landmark Map',
          dpi: 96,
          format: 'PDF',
          layout: 'MAP_ONLY'
        };
      },

    close: function () {
      console.log('close?');
      // this.setState({visible: false})
      WidgetsController.togglePrintModal()
    },

    print: function () {
      var title = this.state.mapTitle;
      var dpi = this.state.dpi;
      var format = this.state.format;
      var layout = this.state.layout;
      WidgetsController.printMap(title, dpi, format, layout);
    },

    handleMapTitle: function (evt) {
      console.log(evt.target.value);
      this.setState({mapTitle: evt.target.value})
    },

    handleDpi: function (evt) {
      console.log(evt.target.value);
      this.setState({dpi: evt.target.value})
    },

    handleFormat: function (evt) {
      console.log(evt.target.value);
      this.setState({format: evt.target.value})
    },

    handleLayout: function (evt) {
      this.setState({layout: evt.target.value})
    },

    dataMapper: function(array) {
      return <option value={array}>{array}</option>;
    },

    render: function () {

      var formatOptions = [
        'pdf',
        'png32',
        'png8',
        'jpg',
        'gif',
        'eps',
        'svg',
        'svgz'
      ];

      var layoutOptions = [
        'A3 Landscape',
        'A3 Portrait',
        'A4 Landscape',
        'A4 Portrait',
        'Letter ANSI A Landscape',
        'Letter ANSI A Portrait',
        'MAP_ONLY',
        'Tabloid ANSI B Landscape',
        'Tabloid ANSI B Portrait'
      ];

      return (
        <Wrapper theme={'basemap-modal'} visible={this.state.visible} close={this.close}>
          <h3 className='print-modal-header'>Print Map</h3>
          <div className='print-input-container'>
            <label className='print-modal-label'>Map Title: </label>
            <input
            className='print-input'
            type='text'
            value={this.state.mapTitle}
            onChange={this.handleMapTitle}/>
          </div>

          <div className='print-input-container'>
            <label className='print-modal-label'>dpi: </label>
            <input
            className='print-input'
            type='text'
            value={this.state.dpi}
            onChange={this.handleDpi}/>
          </div>

          <div className='print-input-container'>
            <label className='print-modal-label'>Format: </label>
            <select className='print-input' value={this.state.format} onChange={this.handleFormat}>
              {formatOptions.map(this.dataMapper)}
            </select>
          </div>

          <div className='print-input-container'>
            <label className='print-modal-label'>Layout: </label>
            <select className='print-input' value={this.state.layout} onChange={this.handleLayout}>
              {layoutOptions.map(this.dataMapper)}
            </select>
          </div>

          <button className='modal-print-button' onClick={this.print}>Print</button>
        </Wrapper>
      );
    }

  });

  return function (node) {
    return React.render(<PrintModal />, document.getElementById(node));
  };

});
