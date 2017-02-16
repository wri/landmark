/** @jsx React.DOM */
define([
  'react',
  'dojo/topic',
  'map/MapConfig',
  'components/Wrapper',
  'map/WidgetsController'
], function (React, topic, MapConfig, Wrapper, WidgetsController) {


  var PrintModal = React.createClass({displayName: "PrintModal",

    getInitialState: function () {

        return {
          visible: true,
          mapTitle: 'Landmark Map',
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
      // if (layout === 'Map Only') {
      //   layout = 'MAP_ONLY';
      // }
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
      return React.createElement("option", {value: array}, array);
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
        'MAP_ONLY'
      ];

      return (
        React.createElement(Wrapper, {theme: 'basemap-modal', visible: this.state.visible, close: this.close}, 
          React.createElement("h3", {className: "print-modal-header"}, "Print Map"), 
          React.createElement("div", {id: "print-preview--map_container"}), 
          React.createElement("div", {className: "print-input-container"}, 
            React.createElement("label", {className: "print-modal-label"}, "Map Title: "), 
            React.createElement("input", {
            className: "print-input print-input-text", 
            type: "text", 
            value: this.state.mapTitle, 
            onChange: this.handleMapTitle})
          ), 

          React.createElement("div", {className: "print-input-container"}, 
            React.createElement("label", {className: "print-modal-label"}, "dpi: "), 
            React.createElement("input", {
            className: "print-input print-input-text", 
            type: "text", 
            value: this.state.dpi, 
            onChange: this.handleDpi})
          ), 

          React.createElement("div", {className: "print-input-container"}, 
            React.createElement("label", {className: "print-modal-label"}, "Format: "), 
            React.createElement("select", {className: "print-input", value: this.state.format, onChange: this.handleFormat}, 
              formatOptions.map(this.dataMapper)
            )
          ), 

          React.createElement("div", {className: "print-input-container"}, 
            React.createElement("label", {className: "print-modal-label"}, "Layout: "), 
            React.createElement("select", {className: "print-input", value: this.state.layout, onChange: this.handleLayout}, 
              layoutOptions.map(this.dataMapper)
            )
          ), 

          React.createElement("canvas", {id: "mapCanvas", className: "mapCanvas hidden"}), 
          React.createElement("button", {id: "modal-print-button", className: "modal-print-button", onClick: this.print}, "Print")
        )
      );
    }

  });

  return function (node) {
    return React.render(React.createElement(PrintModal, null), document.getElementById(node));
  };

});
