/** @jsx React.DOM */
define([
  'react',
  'map/MapConfig',
  'components/NationalLayerList',
  'components/CommunityLayerList'
], function (React, MapConfig, NationalLayerList, CommunityLayerList) {
  'use strict';

  var TabContainer = React.createClass({

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
        <div className='layer-tab-container'>
          <div className='layer-tab-controls'>
            <div onClick={this.toggleTab} className={'community-tab' + (this.state.activeTab === 'community' ? ' active': '')}>
              Community Level
            </div>
            <div onClick={this.toggleTab} className={'community-tab' + (this.state.activeTab === 'national' ? ' active': '')}>
              National Level
            </div>
          </div>
          <div className='layer-tab-content'>
            <div className={'community-layers-tab tab-panel' + (this.state.activeTab === 'community' ? '': ' hidden')}>
              <CommunityLayerList data={MapConfig.communityLevelLayers} />
            </div>
            <div className={'national-layers-tab tab-panel' + (this.state.activeTab === 'national' ? '': ' hidden')}>
              <NationalLayerList />
            </div>
          </div>
        </div>
      );
    }

  });

  return function (node) {
    return React.render(<TabContainer />, document.getElementById(node));
  };

});
