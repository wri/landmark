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

    toggleOff: function (layer, off) {

      if (off) {
        LayerController.updateVisibleLayers([layer], maybe)
      }
      // LayerController.updateVisibleLayers(keys, isNationalLevelData)

    },

    render: function () {
      return (
        React.createElement("div", {className: "community-layer-list"}, 
          React.createElement("div", {className: "community-layer-type"}, 
            React.createElement("div", {className: "community-layer-type-label"}, React.createElement("span", {className: "parent-layer-checked-true"}), "Indigenous Lands"), 
            this.state.data.map(this.layerMapper('indigenousLands'), this)
          ), 
          React.createElement("div", {className: "community-layer-type"}, 
            React.createElement("div", {className: "community-layer-type-label"}, React.createElement("span", {className: "parent-layer-checked-false"}), "Community Lands"), 
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
          React.createElement("div", {className: "layer-node", onClick: self.layerClicked, "data-id": item.id, "data-clicked": item.checked}, 
            React.createElement("span", {className: 'layer-checked-' + item.checked}), 
            item.label
          )
        )
      }
    },

    layerClicked: function (evt) {
      if (evt.target.classList.length === 0 || evt.target.parentElement.getAttribute('data-id') === null) {
        return;
      }

      var layer = evt.target.parentElement.getAttribute('data-id');
      var turnOff = evt.target.parentElement.getAttribute('data-clicked');

      if (turnOff == "true") {
        evt.target.classList.remove('layer-checked-true')
        evt.target.classList.add('layer-checked-false')

        evt.target.parentElement.setAttribute('data-clicked',false);
      } else {

        evt.target.classList.add('layer-checked-true')
        evt.target.classList.remove('layer-checked-false')
        evt.target.parentElement.setAttribute('data-clicked',true);
      }

      this.toggleOff(layer, turnOff);

    }

  });

  return CommunityLayerList;

});
