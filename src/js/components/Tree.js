/** @jsx React.DOM */
define([
  'react',
  'components/TreeNode'
], function (React, TreeNode) {
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
    * the state of the while tree and which nodes are checked, may add which nodes are collapsed
    * or not into this.state.data as well
    */
    handleChange: function (evt) {
      var checked = evt.target.checked;
      var key = evt.target.getAttribute('data-key');
      var traverseNodes = function (node) {
        if (node.id === key) {
          node.checked = checked;
          if (node.children) { node.children.forEach(checkAllNodes); }
        }
          
        if (node.children) {
          node.children.forEach(traverseNodes);
        }
      };
        
      var checkAllNodes = function (node) {
        node.checked = checked;
        if (node.children) { node.children.forEach(checkAllNodes); }
      };
        
      var dataSource = Object.create(this.state.data);
      dataSource.forEach(traverseNodes);
      this.setState({ data: dataSource });
    },
    
    render: function () {
      return (
        React.createElement("ul", {className: "checkbox-tree"}, 
          this.state.data.map(function (node, i) {
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