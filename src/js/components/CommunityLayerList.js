/** @jsx React.DOM */
define([
  'react',
  'map/LayerController',
  'map/WidgetsController'
], function (React, LayerController, WidgetsController) {
  'use strict';

  var CommunityLayerList = React.createClass({displayName: "CommunityLayerList",

    getInitialState: function () {
      return {
        data: this.props.data
      };
    },

    toggleOff: function (layers, off) {

      LayerController.updateVisibleLayers(layers, false, off);
      // LayerController.updateVisibleLayers(keys, isNationalLevelData)
    },

    render: function () {
      return (
        React.createElement("div", {className: "community-layer-list"}, 
          React.createElement("div", {className: "community-layer-type"}, 
            React.createElement("div", {className: "community-layer-type-label", id: "indigenousLands"}, React.createElement("span", {className: "parent-layer-checked-true", onClick: this.parentClicked}), "Indigenous Lands", React.createElement("span", {id: "indigenous-lands-help", className: "parent-layer-help", onClick: this.showHelp})), 
            this.state.data.map(this.layerMapper('indigenousLands'), this)
          ), 
          React.createElement("div", {className: "community-layer-type"}, 
            React.createElement("div", {className: "community-layer-type-label", id: "communityLands"}, React.createElement("span", {className: "parent-layer-checked-true", onClick: this.parentClicked}), "Community Lands", React.createElement("span", {id: "community-lands-help", className: "parent-layer-help", onClick: this.showHelp})), 
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
      evt.stopPropagation()
      if (evt.target.classList.length === 0 || evt.target.parentElement.getAttribute('data-id') === null) {
        return;
      }

      var layer = evt.target.parentElement.getAttribute('data-id');
      var turnOff = evt.target.parentElement.getAttribute('data-clicked');

      if (turnOff === "true") {
        evt.target.classList.remove('layer-checked-true');
        evt.target.classList.add('layer-checked-false');
        evt.target.parentElement.setAttribute('data-clicked',false);
      } else {
        evt.target.classList.add('layer-checked-true');
        evt.target.classList.remove('layer-checked-false');
        evt.target.parentElement.setAttribute('data-clicked',true);
      }

      var val = !(turnOff === "true");

      for (var i = 0; i < this.state.data.length; i++) {
        if (this.state.data[i].group === layer) {
          this.state.data[i].checked = val;
        }
      }

      // this.setState({
      //   data: this.state.data
      // });

      this.toggleOff([layer], !val);

    },

    showHelp: function (evt) {
      console.log("ss")
      WidgetsController.showHelp(evt);
    },

    parentClicked: function (evt) {
      evt.stopPropagation();
      var allOff, layers = [];

      if (evt.target.classList.contains("parent-layer-checked-true")) {
        evt.target.classList.remove('parent-layer-checked-true');
        evt.target.classList.add('parent-layer-checked-false');
        allOff = true;
      } else {
        evt.target.classList.add('parent-layer-checked-true');
        evt.target.classList.remove('parent-layer-checked-false');
        allOff = false;
      }

      for (var i = 0; i < this.state.data.length; i++) {
        if (this.state.data[i].group === evt.target.parentElement.id && this.state.data[i].isCategory !== true) {
          this.state.data[i].checked = allOff;

          var layerItem = document.querySelectorAll("[data-id='" + this.state.data[i].id + "']")[0]
          layers.push(this.state.data[i].id)
          if (allOff) {

            layerItem.firstChild.classList.remove('layer-checked-true'); //todo: ALL OF THESE SHOULD BE DONE IN REACT COMPUTATIONS ON RENDER!
            layerItem.firstChild.classList.add('layer-checked-false'); // this isn't working b/c I don't think these classes on these elements rely on state in the render function- make them
            layerItem.setAttribute('data-clicked',false);
          } else {

            layerItem.firstChild.classList.remove('layer-checked-false');
            layerItem.firstChild.classList.add('layer-checked-true');

            layerItem.setAttribute('data-clicked',true);
          }
        }
      }

      this.toggleOff(layers, allOff);

    }

  });

  return CommunityLayerList;

});
