/** @jsx React.DOM */
define([
  'react',
  'components/TreeNode',
  'map/LayerController'
], function (React, TreeNode, LayerController) {
  'use strict';

  /* jshint ignore:start */

  var Tree = React.createClass({displayName: "Tree",

    getInitialState: function () {
      return {
        data: this.props.data
      };
    },
    
    /**
    * this.state.data is kind of like a book keeper of the state of the tree, it knows
    * the state of the whole tree and which nodes are checked, may add which nodes are collapsed
    * or not into this.state.data as well
    */
    handleChange: function (evt) {
      var checked = evt.target.checked;
      var key = evt.target.getAttribute('data-key');
      var activeKeys = [];
      var traverseNodes = function (node) {
        if (node.id === key) {
          node.checked = checked;
          if (node.children) { node.children.forEach(checkAllNodes); }
        }

        // Get a list of active keys while Im in here so I dont have to query the dom or 
        // do some regex to manipulate the visible layers
        if (node.id === key) {
          if (checked) { activeKeys.push(key); }
        } else {
          if (node.checked) { activeKeys.push(node.id); }
        }
          
        if (node.children) {
          node.children.forEach(traverseNodes);
        }
      };
        
      var checkAllNodes = function (node) {
        if (!node.disabled) {
          node.checked = checked;
          if (node.children) { node.children.forEach(checkAllNodes); }
        }
      };
        
      var dataSource = Object.create(this.state.data);
      dataSource.forEach(traverseNodes);
      // Update the Tree Component
      this.setState({ data: dataSource });
      // Update the Layer UI
      LayerController.updateVisibleLayers(activeKeys);
    },
    
    render: function () {
      return (
        React.createElement("ul", {className: "checkbox-tree"}, 
          this.state.data.map(function (node) {
            return (
              React.createElement(TreeNode, {
                key: node.id, 
                node: node, 
                handleChange: this.handleChange}
              )
            );
          }, this)
        )
      );
    }

  });

  return function (data, node) {
    return React.render(React.createElement(Tree, {data: data}), document.getElementById(node));
  }

  /* jshint ignore:end */

});