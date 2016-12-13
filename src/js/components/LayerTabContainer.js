/** @jsx React.DOM */
define([
  'react',
  'map/MapConfig',
  'components/LayerSelectionDropdown',
  'components/NationalLayerList',
  'components/CommunityLayerList'
], function (React, MapConfig, LayerSelectionDropdown, NationalLayerList, CommunityLayerList) {
  'use strict';

  var TabContainer = React.createClass({displayName: "TabContainer",

    getInitialState: function () {
      return { activeTab: 'community' };
    },

    getTitle: function (value) {
      if (value === 0) {
        return 'Indigenous & Community Land Maps'
      } else if (value === 1) {
        return 'Percent of Country Held by Indigenous Peoples & Communities'
      } else if (value === 2) {
        return 'Indicators of the Legal Security of Indigenous and Community Lands'
      }
    },

    render: function () {
      console.log(MapConfig.communityLevelLayers);
      // <CommunityLayerList data={MapConfig.communityLevelLayers} />
      // <NationalLayerList />
      return (
        React.createElement("div", {className: "layer-tab-container"}, 
          React.createElement("div", {className: "layer-tab-content"}, 
            React.createElement("div", {className: 'community-layers-tab tab-panel' + (this.state.activeTab === 'community' ? '': ' hidden')}, 
              React.createElement(LayerSelectionDropdown, {layerData: MapConfig.communityLevelLayers, title: this.getTitle(0), selection: 'community-lands', openTab: false}), 
              React.createElement(LayerSelectionDropdown, {title: this.getTitle(1), selection: 'percent-indigenous', openTab: false}), 
              React.createElement(LayerSelectionDropdown, {title: this.getTitle(2), selection: 'land-tenure', openTab: false})
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
