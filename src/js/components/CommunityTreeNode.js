/** @jsx React.DOM */
define([
	'react'
], function (React) {
	'use strict';

	var CommunityTreeNode = React.createClass({displayName: "CommunityTreeNode",
		/* jshint ignore:start */
		getInitialState: function () {
	    return {
	      collapsed: this.props.node.collapsed || false
	    };
	  },

	  /**
	  * Update the state of the component to hide or show the children
	  */
	  handleClick: function (evt) {
	  	if (this.props.node.disabled) {
	  		return;
	  	}

	    this.setState({
	      collapsed: !this.state.collapsed
	    });
	  },

	  // handleInfo: function (evt) {
	  // 	<span visible={this.props.node.info || false} className='tree-node-info' onClick={this.handleInfo}>{node.info}</span>
	  // 	debugger;
	  // },

	  render: function() {
	    var containerClass = this.state.collapsed ? 'collapsed' : '';
	    var node = this.props.node;
	    var disabled = node.disabled || false;
	    var childNodes;

	    containerClass += (disabled ? ' disabled' : '');
	    //containerClass = '';
	    if (node.children) {
	      childNodes = node.children.map(function (child, index) {
	      	child.disabled = child.disabled || disabled;
	        return (
	          React.createElement("ul", {key: [node.id, index].join('/')}, 
	            React.createElement(CommunityTreeNode, {
	              key: node.id, 
	              node: child, 
	              handleChange: this.props.handleChange}
	            )
	          )
	        );       
	      }, this);
	    }

	    return (


	      React.createElement("div", {className:  this.props.active ? "national-active-indicator" : null}, 


		      React.createElement("li", {className: containerClass}, 
		      	
			        React.createElement("span", {className: "tree-toggle-symbol", onClick: this.handleClick}, 
			           node.children === undefined ? 
			            '' :
			            (this.state.collapsed ? String.fromCharCode(43) : String.fromCharCode(8722))
			          
			        ), 

			         node.info ? 
						(React.createElement("span", null, React.createElement("span", {className: "tree-node-label", onClick: this.handleClick}, node.label), 
						React.createElement("span", {id: "community-lands-help", className: "help-marker"}))) : (React.createElement("span", {className: "tree-node-label", onChange: this.props.handleChange, "data-key": node.id, onClick: this.props.handleChange}, node.label)), 
					

			     
		        childNodes
		      )
		     )
	    );

	    
	  }
		/* jshint ignore:end */
	});

	return CommunityTreeNode;

});