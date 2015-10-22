/** @jsx React.DOM */
define([
  'react',
  'map/MapConfig',
  'components/NationalLayerList',
  'components/CommunityLayerList'
], function (React, MapConfig, NationalLayerList, CommunityLayerList) {
  'use strict';

  var TabContainer = React.createClass({displayName: "TabContainer",

    getInitialState: function () {
      return { activeTab: 'community' };
    },

    toggleTab: function () {
      this.setState({
        activeTab: (this.state.activeTab === 'community' ? 'national' : 'community')
      });
    },

    render: function () {
      return (
        React.createElement("div", {className: "layer-tab-container"}, 
          React.createElement("div", {className: "layer-tab-controls"}, 
            React.createElement("div", {id: "community-level-tab", onClick: this.toggleTab, className: 'community-tab' + (this.state.activeTab === 'community' ? ' active': '')}, 
              "Community Level"
            ), 
            React.createElement("div", {id: "national-level-tab", onClick: this.toggleTab, className: 'community-tab' + (this.state.activeTab === 'national' ? ' active': '')}, 
              "National Level"
            )
          ), 
          React.createElement("div", {className: "layer-tab-content"}, 
            React.createElement("div", {className: 'community-layers-tab tab-panel' + (this.state.activeTab === 'community' ? '': ' hidden')}, 
              React.createElement(CommunityLayerList, {data: MapConfig.communityLevelLayers})
            ), 
            React.createElement("div", {className: 'national-layers-tab tab-panel' + (this.state.activeTab === 'national' ? '': ' hidden')}, 
              React.createElement(NationalLayerList, null)
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
