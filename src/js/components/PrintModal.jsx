/** @jsx React.DOM */
define([
  'react',
  'dojo/topic',
  'map/MapConfig',
  'components/Wrapper',
  'map/WidgetsController'
], function (React, topic, MapConfig, Wrapper, WidgetsController) {


  var PrintModal = React.createClass({

    getInitialState: function () {

        return {
          visible: true,
          mapTitle: 'LandMark Map',
          dpi: 96,
          format: 'pdf',
          layout: 'Portrait'
        };
      },

    close: function () {
      // this.setState({visible: false})
      WidgetsController.togglePrintModal()
    },

    print: function () {
      var title = this.state.mapTitle;
      var dpi = this.state.dpi;
      var format = this.state.format;
      var layout = this.state.layout;
      if (layout === 'Map Only') {
        layout = 'MAP_ONLY';
      }
      WidgetsController.printMap(title, dpi, format, layout);
    },

    handleMapTitle: function (evt) {
      this.setState({mapTitle: evt.target.value})
    },

    handleDpi: function (evt) {
      this.setState({dpi: evt.target.value})
    },

    handleFormat: function (evt) {
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
        'png',
        'jpg'
      ];

      var layoutOptions = [
        'Landscape',
        'Portrait',
        'Map Only'
      ];

      return (
        <Wrapper theme={'basemap-modal'} visible={this.state.visible} close={this.close}>
          <h3 className='print-modal-header'>Print Map</h3>
          <div id='print-preview--map_container'></div>
          <div className='print-input-container'>
            <label className='print-modal-label'>Map Title: </label>
            <input
            className='print-input print-input-text'
            type='text'
            value={this.state.mapTitle}
            onChange={this.handleMapTitle}/>
          </div>

          <div className='print-input-container'>
            <label className='print-modal-label'>Resolution (dpi): </label>
            <input
            className='print-input print-input-text'
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

          <canvas id="mapCanvas" className="mapCanvas hidden"></canvas>
          <button id='modal-print-button' className='modal-print-button' onClick={this.print}>Print</button>
        </Wrapper>
      );
    }

  });

  return function (node) {
    return React.render(<PrintModal />, document.getElementById(node));
  };

});
