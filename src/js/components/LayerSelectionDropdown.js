/** @jsx React.DOM */
define([
  'react',
  'map/MapConfig',
  'map/LayerController',
  'components/PercentOfCountryList',
  'components/IndigAndCommLandMap',
  'components/IndicatorsOfLegalSecurityList',
	'map/WidgetsController'
], function (React, MapConfig, LayerController, PercentOfCountryList, IndigAndCommLandMaps, IndicatorsOfLegalSecurityList, WidgetsController) {
  'use strict';

  var SelectionDropdown = React.createClass({displayName: "SelectionDropdown",

    getInitialState: function () {
      return {
        activeSelection: '',
        selection: this.props.selection,
        data: this.props.layerData,
        change: this.props.change,
        openTab: false,
        title: this.props.title,
        activePercentIndigenousLayer: 1,
        activeCommunityKey: MapConfig.landTenureCommunityLayers[0].id,
        activeIndigenousKey: MapConfig.landTenureIndigenousLayers[0].id
      };
    },

    clickDropdown: function () {
      if (!brApp.layerInfos) {
        return;
      }
      this.setState({
        activeSelection: this.state.selection
      });
      if (this.state.openTab) {
        this.setState({openTab: false});
        this.setState({
          activeSelection: ''
        });
      } else {
        this.setState({openTab: true});
      }
    },

    toggleOff: function (layers, off) {

      LayerController.updateVisibleLayers(layers, false, off);
      // LayerController.updateVisibleLayers(keys, isNationalLevelData)
    },

    layerMapper: function (group) {
      var self = this;

      return function (item) {
        return item.group !== group ? null :
        (
          item.isCategory ? React.createElement("div", {className: "layer-category"}, item.label) :
          React.createElement("div", {className: "layer-node", onClick: self.layerClicked, "data-id": item.id, "data-clicked": item.checked}, 
            React.createElement("span", {className: 'layer-checked-' + item.checked + ' ' + item.id}), 
            React.createElement("span", {className: "layer-checkbox-text"}, item.label)
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
        if (evt.target.classList.contains('layer-checkbox-text')) {
          evt.target.previousSibling.classList.remove('layer-checked-true');
          evt.target.previousSibling.classList.add('layer-checked-false');
        } else {
          evt.target.classList.remove('layer-checked-true');
          evt.target.classList.add('layer-checked-false');
        }
        evt.target.parentElement.setAttribute('data-clicked',false);
      } else {
        if (evt.target.classList.contains('layer-checkbox-text')) {
          evt.target.previousSibling.classList.add('layer-checked-true');
          evt.target.previousSibling.classList.remove('layer-checked-false');
        } else {
          evt.target.classList.add('layer-checked-true');
          evt.target.classList.remove('layer-checked-false');
        }
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
    },


    render: function () {
      return (
        React.createElement("div", {className: "layer-selection-drop-container"}, 
          React.createElement("div", {className: "left-panel-headers"}, 
            React.createElement("div", {className: 'panel-drop-header' + (this.state.openTab ? ' checked' : ' unchecked'), onClick: this.clickDropdown}), 
            React.createElement("div", {className: 'layer-selection-drop-text' + (this.props.selection === 'community-lands' ? ' land-map-layer-selection' : ''), onClick: this.clickDropdown}, this.state.title), 
            this.state.activeSelection === 'community-lands' ?
              React.createElement("div", {className: "disclaimer"}, "Note that the absence of data does not indicate the absence of indigenous or community land")
              : null
            
          ), 
          this.state.activeSelection === 'community-lands' ?
          React.createElement("div", {id: "IndigAndCommLandMaps", className: 'national-layer-selection-label' + (this.state.openTab ? ' active-panel': 'hidden')}, 
            React.createElement(IndigAndCommLandMaps, {data: MapConfig.communityLevelLayers, layerMapper: this.layerMapper, parentClicked: this.parentClicked, showHelp: this.showHelp})
          )
          : null, 
        this.state.activeSelection === 'percent-indigenous' ?
          React.createElement("div", {id: "PercentOfCountryList", className: 'national-layer-selection-label' + (this.state.openTab ? ' active-panel': 'hidden')}, 
            React.createElement(PercentOfCountryList, {activeTab: this.props.activeTab, setActiveTab: this.props.setActiveTab, activeSelection: this.state.activeSelection, data: MapConfig.percentIndigenousLayersCombined})
          )
          : null, 
          this.state.activeSelection === 'land-tenure' ?
          React.createElement("div", {id: "IndicatorsOfLegalSecurityList", className: 'national-layer-selection-label' + (this.state.openTab ? ' active-panel': 'hidden')}, 
            React.createElement(IndicatorsOfLegalSecurityList, {activeTab: this.props.activeTab, setActiveTab: this.props.setActiveTab, activeSelection: this.state.activeSelection, data: MapConfig.landTenureCommunityLayers})
          )
          : null
        )
      );
    }

  });

  return SelectionDropdown;

});
