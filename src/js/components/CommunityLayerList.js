/** @jsx React.DOM */
define([
  'react',
  'map/LayerController'
], function (React, LayerController) {
  'use strict';

  var CommunityLayerList = React.createClass({displayName: "CommunityLayerList",

    getInitialState: function () {
      return {
        data: this.props.data
      };
    },

    toggleOff: function () {

    },

    render: function () {
      return (
        React.createElement("div", {className: "community-layer-list"}, 
          React.createElement("div", {className: "community-layer-type"}, 
            React.createElement("div", {className: "community-layer-type-label"}, "Indigenous Lands"), 
            this.state.data.map(this.layerMapper('indigenousLands'), this)
          ), 
          React.createElement("div", {className: "community-layer-type"}, 
            React.createElement("div", {className: "community-layer-type-label"}, "Community Lands"), 
            this.state.data.map(this.layerMapper('communityLands'), this)
          )
        )
      );
    },

    layerMapper: function (group) {
      var self = this;
      return function (item) {
        return item.group !== group ? null :
        (
          item.isCategory ? React.createElement("div", {className: "layer-category"}, item.label) :
          React.createElement("div", {className: "layer-node", onClick: self.layerClicked, "data-id": item.id}, 
            React.createElement("span", {className: "layer-checkbox"}), 
            item.label
          )
        )
      }
    },

    layerClicked: function (evt) {
      console.log(evt.target.getAttribute('data-id'));
    }

  });

  return CommunityLayerList;

});
