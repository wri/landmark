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
      return function (item) {
        return item.group !== group ? null :
        (
          item.isCategory ? <div className='layer-category'>{item.label}</div> :
          <div className='layer-node'>
            {item.label}
          </div>
        )
      }
    }

  });

  return CommunityLayerList;

});
