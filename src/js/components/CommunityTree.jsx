/** @jsx React.DOM */
define([
  'react',
  'components/CommunityTreeNode',
  'map/LayerController'
], function (React, CommunityTreeNode, LayerController) {
  'use strict';

  /* jshint ignore:start */

  var CommunityTree = React.createClass({

    getInitialState: function () {
      return {
        data: this.props.data,
        active: ''
      };
    },
    
    /**
    * this.state.data is kind of like a book keeper of the state of the tree, it knows
    * the state of the whole tree and which nodes are checked, may add which nodes are collapsed
    * or not into this.state.data as well
    */
    handleChange: function (evt) {
      var key = evt.target.getAttribute('data-key');

      this.setState({active: key})

      var activeKeys = [];

      if (this.state.data[0].children) {
        for (var i = 0; i < this.state.data[0].children.length; i++) {
          if (this.state.data[0].children[i].id === key) {
            activeKeys.push(key);
          }
        }
        this.state.data = this.state.data[0].children;
      } else {
        for (var i = 0; i < this.state.data.length; i++) {
          if (this.state.data[i].id === key) {
            activeKeys.push(key);
          }
        }
      }

      var dataSource = Object.create(this.state.data);

      //dataSource.forEach(traverseNodes);
      // Update the Tree Component
      this.setState({ data: dataSource });
      // Update the Layer UI
      //LayerController.updateVisibleLayers(activeKeys); //TODO When we get data
    },
    
    render: function () {
      return (
        <ul className='checkbox-tree'>
          {this.state.data.map(function (node) {
            console.log(node);
            console.log(this.state.active);
            console.log(this.state.data);
            return (
              <CommunityTreeNode
                key={node.id}
                node={node}
                handleChange={this.handleChange}
                active={node.id==this.state.active}
              />
            );
          }, this)}
        </ul>
      );
    }

  });

  return function (data, node) {
    return React.render(<CommunityTree data={data} />, document.getElementById(node));
  }

  /* jshint ignore:end */

});