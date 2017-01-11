/** @jsx React.DOM */
define([
  'react',
  'map/MapConfig',
  'components/LayerSelectionDropdown'
], function (React, MapConfig, LayerSelectionDropdown) {
  'use strict';

  var TabContainer = React.createClass({displayName: "TabContainer",

    getInitialState: function () {
      return {
        activeTab: 'community'
      };
    },

    getTitle: function (value) {
      if (value === 0) {
        return 'Indigenous & Community Land Maps'
      } else if (value === 1) {
        return 'Proportion of Country Held by Indigenous Peoples & Communities'
      } else if (value === 2) {
        return 'Indicators of the Legal Security of Indigenous and Community Lands'
      }
    },

    setActiveTab: function(key) {
      console.log(key);
      this.setState({activeTab: key});
    },

    render: function () {
      return (
        React.createElement("div", {className: "layer-tab-container"}, 
          React.createElement("div", {className: "layer-tab-content"}, 
            React.createElement("div", {className: 'community-layers-tab tab-panel'}, 
              React.createElement(LayerSelectionDropdown, {layerData: MapConfig.communityLevelLayers, activeTab: this.state.activeTab, setActiveTab: this.setActiveTab, title: this.getTitle(0), selection: 'community-lands'}), 
              React.createElement(LayerSelectionDropdown, {title: this.getTitle(1), activeTab: this.state.activeTab, setActiveTab: this.setActiveTab, selection: 'percent-indigenous'}), 
              React.createElement(LayerSelectionDropdown, {title: this.getTitle(2), activeTab: this.state.activeTab, setActiveTab: this.setActiveTab, selection: 'land-tenure'})
            )
          )
        )
      );
    }

  });

  return function (node) {
    return React.render(React.createElement(TabContainer, null), document.getElementById(node));
  };

});
