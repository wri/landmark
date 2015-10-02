/** @jsx React.DOM */
define([
  'react',
  'map/LayerController'
], function (React, LayerController) {
  'use strict';

  var CommunityLayerList = React.createClass({

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
        <div className='community-layer-list'>
          <div className='community-layer-type'>
            <div className='community-layer-type-label'><span className='parent-layer-checked-true'></span>Indigenous Lands</div>
            {this.state.data.map(this.layerMapper('indigenousLands'), this)}
          </div>
          <div className='community-layer-type'>
            <div className='community-layer-type-label'><span className='parent-layer-checked-false'></span>Community Lands</div>
            {this.state.data.map(this.layerMapper('communityLands'), this)}
          </div>
        </div>
      );
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
