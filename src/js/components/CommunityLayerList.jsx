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

    toggleOff: function () {

    },

    render: function () {
      return (
        <div className='community-layer-list'>
          <div className='community-layer-type'>
            <div className='community-layer-type-label'>Indigenous Lands</div>
            {this.state.data.map(this.layerMapper('indigenousLands'), this)}
          </div>
          <div className='community-layer-type'>
            <div className='community-layer-type-label'>Community Lands</div>
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
          <div className='layer-node' onClick={self.layerClicked} data-id={item.id}>
            <span className='layer-checkbox'></span>
            {item.label}
          </div>
        )
      }
    },

    layerClicked: function (evt) {
      console.log(evt.target.getAttribute('data-id'));
    }

  });

  return CommunityLayerList;

});
