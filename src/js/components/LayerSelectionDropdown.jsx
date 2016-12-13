/** @jsx React.DOM */
define([
  'react',
  'map/MapConfig',
  'map/LayerController',
  'components/PercentOfCountryList',
  'components/CommunityLayerList',
  'components/IndicatorsOfLegalSecurityList'
], function (React, MapConfig, LayerController, PercentOfCountryList, CommunityLayerList, IndicatorsOfLegalSecurityList) {
  'use strict';

  var SelectionDropdown = React.createClass({

    getInitialState: function () {
      return {
        activeSelection: '',
        selection: this.props.selection,
        data: this.props.layerData,
        change: this.props.change,
        openTab: this.props.openTab,
        title: this.props.title
      };
    },

    clickDropdown: function () {
      console.log(this);
      this.setState({
        activeSelection: this.state.selection
      });
      if (this.state.openTab) {
        this.setState({openTab: false});
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
          item.isCategory ? <div className='layer-category'>{item.label}</div> :
          <div className='layer-node' onClick={self.layerClicked} data-id={item.id} data-clicked={item.checked}>
            <span className={'layer-checked-' + item.checked}></span>
            {item.label}
          </div>
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

      // this.setState({
      //   data: this.state.data
      // });

      this.toggleOff(layers, allOff);

    },

    render: function () {
      console.log(this.state);
      return (
        <div className='layer-selection-drop-container'>
          <span className={'panel-drop-header' + (this.state.openTab ? ' checked' : ' unchecked')}></span><span className='layer-selection-drop-text' onClick={this.clickDropdown}>{this.state.title}</span>
          {this.state.data ?
          <div className={'national-layer-selection-label' + (this.state.activeSelection === 'community-lands' && this.state.openTab ? '': ' hidden')}>
            <div className='community-layer-type'>
              <div className='community-layer-type-label' id='indigenousLands'><span className='parent-layer-checked-true' onClick={this.parentClicked}></span>Indigenous Lands<span id='indigenous-lands-help' className='parent-layer-help' onClick={this.showHelp}></span></div>
              {this.state.data.map(this.layerMapper('indigenousLands'), this)}
            </div>
            <div className='national-layer-selection-label'>
              <div className='community-layer-type-label' id='communityLands'><span className='parent-layer-checked-true' onClick={this.parentClicked}></span>Community Lands<span id='community-lands-help' className='parent-layer-help' onClick={this.showHelp}></span></div>
              {this.state.data.map(this.layerMapper('communityLands'), this)}
            </div>
          </div>
        : null }
          <div className={(this.state.activeSelection === 'percent-indigenous' && this.state.openTab ? '': 'hidden') + ' national-layer-selection-label'}>
            <PercentOfCountryList data={MapConfig.percentIndigenousLayersCombined} change={this.state.changePercentIndigenousLayer}/>
          </div>
          <div className={(this.state.activeSelection === 'land-tenure' && this.state.openTab ? '': 'hidden') + ' national-layer-selection-label'}>
            <IndicatorsOfLegalSecurityList data={MapConfig.landTenureCommunityLayers} change={this.state.changeLandTenureLayer}/>
          </div>
        </div>
      );
    }

  });

  return SelectionDropdown;

});
