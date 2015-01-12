/** @jsx React.DOM */
define([
	'react'
], function (React) {
	'use strict';

	var TreeNode = React.createClass({displayName: "TreeNode",
		/* jshint ignore:start */
		getInitialState: function () {
	    return {
	      collapsed: false
	    };
	  },

	  /**
	  * Update the state of the component to hide or show the children
	  */
	  handleClick: function () {
	    this.setState({
	      collapsed: !this.state.collapsed
	    });
	  },

	  render: function() {
	    var containerClass = this.state.collapsed ? 'collapsed' : '';
	    var node = this.props.node;
	    var childNodes;
	    
	    if (node.children) {
	      childNodes = node.children.map(function (child, index) {
	        return (
	          React.createElement("ul", {key: [node.id, index].join('/')}, 
	            React.createElement(TreeNode, {
	              key: node.id, 
	              node: child, 
	              handleChange: this.props.handleChange}
	            )
	          )
	        );       
	      }, this);
	    }

	    return (
	      React.createElement("li", {className: containerClass}, 
	      	React.createElement("section", {className: "tree-row-content"}, 
		        React.createElement("span", {className: "tree-toggle-symbol", onClick: this.handleClick, onTouchEnd: this.handleClick}, 
		           node.children === undefined ? 
		            '' :
		            (this.state.collapsed ? String.fromCharCode(43) : String.fromCharCode(8722))
		          
		        ), 
		        React.createElement("input", {
		          type: "checkbox", 
		          checked: node.checked || false, 
		          onChange: this.props.handleChange, 
		          "data-key": node.id}
		         ), 
		        React.createElement("span", {className: "tree-node-label", onClick: this.handleClick, onTouchEnd: this.handleClick}, node.label)
		      ), 
	        childNodes
	      )
	    );
	  }
		/* jshint ignore:end */
	});

	return TreeNode;

});